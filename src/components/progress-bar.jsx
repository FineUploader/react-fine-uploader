import React, { Component, PropTypes } from 'react'

class ProgressBar extends Component {
    static propTypes = {
        id: PropTypes.number,
        hideBeforeStart: PropTypes.bool,
        hideOnComplete: PropTypes.bool,
        uploader: PropTypes.object.isRequired
    };

    static defaultProps = {
        hideBeforeStart: true,
        hideOnComplete: true
    };

    constructor(props) {
        super(props)

        this.state = {
            bytesUploaded: null,
            hidden: props.hideBeforeStart,
            totalSize: null
        }

        this._createEventHandlers()
    }

    componentDidMount() {
        if (this._isTotalProgress) {
            this.props.uploader.on('totalProgress', this._trackProgressEventHandler)
        }
        else {
            this.props.uploader.on('progress', this._trackProgressEventHandler)
        }

        this.props.uploader.on('statusChange', this._trackStatusEventHandler)
    }

    componentWillUnmount() {
        this._unmounted = true
        this._unregisterEventHandlers()
    }

    render() {
        const className = this._isTotalProgress ? 'react-fine-uploader-total-progress-bar' : 'react-fine-uploader-file-progress-bar'

        return (
            <progress className={ `className ${this.props.className || ''}` }
                      hidden={ this.state.hidden }
                      max={ this.state.totalSize || 100 }
                      value={ this.state.bytesUploaded || 0 }
            />
        )
    }

    _createEventHandlers() {
        if (this._isTotalProgress) {
            this._trackProgressEventHandler = (bytesUploaded, totalSize) => {
                this.setState({ bytesUploaded, totalSize })
            }
        }
        else {
            this._trackProgressEventHandler = (id, name, bytesUploaded, totalSize) => {
                if (id === this.props.id) {
                    this.setState({ bytesUploaded, totalSize })
                }
            }
        }

        this._trackStatusEventHandler = (id, oldStatus, newStatus) => {
            if (!this._unmounted) {
                if (this._isTotalProgress) {
                    if (!this.state.hidden
                        && this.props.hideOnComplete
                        && isUploadComplete(newStatus)
                        && !this.props.uploader.methods.getInProgress()) {

                        this.setState({ hidden: true })
                    }
                    else if (this.state.hidden && this.props.uploader.methods.getInProgress()) {
                        this.setState({ hidden: false })
                    }
                }
                else if (id === this.props.id) {
                    if (this.state.hidden && newStatus === 'uploading') {
                        this.setState({ hidden: false })
                    }
                    else if (!this.state.hidden && this.props.hideOnComplete && isUploadComplete(newStatus)) {
                        this.setState({ hidden: true })
                    }
                }
            }
        }
    }

    get _isTotalProgress() {
        return this.props.id == null
    }

    _unregisterEventHandlers() {
        if (this._isTotalProgress) {
            this.props.uploader.off('totalProgress', this._trackProgressEventHandler)
        }
        else {
            this.props.uploader.off('progress', this._trackProgressEventHandler)
        }

        this.props.uploader.off('statusChange', this._trackStatusEventHandler)
    }
}

const isUploadComplete = status => (
    status === 'upload failed' || status === 'upload successful' || status === 'canceled'
)

export default ProgressBar
