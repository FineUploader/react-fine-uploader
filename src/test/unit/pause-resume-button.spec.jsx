import React from 'react'
import TestUtils from 'react-addons-test-utils'

import FineUploaderTraditional from 'fine-uploader-wrappers'
import PauseResumeButton from 'src/pause-resume-button'

describe('<PauseResumeButton />', () => {
    let resumeCallback,
        statusChangeCallback,
        uploadChunkSuccessCallback,
        uploader

    beforeEach(() => {
        uploader = new FineUploaderTraditional({options: {}})

        spyOn(uploader, 'on').and.callFake((type, callback) => {
            if (type === 'statusChange') {
                statusChangeCallback = callback
            }
            else if (type === 'uploadChunkSuccess') {
                uploadChunkSuccessCallback = callback
            }
            else if (type === 'resume') {
                resumeCallback = callback
            }
        })
    })

    it('by default renders a disabled pause button until the first chunk has been uploaded', () => {
        const PauseResumeButtonComponent = TestUtils.renderIntoDocument(
            <PauseResumeButton id={ 0 } uploader={ uploader } />
        )

        let button = TestUtils.scryRenderedDOMComponentsWithClass(PauseResumeButtonComponent, 'react-fine-uploader-pause-button')[0]
        expect(button).toBeFalsy()

        uploadChunkSuccessCallback(0, { partIndex: 3 })
        button = TestUtils.scryRenderedDOMComponentsWithClass(PauseResumeButtonComponent, 'react-fine-uploader-pause-button')[0]
        expect(button).toBeTruthy()
    })

    it('by default disables the pause button again when the upload is no longer actionable', () => {
        const PauseResumeButtonComponent = TestUtils.renderIntoDocument(
            <PauseResumeButton id={ 0 } uploader={ uploader } />
        )

        uploadChunkSuccessCallback(0, { partIndex: 1 })
        statusChangeCallback(0, null, 'deleted')
        const button = TestUtils.scryRenderedDOMComponentsWithClass(PauseResumeButtonComponent, 'react-fine-uploader-pause-button')[0]
        expect(button).toBeFalsy()
    })

    it('allows a paused upload to be resumed and then paused again', () => {
        const PauseResumeButtonComponent = TestUtils.renderIntoDocument(
            <PauseResumeButton id={ 0 } uploader={ uploader } />
        )

        uploadChunkSuccessCallback(0, { partIndex: 7 })

        statusChangeCallback(0, null, 'paused')
        let button = TestUtils.scryRenderedDOMComponentsWithClass(PauseResumeButtonComponent, 'react-fine-uploader-resume-button')[0]
        expect(button).toBeTruthy()

        const resumeUploadMethod = spyOn(uploader.methods, 'continueUpload')
        TestUtils.Simulate.click(button)
        expect(resumeUploadMethod).toHaveBeenCalledWith(0)

        statusChangeCallback(0, null, 'uploading')
        button = TestUtils.scryRenderedDOMComponentsWithClass(PauseResumeButtonComponent, 'react-fine-uploader-pause-resume-button')[0]
        expect(button).toBeTruthy()
        expect(button.className.indexOf('react-fine-uploader-pause-button')).not.toBe(-1)
        expect(button.className.indexOf('react-fine-uploader-resume-button')).toBe(-1)

        const pauseUploadMethod = spyOn(uploader.methods, 'pauseUpload')
        TestUtils.Simulate.click(button)
        expect(pauseUploadMethod).toHaveBeenCalledWith(0)
        statusChangeCallback(0, null, 'paused')
        button = TestUtils.scryRenderedDOMComponentsWithClass(PauseResumeButtonComponent, 'react-fine-uploader-pause-resume-button')[0]
        expect(button).toBeTruthy()
        expect(button.className.indexOf('react-fine-uploader-pause-button')).toBe(-1)
        expect(button.className.indexOf('react-fine-uploader-resume-button')).not.toBe(-1)
    })

    it('allows a resumed file to be paused immediately', () => {
        const PauseResumeButtonComponent = TestUtils.renderIntoDocument(
            <PauseResumeButton id={ 0 } uploader={ uploader } />
        )

        resumeCallback(0, { partIndex: 3 })

        let button = TestUtils.scryRenderedDOMComponentsWithClass(PauseResumeButtonComponent, 'react-fine-uploader-pause-button')[0]
        expect(button).toBeTruthy()
        expect(button.className.indexOf('react-fine-uploader-pause-button')).not.toBe(-1)
        expect(button.className.indexOf('react-fine-uploader-resume-button')).toBe(-1)
    })
})
