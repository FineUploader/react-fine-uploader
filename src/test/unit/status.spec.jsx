import React from 'react'
import TestUtils from 'react-addons-test-utils'

import Status from 'src/status'
import FineUploaderTraditional from 'fine-uploader-wrappers'

describe('<Status />', () => {
    const getStatus = () => (
        TestUtils.findRenderedDOMComponentWithClass(StatusComponent, 'react-fine-uploader-status').textContent
    )
    let StatusComponent, statusChangeCallback, uploader

    beforeEach(() => {
        uploader = new FineUploaderTraditional({ options: {} })

        spyOn(uploader, 'on').and.callFake((type, callback) => {
            if (type === 'statusChange') {
                statusChangeCallback = callback
            }
        })

        StatusComponent = TestUtils.renderIntoDocument(
            <Status id={ 0 } uploader={ uploader } />
        )
    })

    it('render nothing for a different file', () => {
        statusChangeCallback(1, 'upload successful', 'deleting')

        expect(getStatus()).toBe('')
    })

    it('render nothing for an untracked status value', () => {
        statusChangeCallback(0, 'deleting', 'delete failed')

        expect(getStatus()).toBe('')
    })

    it('renders correct default text for a single-word status value', () => {
        statusChangeCallback(0, 'upload successful', 'deleting')

        expect(getStatus()).toBe('Deleting...')
    })

    it('renders correct default text for a two-word status value', () => {
        statusChangeCallback(0, 'uploading', 'upload successful')

        expect(getStatus()).toBe('Completed')
    })

    it('renders custom text for a status value', () => {
        StatusComponent = TestUtils.renderIntoDocument(
            <Status id={ 0 } text={ { upload_successful: 'Success' } } uploader={ uploader } />
        )

        statusChangeCallback(0, 'uploading', 'upload successful')
        expect(getStatus()).toBe('Success')

        statusChangeCallback(0, 'uploading', 'upload failed')
        expect(getStatus()).toBe('Failed')
    })
})
