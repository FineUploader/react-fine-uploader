import React from 'react'
import TestUtils from 'react-addons-test-utils'

import RetryButton from 'src/retry-button'
import FineUploaderTraditional from 'fine-uploader-wrappers'

describe('<RetryButton />', () => {
    const getButton = () => (
        TestUtils.scryRenderedDOMComponentsWithClass(
            RetryButtonComponent, 'react-fine-uploader-retry-button'
        )[0]
    )

    let onCompleteCallback, RetryButtonComponent, uploader

    const makeUploader = ({ options, onlyRenderIfRetryable }) => {
        uploader = new FineUploaderTraditional({ options })

        spyOn(uploader, 'on').and.callFake((type, callback) => {
            if (type === 'complete') {
                onCompleteCallback = callback
            }
        })

        if (onlyRenderIfRetryable != null) {
            RetryButtonComponent = TestUtils.renderIntoDocument(
                <RetryButton id={ 0 }
                             onlyRenderIfRetryable={ onlyRenderIfRetryable }
                             uploader={ uploader }
                />
            )
        }
        else {
            RetryButtonComponent = TestUtils.renderIntoDocument(
                <RetryButton id={ 0 } uploader={ uploader } />
            )
        }

    }

    it('does not display retry button by default if upload has not failed', () => {
        makeUploader({ options: {} })

        onCompleteCallback(0, 'foo.bar', { success: true })
        expect(getButton()).toBeFalsy()
    })

    it('disables retry button if upload has not failed', () => {
        makeUploader({ options: {}, onlyRenderIfRetryable: false })

        onCompleteCallback(0, 'foo.bar', { success: true })
        expect(getButton().disabled).toBeTruthy()
    })

    it('displays retry button if upload has failed', () => {
        makeUploader({ options: {} })

        onCompleteCallback(0, 'foo.bar', { success: false })
        expect(getButton().disabled).toBeFalsy()
    })

    it('retries upload if button has been clicked', () => {
        makeUploader({ options: {} })

        onCompleteCallback(0, 'foo.bar', { success: false })

        spyOn(uploader.methods, 'retry')
        TestUtils.Simulate.click(getButton())
        expect(uploader.methods.retry).toHaveBeenCalledWith(0)
    })

    it('does not display retry button by default if upload has failed and retries are forbidden (default response property)', () => {
        makeUploader({ options: {} })

        onCompleteCallback(0, 'foo.bar', { success: false, preventRetry: true })
        expect(getButton()).toBeFalsy()
    })

    it('does not display retry button by default if upload has failed and retries are forbidden (custom response property)', () => {
        makeUploader({
            options: {
                retry: {
                    preventRetryResponseProperty: 'dontDareRetry'
                }
            }
        })

        onCompleteCallback(0, 'foo.bar', { success: false, dontDareRetry: true })
        expect(getButton()).toBeFalsy()
    })

    it('disables retry button if upload has failed and retries are forbidden', () => {
        makeUploader({ options: {}, onlyRenderIfRetryable: false })

        onCompleteCallback(0, 'foo.bar', { success: false, preventRetry: true })
        expect(getButton().disabled).toBeTruthy()
    })
})
