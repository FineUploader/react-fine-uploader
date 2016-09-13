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
            endpoint: '/uploads'
        },
        request: {
            endpoint: '/uploads'
        },
        retry: {
            enableAuto: true
        }
    }
})

class Tester extends Component {
    render() {
        return (
            <Gallery dropzone-style={ { border: '1px dotted', minHeight: 400, width: 700} }
                     uploader={ uploader }
            />
        )
    }
}

export default Tester
