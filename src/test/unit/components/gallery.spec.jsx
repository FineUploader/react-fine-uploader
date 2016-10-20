import React from 'react'
import TestUtils from 'react-addons-test-utils'

import Dropzone from 'src/components/dropzone'
import FileInput from 'src/components/file-input'
import FineUploaderTraditional from 'src/wrappers/traditional'
import Gallery from 'src/components/gallery'

const sampleBlob = new Blob(['hi!'], { type : 'text/plain' })
const sampleBlobWrapper = { blob: sampleBlob, name: 'test' }

describe('<Gallery />', () => {
    let uploader

    beforeEach(() => {
        uploader = new FineUploaderTraditional({
            options: {
                autoUpload: false
            }
        })
    })

    it('renders a <Dropzone /> by default', () => {
        const GalleryComponent = TestUtils.renderIntoDocument(<Gallery uploader={ uploader } />)
        const DropzoneComponent = TestUtils.scryRenderedComponentsWithType(GalleryComponent, Dropzone)[0]

        expect(DropzoneComponent).toBeTruthy()
    })

    it('does not render a <Dropzone /> if disabled via dropzone-disabled', () => {
        const GalleryComponent = TestUtils.renderIntoDocument(
            <Gallery dropzone-disabled={ true }
                     uploader={ uploader }
            />
        )
        const DropzoneComponent = TestUtils.scryRenderedComponentsWithType(GalleryComponent, Dropzone)[0]

        expect(DropzoneComponent).toBeFalsy()
    })

    it('renders children inside <Dropzone />', () => {
        const GalleryComponent = TestUtils.renderIntoDocument(
            <Gallery uploader={ uploader }>
                <span className='gallery-child'>test 123</span>
            </Gallery>
        )
        const DropzoneComponent = TestUtils.findRenderedComponentWithType(GalleryComponent, Dropzone)
        const dropzoneComponentChild = TestUtils.scryRenderedDOMComponentsWithClass(DropzoneComponent, 'gallery-child')[0]

        expect(dropzoneComponentChild).toBeTruthy()
        expect(dropzoneComponentChild.textContent).toBe('test 123')
    })

    it('renders a <FileInput /> by default', () => {
        const GalleryComponent = TestUtils.renderIntoDocument(<Gallery uploader={ uploader } />)
        const FileInputComponent = TestUtils.scryRenderedComponentsWithType(GalleryComponent, FileInput)[0]

        expect(FileInputComponent).toBeTruthy()
    })

    it('does not render a <FileInput /> if disabled via fileInput-disabled', () => {
        const GalleryComponent = TestUtils.renderIntoDocument(
            <Gallery fileInput-disabled={ true }
                     uploader={ uploader }
            />
        )
        const FileInputComponent = TestUtils.scryRenderedComponentsWithType(GalleryComponent, FileInput)[0]

        expect(FileInputComponent).toBeFalsy()
    })

    it('renders a tile for each submitted file', done => {
        const GalleryComponent = TestUtils.renderIntoDocument(<Gallery uploader={ uploader } />)

        uploader.methods.addFiles([sampleBlobWrapper, sampleBlobWrapper])

        setTimeout(() => {
            const tiles = TestUtils.scryRenderedDOMComponentsWithClass(GalleryComponent, 'react-fine-uploader-gallery-file')

            expect(tiles.length).toBe(2)
            done()
        }, 10)
    })

    it('removes a tile when cancel is clicked', done => {
        const GalleryComponent = TestUtils.renderIntoDocument(
            <Gallery animationsDisabled={ true }
                     uploader={ uploader }
            />
        )

        uploader.methods.addFiles([sampleBlobWrapper, sampleBlobWrapper])

        setTimeout(() => {
            const cancelButtons = TestUtils.scryRenderedDOMComponentsWithClass(GalleryComponent, 'react-fine-uploader-gallery-cancel-button')

            TestUtils.Simulate.click(cancelButtons[1])

            setTimeout(() => {
                const tiles = TestUtils.scryRenderedDOMComponentsWithClass(GalleryComponent, 'react-fine-uploader-gallery-file')

                expect(tiles.length).toBe(1)
                done()
            }, 10)
        }, 10)
    })
})
