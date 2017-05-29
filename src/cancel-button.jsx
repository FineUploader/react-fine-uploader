import React, { Component } from 'react'
import PropTypes from 'prop-types'

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

        const statusEnum = props.uploader.qq.status

        this._onStatusChange = (id, oldStatus, newStatus) => {
            if (id === this.props.id && !this._unmounted) {
                if (!isCancelable(newStatus, statusEnum) && this.state.cancelable) {
                    this.setState({ cancelable: false })
                }
                else if (isCancelable(newStatus, statusEnum) && !this.state.cancelable) {
                    this.setState({ cancelable: true })
                }
                else if (newStatus === statusEnum.DELETED || newStatus === statusEnum.CANCELED) {
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
        this._unmounted = true
        this._unregisterStatusChangeHandler()
    }

    render() {
        const { children, onlyRenderIfCancelable, id, uploader, ...elementProps } = this.props // eslint-disable-line no-unused-vars
        const content = children || 'Cancel'

        if (this.state.cancelable || !onlyRenderIfCancelable) {
            return (
                <button aria-label='cancel'
                        className={ `react-fine-uploader-cancel-button ${this.props.className || ''}` }
                        disabled={ !this.state.cancelable }
                        onClick={ this.state.cancelable && this._onClick }
                        type='button'
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

const isCancelable = (statusToCheck, statusEnum) => {
    return [
        statusEnum.DELETE_FAILED,
        statusEnum.PAUSED,
        statusEnum.QUEUED,
        statusEnum.UPLOAD_RETRYING,
        statusEnum.SUBMITTED,
        statusEnum.UPLOADING,
        statusEnum.UPLOAD_FAILED
    ].indexOf(statusToCheck) >= 0
}

export default CancelButton
