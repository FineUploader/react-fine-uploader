import React, { Component } from 'react'

import FineUploader from 'src/wrappers/traditional'
import Gallery from 'src/components/gallery'

const uploader = new FineUploader({
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

class Tester extends Component {
    render() {
        return (
            <Gallery uploader={ uploader } />
        )
    }
}

export default Tester
