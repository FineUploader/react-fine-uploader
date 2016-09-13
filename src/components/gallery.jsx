// TODO CSS

import React, { Component, PropTypes } from 'react'

import CancelButton from './cancel-button'
import DeleteButton from './delete-button'
import Dropzone from './dropzone'
import FileInput from './file-input'
import Filename from './filename'
import Filesize from './filesize'
import RetryButton from './retry-button'
import PauseResumeButton from './pause-resume-button'
import ProgressBar from './progress-bar'
import Thumbnail from './thumbnail'

class Gallery extends Component {
    static propTypes = {
        className: PropTypes.string,
        uploader: PropTypes.object.isRequired
    };

    static defaultProps = {
        className: '',
        'dropzone-content': <span>Drop Files Here</span>,
        'dropzone-multiple': true,
        'fileInput-children': <button>Select Files</button>,
        'fileInput-multiple': true
    }

    constructor() {
        super()

        this.state = {
            submittedFiles: []
        }
    }

    componentDidMount() {
        this.props.uploader.on('statusChange', (id, oldStatus, newStatus) => {
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
        const dropzoneProps = getComponentProps('dropzone', this.props)
        const fileInputProps = getComponentProps('fileInput', this.props)
        const uploader = this.props.uploader

        return (
            <MaybeDropzone uploader={ uploader } { ...dropzoneProps }>
                {
                    !fileInputProps.disabled &&
                    <FileInputComponent uploader={ uploader } { ...fileInputProps }/>
                }
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
            </MaybeDropzone>
        )
    }
}

const MaybeDropzone = ({ children, content, uploader, ...props }) => {
    const { disabled, ...dropzoneProps } = props

    if (disabled) {
        return <span>{ children }</span>
    }

    return (
        <Dropzone uploader={ uploader }
                  { ...dropzoneProps }
        >
            { content }
            { children }
        </Dropzone>
    )
}

const FileInputComponent = ({ uploader, ...props }) => {
    const { children, ...fileInputProps } = props

    return (
        <FileInput multiple
                   uploader={ uploader }
                   { ...fileInputProps }
        >
            { children }
        </FileInput>
    )
}

const getComponentProps = (componentName, allProps) => {
    const componentProps = {}

    Object.keys(allProps).forEach(propName => {
        if (propName.indexOf(componentName + '-') === 0) {
            const componentPropName = propName.substr(componentName.length + 1)
            componentProps[componentPropName] = allProps[propName]
        }
    })

    return componentProps
}

const isFileGone = status => {
    return [
            'canceled',
            'deleted',
        ].indexOf(status) >= 0
}

export default Gallery
