import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup as ReactCssTransitionGroup } from 'react-transition-group'

import CancelButton from '../cancel-button'
import DeleteButton from '../delete-button'
import Dropzone from '../dropzone'
import FileInput from '../file-input'
import Filename from '../filename'
import Filesize from '../filesize'
import RetryButton from '../retry-button'
import PauseResumeButton from '../pause-resume-button'
import ProgressBar from '../progress-bar'
import Status from '../status'
import Thumbnail from '../thumbnail'

import PauseIcon from './pause-icon'
import PlayIcon from './play-icon'
import UploadIcon from './upload-icon'
import UploadFailedIcon from './upload-failed-icon'
import UploadSuccessIcon from './upload-success-icon'
import XIcon from './x-icon'

class Gallery extends Component {
    static propTypes = {
        className: PropTypes.string,
        uploader: PropTypes.object.isRequired
    };

    static defaultProps = {
        className: '',
        'cancelButton-children': <XIcon />,
        'deleteButton-children': <XIcon />,
        'dropzone-disabled': false,
        'dropzone-dropActiveClassName': 'react-fine-uploader-gallery-dropzone-active',
        'dropzone-multiple': true,
        'fileInput-multiple': true,
        'pauseResumeButton-pauseChildren': <PauseIcon />,
        'pauseResumeButton-resumeChildren': <PlayIcon />,
        'retryButton-children': <PlayIcon />,
        'thumbnail-maxSize': 130
    }

    constructor(props) {
        super(props)

        this.state = {
            visibleFiles: []
        }

        const statusEnum = props.uploader.qq.status

        this._onStatusChange = (id, oldStatus, status) => {
            const visibleFiles = this.state.visibleFiles

            if (status === statusEnum.SUBMITTED) {
                visibleFiles.push({ id })
                this.setState({ visibleFiles })
            }
            else if (isFileGone(status, statusEnum)) {
                this._removeVisibleFile(id)
            }
            else if (status === statusEnum.UPLOAD_SUCCESSFUL|| status === statusEnum.UPLOAD_FAILED) {
                if (status === statusEnum.UPLOAD_SUCCESSFUL) {
                    const visibleFileIndex = this._findFileIndex(id)
                    if (visibleFileIndex < 0) {
                        visibleFiles.push({ id, fromServer: true })
                    } 
                }
                this._updateVisibleFileStatus(id, status)
            }
        }
    }

    componentDidMount() {
        this.props.uploader.on('statusChange', this._onStatusChange)
    }

    componentWillUnmount() {
        this.props.uploader.off('statusChange', this._onStatusChange)
    }

    render() {
        const cancelButtonProps = getComponentProps('cancelButton', this.props)
        const dropzoneProps = getComponentProps('dropzone', this.props)
        const fileInputProps = getComponentProps('fileInput', this.props)
        const filenameProps = getComponentProps('filename', this.props)
        const filesizeProps = getComponentProps('filesize', this.props)
        const progressBarProps = getComponentProps('progressBar', this.props)
        const retryButtonProps = getComponentProps('retryButton', this.props)
        const statusProps = getComponentProps('status', this.props)
        const thumbnailProps = getComponentProps('thumbnail', this.props)
        const uploader = this.props.uploader

        const chunkingEnabled = uploader.options.chunking && uploader.options.chunking.enabled
        const deleteEnabled = uploader.options.deleteFile && uploader.options.deleteFile.enabled
        const deleteButtonProps = deleteEnabled && getComponentProps('deleteButton', this.props)
        const pauseResumeButtonProps = chunkingEnabled && getComponentProps('pauseResumeButton', this.props)

        return (
            <MaybeDropzone content={ this.props.children }
                           hasVisibleFiles={ this.state.visibleFiles.length > 0 }
                           uploader={ uploader }
                           { ...dropzoneProps }
            >
                {
                    !fileInputProps.disabled &&
                        <FileInputComponent uploader={ uploader } { ...fileInputProps }/>
                }
                <ProgressBar className='react-fine-uploader-gallery-total-progress-bar'
                             uploader={ uploader }
                             { ...progressBarProps }
                />
                <ReactCssTransitionGroup className='react-fine-uploader-gallery-files'
                                         component='ul'
                                         transitionEnter={ !this.props.animationsDisabled }
                                         transitionEnterTimeout={ 500 }
                                         transitionLeave={ !this.props.animationsDisabled }
                                         transitionLeaveTimeout={ 300 }
                                         transitionName='react-fine-uploader-gallery-files'
                >
                {
                    this.state.visibleFiles.map(({ id, status, fromServer }) => (
                        <li key={ id }
                             className='react-fine-uploader-gallery-file'
                        >
                            <ProgressBar className='react-fine-uploader-gallery-progress-bar'
                                         id={ id }
                                         uploader={ uploader }
                                         { ...progressBarProps }
                            />
                            <Thumbnail className='react-fine-uploader-gallery-thumbnail'
                                       id={ id }
                                       fromServer={ fromServer }
                                       uploader={ uploader }
                                       { ...thumbnailProps }
                            />
                            {
                                status === 'upload successful' &&
                                    <span>
                                        <UploadSuccessIcon className='react-fine-uploader-gallery-upload-success-icon' />
                                        <div className='react-fine-uploader-gallery-thumbnail-icon-backdrop' />
                                    </span>
                            }
                            {
                                status === 'upload failed' &&
                                    <span>
                                        <UploadFailedIcon className='react-fine-uploader-gallery-upload-failed-icon' />
                                        <div className='react-fine-uploader-gallery-thumbnail-icon-backdrop' />
                                    </span>
                            }
                            <div className='react-fine-uploader-gallery-file-footer'>
                                <Filename className='react-fine-uploader-gallery-filename'
                                          id={ id }
                                          uploader={ uploader }
                                          { ...filenameProps }
                                />
                                <Status className='react-fine-uploader-gallery-status'
                                        id={ id }
                                        uploader={ uploader }
                                        { ...statusProps }
                                />
                                <Filesize className='react-fine-uploader-gallery-filesize'
                                          id={ id }
                                          uploader={ uploader }
                                          { ...filesizeProps }
                                />
                            </div>
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
                        </li>
                    ))
                }
                </ReactCssTransitionGroup>
            </MaybeDropzone>
        )
    }

