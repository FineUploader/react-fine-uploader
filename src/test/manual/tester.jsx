/**
 * TODO Less ugly test page (probably can wait until high-level components are functional,
 * or this can be used to build up to the high-level component instead.
 */

import React, { Component } from 'react'

import CancelButton from 'src/components/cancel-button'
import DeleteButton from 'src/components/delete-button'
import Dropzone from 'src/components/dropzone'
import FileInput from 'src/components/file-input'
import Filename from 'src/components/filename'
import Filesize from 'src/components/filesize'
import FineUploader from 'src/wrappers/traditional'
import RetryButton from 'src/components/retry-button'
import PauseResumeButton from 'src/components/pause-resume-button'
import ProgressBar from 'src/components/progress-bar'
import Thumbnail from 'src/components/thumbnail'

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
    constructor() {
        super()

        this.state = {
            submittedFiles: []
        }
    }

    componentDidMount() {
        uploader.on('statusChange', (id, oldStatus, newStatus) => {
            if (newStatus === 'submitted') {
                const submittedFiles = this.state.submittedFiles

                submittedFiles.push(id)
                this.setState({ submittedFiles })
            }
            else if (isFileGone(newStatus)) {
                const submittedFiles = this.state.submittedFiles
                const indexToRemove = submittedFiles.indexOf(id)

                submittedFiles.splice(indexToRemove, 1)
                this.setState({ submittedFiles })
            }
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
                        <div key={ id } style={ { display: 'inline-block' } }>
                            <ProgressBar id={ id } uploader={ uploader } />
                            <Thumbnail id={ id } uploader={ uploader } />
                            <div>
                                <Filename id={ id } uploader={ uploader } />
                            </div>
                            <Filesize id={ id } uploader={ uploader } />
                            <CancelButton id={ id } uploader={ uploader } />
                            <RetryButton id={ id } uploader={ uploader } />
                            <DeleteButton id={ id } uploader={ uploader } />
                            <PauseResumeButton id={ id } uploader={ uploader } />
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

const isFileGone = status => {
    return [
        'canceled',
        'deleted',
    ].indexOf(status) >= 0
}

export default Tester
