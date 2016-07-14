import qq from 'fine-uploader'
import React from 'react'
import TestUtils from 'react-addons-test-utils'

import Thumbnail, { defaultMaxSize, notAvailableStatus, waitingStatus } from 'src/components/thumbnail'

describe('<Thumbnail />', () => {
    let drawThumbnail, qqPromise, uploader

    beforeEach(() => {
        drawThumbnail = jasmine.createSpy('drawThumbnail')

        qqPromise = new qq.Promise()

        uploader = {
            methods: { drawThumbnail }
        }
    })

    it('renders thumbnail as canvas using default values', () => {
        qqPromise.success()
        drawThumbnail.and.returnValue(qqPromise)

        const ThumbnailComponent = TestUtils.renderIntoDocument(
            <Thumbnail id={ 3 } uploader={ uploader } />
        )

        expect(ThumbnailComponent.refs.canvas.hasAttribute('hidden')).toBeFalsy()
        expect(drawThumbnail).toHaveBeenCalledWith(3, ThumbnailComponent.refs.canvas, defaultMaxSize)
    })

    it('renders thumbnail as canvas using passed size', () => {
        qqPromise.success()
        drawThumbnail.and.returnValue(qqPromise)

        const ThumbnailComponent = TestUtils.renderIntoDocument(
            <Thumbnail id={ 3 } maxSize={ 333 } uploader={ uploader } />
        )

        expect(ThumbnailComponent.refs.canvas.hasAttribute('hidden')).toBeFalsy()
        expect(drawThumbnail).toHaveBeenCalledWith(3, ThumbnailComponent.refs.canvas, 333)
    })

    it('renders waiting placeholder until thumbnail generation is complete', () => {
        drawThumbnail.and.returnValue(qqPromise)

        const ThumbnailComponent = TestUtils.renderIntoDocument(
            <Thumbnail id={ 3 } uploader={ uploader } />
        )
        const placeholderEls = TestUtils.scryRenderedDOMComponentsWithClass(ThumbnailComponent, `react-fine-uploader-thumbnail-${waitingStatus}`)

        expect(ThumbnailComponent.refs.canvas.hasAttribute('hidden')).toBeTruthy()
        expect(placeholderEls.length).toBe(1)
    })

    it('renders "not available" placeholder if thumbnail generation fails', () => {
        qqPromise.failure()
        drawThumbnail.and.returnValue(qqPromise)

        const ThumbnailComponent = TestUtils.renderIntoDocument(
            <Thumbnail id={ 3 } uploader={ uploader } />
        )
        const placeholderEls = TestUtils.scryRenderedDOMComponentsWithClass(ThumbnailComponent, `react-fine-uploader-thumbnail-${notAvailableStatus}`)

        expect(ThumbnailComponent.refs.canvas.hasAttribute('hidden')).toBeTruthy()
        expect(placeholderEls.length).toBe(1)
    })
})