    _removeVisibleFile(id) {
        const visibleFileIndex = this._findFileIndex(id)

        if (visibleFileIndex >= 0) {
            const visibleFiles = this.state.visibleFiles

            visibleFiles.splice(visibleFileIndex, 1)
            this.setState({ visibleFiles })
        }
    }

    _updateVisibleFileStatus(id, status) {
        this.state.visibleFiles.some(file => {
            if (file.id === id) {
                file.status = status
                this.setState({ visibleFiles: this.state.visibleFiles })
                return true
            }
        })
    }

    _findFileIndex(id) {
        let visibleFileIndex = -1

        this.state.visibleFiles.some((file, index) => {
            if (file.id === id) {
                visibleFileIndex = index
                return true
            }
        })

        return visibleFileIndex
    }
}

const MaybeDropzone = ({ children, content, hasVisibleFiles, uploader, ...props }) => {
    const { disabled, ...dropzoneProps } = props

    let dropzoneDisabled = disabled
    if (!dropzoneDisabled) {
        dropzoneDisabled = !uploader.qq.supportedFeatures.fileDrop
    }

    if (hasVisibleFiles) {
        content = <span/>
    }
    else {
        content = content || getDefaultMaybeDropzoneContent({ content, disabled: dropzoneDisabled })
    }

    if (dropzoneDisabled) {
        return (
            <div className='react-fine-uploader-gallery-nodrop-container'>
                { content }
                { children }
            </div>
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
    const content = children || (
        <span>
            <UploadIcon className='react-fine-uploader-gallery-file-input-upload-icon' />
            Select Files
        </span>
    )

    return (
        <FileInput className='react-fine-uploader-gallery-file-input-container'
                   uploader={ uploader }
                   { ...fileInputProps }
        >
            <span className='react-fine-uploader-gallery-file-input-content'>
                { content }
            </span>
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

const getDefaultMaybeDropzoneContent = ({ content, disabled }) => {
    const className = disabled
        ? 'react-fine-uploader-gallery-nodrop-content'
        : 'react-fine-uploader-gallery-dropzone-content'

    if (disabled && !content) {
        return (
            <span className={ className }>
                Upload files
            </span>
        )
    }
    else if (content) {
        return <span className={ className }>{ content }</span>
    }
    else if (!disabled) {
        return (
            <span className={ className }>
                <UploadIcon className='react-fine-uploader-gallery-dropzone-upload-icon' />
                Drop files here
            </span>
        )
    }
}

const isFileGone = (statusToCheck, statusEnum) => {
    return [
        statusEnum.CANCELED,
        statusEnum.DELETED,
    ].indexOf(statusToCheck) >= 0
}

export default Gallery
