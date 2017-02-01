import React, { Component, PropTypes } from 'react'

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

    constructor() {
        super()

        this.state = {
            pausable: false,
            resumable: false
        }

        this._onStatusChange = (id, oldStatus, newStatus) => {
            if (id === this.props.id && !this._unmounted) {
                const pausable = isPausable(newStatus)
                const resumable = !pausable && isResumable(newStatus)

                if (!pausable && this.state.pausable) {
                    this.setState({ pausable, resumable })
                }
                else if (resumable && !this.state.resumable) {
                    this.setState({ pausable, resumable })
                }
                else if (!resumable && this.state.resumable) {
                    this.setState({ pausable, resumable })
                }
                else if (newStatus === 'deleted' || newStatus === 'canceled' || newStatus === 'upload successful') {
                    this._unregisterStatusChangeHandler()
                    this._unregisterOnUploadChunkHandler()
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

        this._onUploadChunk = (id, name, chunkData) => {
            if (id === this.props.id && !this._unmounted) {
                if (chunkData.partIndex > 0 && !this.state.pausable) {
                    this.setState({
                        pausable: true,
                        resumable: false
                    })
                }
                else if (chunkData.partIndex === 0 && this.state.pausable) {
                    this.setState({
                        pausable: false,
                        resumable: false
                    })
                }
            }
        }
    }


    componentDidMount() {
        this.props.uploader.on('statusChange', this._onStatusChange)
        this.props.uploader.on('uploadChunk', this._onUploadChunk)
    }

    componentWillUnmount() {
        this._unmounted = true
        this._unregisterOnStatusChangeHandler()
        this._unregisterOnUploadChunkHandler()
    }

    render() {
        const { onlyRenderIfEnabled, id, uploader, ...elementProps } = this.props // eslint-disable-line no-unused-vars

        if (this.state.pausable || this.state.resumable || !onlyRenderIfEnabled) {
            return (
                <button aria-label={ getButtonLabel(this.state) }
                        className={ `react-fine-uploader-pause-resume-button ${getButtonClassName(this.state)} ${this.props.className || ''}` }
                        disabled={ !this.state.pausable && !this.state.resumable }
                        onClick={ this._onClick }
                    { ...elementProps }
                >
                    { getButtonContent(this.state, this.props) }
                </button>
            )
        }

        return null
    }

    _unregisterOnStatusChangeHandler() {
        this.props.uploader.off('statusChange', this._onStatusChange)
    }

    _unregisterOnUploadChunkHandler() {
        this.props.uploader.off('uploadChunk', this._onUploadChunk)
    }

    _unregisterStatusChangeHandler() {
        this.props.uploader.off('statusChange', this._onStatusChange)
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

const isPausable = status => status === 'uploading'
const isResumable = status => status === 'paused'

export default PauseResumeButton
