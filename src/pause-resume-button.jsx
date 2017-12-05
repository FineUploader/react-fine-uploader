import React, { Component } from 'react'
import PropTypes from 'prop-types'

class PauseResumeButton extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        onlyRenderIfEnabled: PropTypes.bool,
        pauseChildren: PropTypes.node,
        resumeChildren: PropTypes.node,
        uploader: PropTypes.object.isRequired
    };

    static defaultProps = {
        onlyRenderIfEnabled: true
    };

    constructor(props) {
        super(props)

        this.state = {
            atLeastOneChunkUploaded: false,
            pausable: false,
            resumable: false
        }

        const statusEnum = props.uploader.qq.status

        this._onStatusChange = (id, oldStatus, newStatus) => {
            if (id === this.props.id && !this._unmounted) {
                const pausable = newStatus === statusEnum.UPLOADING && this.state.atLeastOneChunkUploaded
                const resumable = newStatus === statusEnum.PAUSED

                if (pausable !== this.state.pausable) {
                    this.setState({ pausable })
                }
                if (resumable !== this.state.resumable) {
                    this.setState({ resumable })
                }

                if (
                    newStatus === statusEnum.DELETED
                    || newStatus === statusEnum.CANCELED
                    || newStatus === statusEnum.UPLOAD_SUCCESSFUL
                ) {
                    this._unregisterOnResumeHandler()
                    this._unregisterOnStatusChangeHandler()
                    this._unregisterOnUploadChunkSuccessHandler()
                }
            }
        }

        this._onClick = () => {
            if (this.state.pausable) {
                this.props.uploader.methods.pauseUpload(this.props.id)
            }
            else if (this.state.resumable) {
                this.props.uploader.methods.continueUpload(this.props.id)
            }
        }

        this._onResume = id => {
            if (id === this.props.id
                && !this._unmounted
                && !this.state.atLeastOneChunkUploaded) {

                this.setState({
                    atLeastOneChunkUploaded: true,
                    pausable: true,
                    resumable: false
                })
            }
        }

        this._onUploadChunkSuccess = id => {
            if (id === this.props.id
                && !this._unmounted
                && !this.state.atLeastOneChunkUploaded) {

                this.setState({
                    atLeastOneChunkUploaded: true,
                    pausable: true,
                    resumable: false
                })
            }
        }
    }


    componentDidMount() {
        this.props.uploader.on('resume', this._onResume)
        this.props.uploader.on('statusChange', this._onStatusChange)
        this.props.uploader.on('uploadChunkSuccess', this._onUploadChunkSuccess)
    }

    componentWillUnmount() {
        this._unmounted = true
        this._unregisterOnResumeHandler()
        this._unregisterOnStatusChangeHandler()
        this._unregisterOnUploadChunkSuccessHandler()
    }

    render() {
        const { onlyRenderIfEnabled, id, pauseChildren, resumeChildren, uploader, ...elementProps } = this.props // eslint-disable-line no-unused-vars

        if (this.state.pausable || this.state.resumable || !onlyRenderIfEnabled) {
            return (
                <button aria-label={ getButtonLabel(this.state) }
                        className={ `react-fine-uploader-pause-resume-button ${getButtonClassName(this.state)} ${this.props.className || ''}` }
                        disabled={ !this.state.pausable && !this.state.resumable }
                        onClick={ this._onClick }
                        type='button'
                    { ...elementProps }
                >
                    { getButtonContent(this.state, this.props) }
                </button>
            )
        }

        return null
    }

    _unregisterOnResumeHandler() {
        this.props.uploader.off('resume', this._onResume)
    }

    _unregisterOnStatusChangeHandler() {
        this.props.uploader.off('statusChange', this._onStatusChange)
    }

    _unregisterOnUploadChunkSuccessHandler() {
        this.props.uploader.off('uploadChunkSuccess', this._onUploadChunkSuccess)
    }
}

const getButtonClassName = state => {
    const { resumable } = state

    return resumable ? 'react-fine-uploader-resume-button' : 'react-fine-uploader-pause-button'
}

const getButtonContent = (state, props) => {
    const { resumable } = state
    const { pauseChildren, resumeChildren } = props

    if (resumable) {
        return resumeChildren || 'Resume'
    }

    return pauseChildren || 'Pause'
}

const getButtonLabel = state => {
    const { resumable } = state

    return resumable ? 'resume' : 'pause'
}

export default PauseResumeButton
