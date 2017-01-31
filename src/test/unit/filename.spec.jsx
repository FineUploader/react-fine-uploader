import React from 'react'
import TestUtils from 'react-addons-test-utils'

import FineUploaderTraditional from 'fine-uploader-wrappers'
import Filename from 'src/filename'

const sampleBlob = new Blob(['hi!'], { type : 'text/plain' })
const sampleBlobWrapper = { blob: sampleBlob, name: 'test' }

describe('<Filename />', () => {
    it('renders initial filename', () => {
        const uploader = new FineUploaderTraditional({
            options: {
                autoUpload: false
            }
        })

        uploader.methods.addFiles(sampleBlobWrapper)

        const FilenameComponent = TestUtils.renderIntoDocument(<Filename id={ 0 } uploader={ uploader }/>)
        const filenameEl = TestUtils.findRenderedDOMComponentWithClass(FilenameComponent, 'react-fine-uploader-filename')

        expect(filenameEl.textContent).toBe('test')
    })

    it('updates filename on setName', () => {
        const uploader = new FineUploaderTraditional({
            options: {
                autoUpload: false
            }
        })

        uploader.methods.addFiles(sampleBlobWrapper)

        const FilenameComponent = TestUtils.renderIntoDocument(<Filename id={ 0 } uploader={ uploader }/>)

        uploader.methods.setName(0, 'new-name')
        const filenameEl = TestUtils.findRenderedDOMComponentWithClass(FilenameComponent, 'react-fine-uploader-filename')
        expect(filenameEl.textContent).toBe('new-name')
    })
})
