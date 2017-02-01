import React from 'react'
import TestUtils from 'react-addons-test-utils'

import FineUploaderTraditional from 'fine-uploader-wrappers'
import Filesize from 'src/filesize'

const sampleBlob = new Blob(['hi!'], { type : 'text/plain' })
const sampleBlobWrapper = { blob: sampleBlob, name: 'test' }

describe('<Filesize />', () => {
    const nativeObjectToString = Object.prototype.toString

    beforeEach(() => {
        Object.prototype.toString = function() {
            if (this && this.type === 'fakeBlob') {
                return '[object Blob]'
            }

            return nativeObjectToString.apply(this, arguments)
        }
    })

    afterEach(() => {
        Object.prototype.toString = nativeObjectToString
    })

    it('renders file size for tiny file using default units/text', () => {
        const uploader = new FineUploaderTraditional({
            options: {
                autoUpload: false
            }
        })

        uploader.methods.addFiles(sampleBlobWrapper)

        const FilesizeComponent = TestUtils.renderIntoDocument(<Filesize id={ 0 } uploader={ uploader }/>)
        const filesizeEl = TestUtils.findRenderedDOMComponentWithClass(FilesizeComponent, 'react-fine-uploader-filesize')

        expect(filesizeEl.textContent).toBe(`${sampleBlob.size} B`)
    })

    it('renders an empty filesize component if size is not known initially', () => {
        const uploader = new FineUploaderTraditional({
            options: {
                autoUpload: false
            }
        })

        uploader.methods.addFiles({ type: 'fakeBlob' })

        const FilesizeComponent = TestUtils.renderIntoDocument(<Filesize id={ 0 } uploader={ uploader }/>)
        const filesizeEl = TestUtils.findRenderedDOMComponentWithClass(FilesizeComponent, 'react-fine-uploader-filesize')

        expect(filesizeEl.textContent).toBe('')
    })

    it('renders file size for various sized files using default units/text', () => {
        const uploader = new FineUploaderTraditional({
            options: {
                autoUpload: false
            }
        })

        uploader.methods.addFiles([
            { size: 1100, type: 'fakeBlob' },
            { size: 1100000, type: 'fakeBlob' },
            { size: 1100000000, type: 'fakeBlob' },
            { size: 1100000000000, type: 'fakeBlob' }
        ])

        const expectedSizes = [
            '1.10 KB',
            '1.10 MB',
            '1.10 GB',
            '1.10 TB'
        ]

        expectedSizes.forEach((expectedSize, id) => {
            const FilesizeComponent = TestUtils.renderIntoDocument(<Filesize id={ id } uploader={ uploader }/>)
            const filesizeEl = TestUtils.findRenderedDOMComponentWithClass(FilesizeComponent, 'react-fine-uploader-filesize')

            expect(filesizeEl.textContent).toBe(expectedSize)
        })
    })

    it('renders file size for various sized files using custom units/text', () => {
        const uploader = new FineUploaderTraditional({
            options: {
                autoUpload: false
            }
        })

        const customUnits = {
            byte: 'bytes',
            kilobyte: 'kilobytes',
            megabyte: 'megabytes',
            gigabyte: 'gigabytes',
            terabyte: 'terabytes'
        }

        uploader.methods.addFiles([
            { size: 1100, type: 'fakeBlob' },
            { size: 1100000, type: 'fakeBlob' },
            { size: 1100000000, type: 'fakeBlob' },
            { size: 1100000000000, type: 'fakeBlob' }
        ])

        const expectedSizes = [
            '1.10 kilobytes',
            '1.10 megabytes',
            '1.10 gigabytes',
            '1.10 terabytes'
        ]

        expectedSizes.forEach((expectedSize, id) => {
            const FilesizeComponent = TestUtils.renderIntoDocument(
                <Filesize id={ id } uploader={ uploader } units={ customUnits } />
            )
            const filesizeEl = TestUtils.findRenderedDOMComponentWithClass(FilesizeComponent, 'react-fine-uploader-filesize')

            expect(filesizeEl.textContent).toBe(expectedSize)
        })
    })

    it('renders file size at upload time for scaled blobs', () => {
        const uploader = new FineUploaderTraditional({
            options: {
                autoUpload: false,
                scaling: {
                    sizes: [
                        { name: 'test', maxSize: 100 }
                    ]
                }
            }
        })

        let onUploadCallback
        spyOn(uploader, 'on').and.callFake((type, callback) => {
            if (type === 'upload') {
                onUploadCallback = callback
            }
        })


        const fakeBlob = { type: 'fakeBlob' }
        uploader.methods.addFiles(fakeBlob)

        const FilesizeComponent = TestUtils.renderIntoDocument(<Filesize id={ 0 } uploader={ uploader }/>)
        const filesizeEl = TestUtils.findRenderedDOMComponentWithClass(FilesizeComponent, 'react-fine-uploader-filesize')

        expect(filesizeEl.textContent).toBe('')

        spyOn(uploader.methods, 'getSize').and.returnValue(1)
        onUploadCallback(0)

        expect(uploader.methods.getSize).toHaveBeenCalledWith(0)
        expect(filesizeEl.textContent).toBe('1 B')
    })
})
