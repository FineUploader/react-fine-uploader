import React, { Component, PropTypes } from 'react'

class CancelButton extends Component {
    static propTypes = {
        children: PropTypes.node,
        id: PropTypes.number.isRequired,
        onlyRenderIfCancelable: PropTypes.bool,
        uploader: PropTypes.object.isRequired
    };

    static defaultProps = {
        onlyRenderIfCancelable: true
    };

    constructor(props) {
        super(props)

        this.state = { cancelable: true }

        this._onStatusChange = (id, oldStatus, newStatus) => {
            if (id === this.props.id) {
                if (!isCancelable(newStatus) && this.state.cancelable) {
                    this.setState({ cancelable: false })
                    this._unregisterStatusChangeHandler()
                }
            }
        }

        this._onClick = () => this.props.uploader.methods.cancel(this.props.id)
    }

    componentDidMount() {
        this.props.uploader.on('statusChange', this._onStatusChange)
    }

    componentWillUnmount() {
        this._unregisterStatusChangeHandler()
    }

    render() {
        const { children, onlyRenderIfCancelable, id, uploader, ...elementProps } = this.props // eslint-disable-line no-unused-vars
        const content = children || 'Cancel'

        if (this.state.cancelable || !onlyRenderIfCancelable) {
            return (
                <button aria-label='cancel'
                        className='react-fine-uploader-cancel-button'
                        disabled={ !this.state.cancelable }
                        onClick={ this.state.cancelable && this._onClick }
                        { ...elementProps }
                >
                    { content }
                </button>
            )
        }

        return null
    }

    _unregisterStatusChangeHandler() {
        this.props.uploader.off('statusChange', this._onStatusChange)
    }
}

const isCancelable = status => {
    return [
        'submitted',
        'queued',
        'uploading',
        'upload retrying',
        'upload failed',
        'delete failed',
        'paused'
    ].indexOf(status) >= 0
}

export default CancelButton
