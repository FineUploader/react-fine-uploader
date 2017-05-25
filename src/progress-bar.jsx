import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
        const customContainerClassName = this.props.className ? this.props.className + '-container' : ''
        const percentWidth = this.state.bytesUploaded / this.state.totalSize * 100 || 0

        return (
            <div className={ `${className}-container ${customContainerClassName}` }
                  hidden={ this.state.hidden }
            >
                <div aria-valuemax='100'
                     aria-valuemin='0'
                     aria-valuenow={ percentWidth }
                     className={ `${className} ${this.props.className || ''}` }
                     role='progressbar'
                     style={ { width: percentWidth + '%' } }
                 />
            </div>
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

        const statusEnum = this.props.uploader.qq.status

        this._trackStatusEventHandler = (id, oldStatus, newStatus) => {
            if (!this._unmounted) {
                if (this._isTotalProgress) {
                    if (!this.state.hidden
                        && this.props.hideOnComplete
                        && isUploadComplete(newStatus, statusEnum)
                        && !this.props.uploader.methods.getInProgress()) {

                        this.setState({ hidden: true })
                    }
                    else if (this.state.hidden && this.props.uploader.methods.getInProgress()) {
                        this.setState({ hidden: false })
                    }
                }
                else if (id === this.props.id) {
                    if (this.state.hidden && newStatus === statusEnum.UPLOADING) {
                        this.setState({ hidden: false })
                    }
                    else if (!this.state.hidden && this.props.hideOnComplete && isUploadComplete(newStatus, statusEnum)) {
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

const isUploadComplete = (statusToCheck, statusEnum) => (
    statusToCheck === statusEnum.UPLOAD_FAILED
    || statusToCheck === statusEnum.UPLOAD_SUCCESSFUL
    || statusToCheck === statusEnum.CANCELED
)

export default ProgressBar
