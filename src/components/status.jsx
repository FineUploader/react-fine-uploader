import React, { Component, PropTypes } from 'react'

class Status extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        className: PropTypes.string,
        text: PropTypes.shape({
            deleting: PropTypes.string,
            paused: PropTypes.string,
            queued: PropTypes.string,
            submitting: PropTypes.string,
            uploading: PropTypes.string,
            upload_failed: PropTypes.string,
            upload_retrying: PropTypes.string,
            upload_successful: PropTypes.string
        }),
        uploader: PropTypes.object.isRequired
    };

    static defaultProps = {
        className: '',
        text: {
            deleting: 'Deleting...',
            paused: 'Paused',
            queued: 'Queued',
            submitting: 'Submitting...',
            uploading: 'Uploading...',
            upload_failed: 'Failed',
            upload_retrying: 'Retrying...',
            upload_successful: 'Completed'
        }
    }

    constructor() {
        super()

        this.state = { status: '' }

        this._onStatusChange = (id, oldStatus, newStatus) => {
            if (id === this.props.id && !this._unmounted) {
                const newStatusToDisplay = getStatusToDisplay({
                    displayMap: this.props.text,
                    status: newStatus
                })

                newStatusToDisplay && this.setState({ status: newStatusToDisplay })
            }
        }
    }

    componentDidMount() {
        this.props.uploader.on('statusChange', this._onStatusChange)
    }

    componentWillUnmount() {
        this._unmounted = true
        this._unregisterStatusChangeHandler()
    }

    render() {
        return (
            <span className={ `react-fine-uploader-status ${this.props.className}` }>
                { this.state.status }
            </span>
        )
    }

    _unregisterStatusChangeHandler() {
        this.props.uploader.off('statusChange', this._onStatusChange)
    }
}

const getStatusToDisplay = ({ displayMap, status }) => {
    let key

    if (status.indexOf(' ') > 0) {
        const statusParts = status.split(' ')

        key = `${statusParts[0]}_${statusParts[1]}`
    }
    else {
        key = status
    }

    return displayMap[key]
}

export default Status
