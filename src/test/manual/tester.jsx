/**
 * TODO Less ugly test page (probably can wait until high-level components are functional,
 * or this can be used to build up to the high-level component instead.
 */

import React, { Component } from 'react'

import Dropzone from 'src/components/dropzone'
import FileInput from 'src/components/file-input'
import Filename from 'src/components/filename'
import FineUploader from 'src/wrappers/traditional'
import ProgressBar from 'src/components/progress-bar'
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
                      style={ { border: '1px dotted', minHeight: 400, width: 700} }
                      uploader={ uploader }
            >
                <span>Drop Files Here</span>
                <FileInputComponent />
                <ProgressBar uploader={ uploader } />
                {
                    this.state.submittedFiles.map(id => (
                        <div style={ { display: 'inline-block' } }>
                            <ProgressBar id={ id } uploader={ uploader } />
                            <Thumbnail id={ id } uploader={ uploader } />
                            <div>
                                <Filename id={ id } uploader={ uploader } />
                            </div>
                        </div>
                    ))
                }
            </Dropzone>
        )
    }
}

const FileInputComponent = () => (
    <FileInput multiple uploader={ uploader }>
        <button>Select Files</button>
    </FileInput>
)

export default Tester
