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
    })
    
    it('hides total progress bar initially, if ordered to do so', () => {
        
    })
    
    it('hides file progress bar initially, if ordered to do so', () => {

    })

    it('hides total progress bar after all uploads are complete, if ordered to do so', () => {
        
    })

    it('hides file progress bar after upload is complete, if ordered to do so', () => {

    })
})
