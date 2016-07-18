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

        this._createEventHandler()
    }

    componentDidMount() {
        if (this._isTotalProgress) {
            this.props.uploader.on('totalProgress', this._trackProgressEventHandler)
        }
        else {
            this.props.uploader.on('progress', this._trackProgressEventHandler)
        }
    }

    componentWillUnmount() {
        this._unregisterEventHandler()
    }

    render() {
        const className = this._isTotalProgress ? 'react-fine-uploader-total-progress-bar' : 'react-fine-uploader-file-progress-bar'

        return (
            <progress className={ className }
                      hidden={ this.state.hidden }
                      max={ this.state.totalSize || 100 }
                      value={ this.state.bytesUploaded || 0 }
            />
        )
    }

    _createEventHandler() {
        if (this._isTotalProgress) {
            this._trackProgressEventHandler = (bytesUploaded, totalSize) => {
                let hidden = false

                if (bytesUploaded == totalSize && this.props.hideOnComplete) {
                    hidden = true
                }

                this.setState({ bytesUploaded, hidden, totalSize })
            }
        }
        else {
            this._trackProgressEventHandler = (id, name, bytesUploaded, totalSize) => {
                if (id === this.props.id) {
                    let hidden = false

                    if (bytesUploaded == totalSize && this.props.hideOnComplete) {
                        hidden = true
                    }

                    this.setState({ bytesUploaded, hidden, totalSize })
                }
            }
        }
    }

    get _isTotalProgress() {
        return this.props.id == null
    }

    _unregisterEventHandler() {
        if (this._isTotalProgress) {
            this.props.uploader.off('totalProgress', this._trackProgressEventHandler)
        }
        else {
            this.props.uploader.off('progress', this._trackProgressEventHandler)
        }
    }
}

export default ProgressBar
