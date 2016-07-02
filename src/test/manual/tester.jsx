/**
 * TODO Less ugly test page (probably can wait until high-level components are functional,
 * or this can be used to build up to the high-level component instead.
 */

import React, { Component } from 'react'

import Dropzone from 'src/components/dropzone'
import FileInput from 'src/components/file-input'
import FineUploader from 'src/wrappers/traditional'
import Thumbnail from 'src/components/thumbnail'

const uploader = new FineUploader({
    options: {
        debug: true
    }
})

class Tester extends Component {
    constructor() {
        super()

        this.state = {
            submittedFiles: []
        }
    }

    componentDidMount() {
        uploader.on('submitted', id => {
            const submittedFiles = this.state.submittedFiles

            submittedFiles.push(id)
            this.setState({ submittedFiles })
        })
    }

    render() {
        return (
            <Dropzone multiple
                      style={ { border: '1px dotted', minHeight: 200, width: 400} }
                      uploader={ uploader }
            >
                <span>Drop Files Here</span>
                <FileInputComponent />
                {
                    this.state.submittedFiles.map(id => (
                        <Thumbnail id={ id } uploader={ uploader } />
                    ))
                }
            </Dropzone>
        )
    }
}

const FileInputComponent = () => (
    <FileInput multiple accept='image/*' uploader={ uploader }>
        <button>Select Files</button>
    </FileInput>
)

export default Tester
