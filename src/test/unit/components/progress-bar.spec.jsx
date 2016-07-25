import React from 'react'
import TestUtils from 'react-addons-test-utils'

import FineUploaderTraditional from 'src/wrappers/traditional'
import ProgressBar from 'src/components/progress-bar'

describe('<ProgressBar />', () => {
    it('renders total progress bar when a file ID is not supplied & updates progress appropriately', () => {
        const uploader = new FineUploaderTraditional({options: {}})
        let totalProgressCallback
        spyOn(uploader, 'on').and.callFake((type, callback) => {
            if (type === 'totalProgress') {
                totalProgressCallback = callback
            }
        })

        const ProgressBarComponent = TestUtils.renderIntoDocument(<ProgressBar uploader={ uploader } />)

        const fileProgressEls = TestUtils.scryRenderedDOMComponentsWithClass(ProgressBarComponent, 'react-fine-uploader-file-progress-bar')
        const totalProgressEls = TestUtils.scryRenderedDOMComponentsWithClass(ProgressBarComponent, 'react-fine-uploader-total-progress-bar')

        expect(fileProgressEls.length).toBe(0)
        expect(totalProgressEls.length).toBe(1)

        totalProgressCallback(100, 1000)
        const totalProgressEl = TestUtils.findRenderedDOMComponentWithClass(ProgressBarComponent, 'react-fine-uploader-total-progress-bar')
        expect(totalProgressEl.value).toBe(100)
        expect(totalProgressEl.max).toBe(1000)
    })

    it('renders file progress bar when a file ID is supplied & updates progress appropriately', () => {
        const uploader = new FineUploaderTraditional({options: {}})
        let fileProgressCallback
        spyOn(uploader, 'on').and.callFake((type, callback) => {
            if (type === 'progress') {
                fileProgressCallback = callback
            }
        })

        const ProgressBarComponent = TestUtils.renderIntoDocument(<ProgressBar id={ 3 } uploader={ uploader } />)

        const fileProgressEls = TestUtils.scryRenderedDOMComponentsWithClass(ProgressBarComponent, 'react-fine-uploader-file-progress-bar')
        const totalProgressEls = TestUtils.scryRenderedDOMComponentsWithClass(ProgressBarComponent, 'react-fine-uploader-total-progress-bar')

        expect(fileProgressEls.length).toBe(1)
        expect(totalProgressEls.length).toBe(0)

        fileProgressCallback(3, 'foo.jpeg', 100, 1000)
        const fileProgressEl = TestUtils.findRenderedDOMComponentWithClass(ProgressBarComponent, 'react-fine-uploader-file-progress-bar')
        expect(fileProgressEl.value).toBe(100)
        expect(fileProgressEl.max).toBe(1000)
    })

    it('hides total progress bar initially, by default', () => {
        const uploader = new FineUploaderTraditional({options: {}})
        const ProgressBarComponent = TestUtils.renderIntoDocument(<ProgressBar uploader={ uploader } />)
        const totalProgressEl = TestUtils.findRenderedDOMComponentWithClass(ProgressBarComponent, 'react-fine-uploader-total-progress-bar')

        expect(totalProgressEl.hasAttribute('hidden')).toBeTruthy()
    })
    
    it('does not hide total progress bar initially, if ordered to do so', () => {
        const uploader = new FineUploaderTraditional({options: {}})
        const ProgressBarComponent = TestUtils.renderIntoDocument(
            <ProgressBar hideBeforeStart={ false } uploader={ uploader } />
        )
        const totalProgressEl = TestUtils.findRenderedDOMComponentWithClass(ProgressBarComponent, 'react-fine-uploader-total-progress-bar')

        expect(totalProgressEl.hasAttribute('hidden')).toBeFalsy()
    })

    it('hides file progress bar initially, by default', () => {
        const uploader = new FineUploaderTraditional({options: {}})
        const ProgressBarComponent = TestUtils.renderIntoDocument(<ProgressBar id={ 3 } uploader={ uploader } />)
        const fileProgressEl = TestUtils.findRenderedDOMComponentWithClass(ProgressBarComponent, 'react-fine-uploader-file-progress-bar')

        expect(fileProgressEl.hasAttribute('hidden')).toBeTruthy()
    })

    it('does not hide file progress bar initially, if ordered to do so', () => {
        const uploader = new FineUploaderTraditional({options: {}})
        const ProgressBarComponent = TestUtils.renderIntoDocument(
            <ProgressBar hideBeforeStart={ false } id={ 3 } uploader={ uploader } />
        )
        const fileProgressEl = TestUtils.findRenderedDOMComponentWithClass(ProgressBarComponent, 'react-fine-uploader-file-progress-bar')

        expect(fileProgressEl.hasAttribute('hidden')).toBeFalsy()
    })

    it('hides total progress bar after all uploads are complete, by default', () => {
        const uploader = new FineUploaderTraditional({options: {}})

        let statusChangeCallback
        spyOn(uploader, 'on').and.callFake((type, callback) => {
            if (type === 'statusChange') {
                statusChangeCallback = callback
            }
        })

        const ProgressBarComponent = TestUtils.renderIntoDocument(<ProgressBar uploader={ uploader } />)

        // uploading
        statusChangeCallback(3, 'QUEUED', 'UPLOADING')
        statusChangeCallback(4, 'QUEUED', 'UPLOADING')
        let totalProgressEl = TestUtils.findRenderedDOMComponentWithClass(ProgressBarComponent, 'react-fine-uploader-total-progress-bar')
        expect(totalProgressEl.hasAttribute('hidden')).toBeFalsy()

        // still uploading
        spyOn(uploader.methods, 'getInProgress').and.returnValue(1)
        statusChangeCallback(3, 'UPLOADING', 'UPLOAD_SUCCESSFUL')
        totalProgressEl = TestUtils.findRenderedDOMComponentWithClass(ProgressBarComponent, 'react-fine-uploader-total-progress-bar')
        expect(totalProgressEl.hasAttribute('hidden')).toBeFalsy()

        // done uploading
        uploader.methods.getInProgress.and.returnValue(0)
        statusChangeCallback(4, 'UPLOADING', 'UPLOAD_SUCCESSFUL')
        totalProgressEl = TestUtils.findRenderedDOMComponentWithClass(ProgressBarComponent, 'react-fine-uploader-total-progress-bar')
        expect(totalProgressEl.hasAttribute('hidden')).toBeTruthy()
    })

    it('hides file progress bar after upload is complete, by default', () => {
        const uploader = new FineUploaderTraditional({options: {}})

        let statusChangeCallback
        spyOn(uploader, 'on').and.callFake((type, callback) => {
            if (type === 'statusChange') {
                statusChangeCallback = callback
            }
        })

        const ProgressBarComponent = TestUtils.renderIntoDocument(<ProgressBar id={ 3 } uploader={ uploader } />)

        // uploading
        statusChangeCallback(3, 'QUEUED', 'UPLOADING')
        let fileProgressEl = TestUtils.findRenderedDOMComponentWithClass(ProgressBarComponent, 'react-fine-uploader-file-progress-bar')
        expect(fileProgressEl.hasAttribute('hidden')).toBeFalsy()

        // done uploading
        statusChangeCallback(3, 'UPLOADING', 'UPLOAD_SUCCESSFUL')
        fileProgressEl = TestUtils.findRenderedDOMComponentWithClass(ProgressBarComponent, 'react-fine-uploader-file-progress-bar')
        expect(fileProgressEl.hasAttribute('hidden')).toBeTruthy()
    })
})
