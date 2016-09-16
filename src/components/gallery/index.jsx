// TODO CSS

import React, { Component, PropTypes } from 'react'

import CancelButton from '../cancel-button'
import DeleteButton from '../delete-button'
import Dropzone from '../dropzone'
import FileInput from '../file-input'
import Filename from '../filename'
import Filesize from '../filesize'
import RetryButton from '../retry-button'
import PauseResumeButton from '../pause-resume-button'
import ProgressBar from '../progress-bar'
import Thumbnail from '../thumbnail'

import './gallery.css'

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
        const cancelButtonProps = getComponentProps('cancelButton', this.props)
        const dropzoneProps = getComponentProps('dropzone', this.props)
        const fileInputProps = getComponentProps('fileInput', this.props)
        const filenameProps = getComponentProps('filename', this.props)
        const filesizeProps = getComponentProps('filesize', this.props)
        const progressBarProps = getComponentProps('progressBar', this.props)
        const retryButtonProps = getComponentProps('retryButton', this.props)
        const thumbnailProps = getComponentProps('thumbnail', this.props)
        const uploader = this.props.uploader

        const chunkingEnabled = uploader.options.chunking && uploader.options.chunking.enabled
        const deleteEnabled = uploader.options.deleteFile && uploader.options.deleteFile.enabled
        const deleteButtonProps = deleteEnabled && getComponentProps('deleteFileButton', this.props)
        const pauseResumeButtonProps = chunkingEnabled && getComponentProps('pauseResumeButton', this.props)

        return (
            <MaybeDropzone uploader={ uploader } { ...dropzoneProps }>
                {
                    !fileInputProps.disabled &&
                        <FileInputComponent uploader={ uploader } { ...fileInputProps }/>
                }
                <ProgressBar className='react-fine-uploader-gallery-total-progress-bar'
                             uploader={ uploader }
                             { ...progressBarProps }
                />
                {
                    this.state.submittedFiles.map(id => (
                        <div key={ id }
                             className='react-fine-uploader-gallery-files'
                        >
                            <ProgressBar className='react-fine-uploader-gallery-progress-bar'
                                         id={ id }
                                         uploader={ uploader }
                                         { ...progressBarProps }
                            />
                            <Thumbnail className='react-fine-uploader-gallery-thumbnail'
                                       id={ id }
                                       uploader={ uploader }
                                       { ...thumbnailProps }
                            />
                            <Filename className='react-fine-uploader-gallery-filename'
                                      id={ id }
                                      uploader={ uploader }
                                      { ...filenameProps }
                            />
                            <Filesize className='react-fine-uploader-gallery-filesize'
                                      id={ id }
                                      uploader={ uploader }
                                      { ...filesizeProps }
                            />
                            <CancelButton className='react-fine-uploader-gallery-cancel-button'
                                          id={ id }
                                          uploader={ uploader }
                                          { ...cancelButtonProps }
                            />
                            <RetryButton className='react-fine-uploader-gallery-retry-button'
                                         id={ id }
                                         uploader={ uploader }
                                         { ...retryButtonProps }
                            />
                            {
                                deleteEnabled &&
                                    <DeleteButton className='react-fine-uploader-gallery-delete-button'
                                                  id={ id }
                                                  uploader={ uploader }
                                                  { ...deleteButtonProps }
                                    />
                            }
                            {
                                chunkingEnabled &&
                                    <PauseResumeButton className='react-fine-uploader-gallery-pause-resume-button'
                                                       id={ id }
                                                       uploader={ uploader }
                                                       { ...pauseResumeButtonProps }
                                    />
                            }
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
        return (
            <span className='react-fine-uploader-gallery-nodrop-container'>
                { children }
            </span>
        )
    }

    return (
        <Dropzone className='react-fine-uploader-gallery-dropzone'
                  uploader={ uploader }
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
        <FileInput className='react-fine-uploader-gallery-file-input-container'
                   multiple
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
