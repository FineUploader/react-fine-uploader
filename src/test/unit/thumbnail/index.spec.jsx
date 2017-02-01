import qq from 'fine-uploader/lib/core/all'
import React from 'react'
import TestUtils from 'react-addons-test-utils'

import Thumbnail, { defaultMaxSize, notAvailableStatus, waitingStatus } from 'src/thumbnail'

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

    it('renders default waiting placeholder until thumbnail generation is complete', () => {
        drawThumbnail.and.returnValue(qqPromise)

        const ThumbnailComponent = TestUtils.renderIntoDocument(
            <Thumbnail id={ 3 } uploader={ uploader } />
        )
        const placeholderEls = TestUtils.scryRenderedDOMComponentsWithClass(ThumbnailComponent, `react-fine-uploader-thumbnail-${waitingStatus}`)

        expect(ThumbnailComponent.refs.canvas.hasAttribute('hidden')).toBeTruthy()
        expect(placeholderEls.length).toBe(1)
    })

    it('renders custom waiting placeholder, if provided, until thumbnail generation is complete', () => {
        const customWaitingSvg = (
            <svg className='custom-waiting-thumbnail' width='40px' height='40px' viewBox='0 0 40 40' version='1.1'>
                <path opacity='0.2' fill='#000' d='M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z'/>
                <path fill='#000' d='M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z'>
                    <animateTransform attributeName='transform'
                                      type='rotate'
                                      from='0 20 20'
                                      to='360 20 20'
                                      dur='0.5s'
                                      repeatCount='indefinite'/>
                </path>
            </svg>
        )
        drawThumbnail.and.returnValue(qqPromise)

        const ThumbnailComponent = TestUtils.renderIntoDocument(
            <Thumbnail id={ 3 } uploader={ uploader } waitingPlaceholder={ customWaitingSvg } />
        )
        const customWaitingThumbnailEl = TestUtils.findRenderedDOMComponentWithClass(ThumbnailComponent, 'custom-waiting-thumbnail')

        expect(ThumbnailComponent.refs.canvas.hasAttribute('hidden')).toBeTruthy()
        expect(customWaitingThumbnailEl).toBeDefined()
    })

    it('renders default "not available" placeholder if thumbnail generation fails', () => {
        qqPromise.failure()
        drawThumbnail.and.returnValue(qqPromise)

        const ThumbnailComponent = TestUtils.renderIntoDocument(
            <Thumbnail id={ 3 } uploader={ uploader } />
        )
        const placeholderEls = TestUtils.scryRenderedDOMComponentsWithClass(ThumbnailComponent, `react-fine-uploader-thumbnail-${notAvailableStatus}`)

        expect(ThumbnailComponent.refs.canvas.hasAttribute('hidden')).toBeTruthy()
        expect(placeholderEls.length).toBe(1)
    })

    it('renders custom "not available" placeholder, if provided, if thumbnail generation fails', () => {
        const customNotAvailableSvg = (
            <svg className='not-available-svg' height='300px' width='300px' version='1.0' viewBox='-300 -300 600 600'>
                <circle stroke='#AAA' strokeWidth='10' r='280' fill='#FFF'/>
                <text style={{
                    letterSpacing: 1,
                    textAnchor: 'middle',
                    textAlign: 'center',
                    strokeOpacity: 0.5,
                    stroke: '#000',
                    strokeWidth: 2,
                    fill: '#444',
                    fontSize: '360px',
                    fontFamily: 'Bitstream Vera Sans,Liberation Sans, Arial, sans-serif',
                    lineHeight: '125%',
                    writingMode: 'lr-tb'}}
                      transform='scale(0.2)'>
                    <tspan y='-40' x='8'>NO IMAGE</tspan>
                    <tspan y='400' x='8'>AVAILABLE</tspan>
                </text>
            </svg>
        )
        qqPromise.failure()
        drawThumbnail.and.returnValue(qqPromise)

        const ThumbnailComponent = TestUtils.renderIntoDocument(
            <Thumbnail id={ 3 } uploader={ uploader } notAvailablePlaceholder={customNotAvailableSvg} />
        )
        const notAvailableSvgEl = TestUtils.findRenderedDOMComponentWithClass(ThumbnailComponent, 'not-available-svg')

        expect(ThumbnailComponent.refs.canvas.hasAttribute('hidden')).toBeTruthy()
        expect(notAvailableSvgEl).toBeDefined()
    })
})
