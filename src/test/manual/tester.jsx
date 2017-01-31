import React, { Component } from 'react'

import Gallery from 'lib/gallery'
import S3FineUploader from 'fine-uploader-wrappers/s3'
import TraditionalFineUploader from 'fine-uploader-wrappers'

import 'lib/gallery/gallery.css'

const traditionalUploader = new TraditionalFineUploader({
    options: {
        chunking: {
            enabled: true
        },
        debug: true,
        deleteFile: {
            enabled: true,
            endpoint: '/vendor/fineuploader/php-traditional-server/endpoint.php'
        },
        request: {
            endpoint: '/vendor/fineuploader/php-traditional-server/endpoint.php'
        },
        retry: {
            enableAuto: true
        }
    }
})

const s3Uploader = new S3FineUploader({
    options: {
        chunking: {
            enabled: true,
            concurrent: {
                enabled: true
            }
        },
        debug: true,
        deleteFile: {
            enabled: true,
            endpoint: "/vendor/fineuploader/php-s3-server/endpoint.php"
        },
        request: {
            endpoint: "http://fineuploadertest.s3.amazonaws.com",
            accessKey: "AKIAIXVR6TANOGNBGANQ"
        },
        retry: {
            enableAuto: true
        },
        signature: {
            endpoint: "/vendor/fineuploader/php-s3-server/endpoint.php"
        },
        uploadSuccess: {
            endpoint: "/vendor/fineuploader/php-s3-server/endpoint.php?success"
        }
    }
})

class Tester extends Component {
    render() {
        return (
            <div>
                <h2>Traditional</h2>
                <Gallery uploader={ traditionalUploader } />

                <h2>S3</h2>
                <Gallery uploader={ s3Uploader } />
            </div>
        )
    }
}

export default Tester
