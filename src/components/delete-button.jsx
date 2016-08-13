import React, { Component, PropTypes } from 'react'

class DeleteButton extends Component {
    static propTypes = {
        children: PropTypes.node,
        id: PropTypes.number.isRequired,
        onlyRenderIfDeletable: PropTypes.bool,
        uploader: PropTypes.object.isRequired
    };

    static defaultProps = {
        onlyRenderIfDeletable: true
    };

    constructor(props) {
        super(props)

        this.state = {
            deletable: false,
            deleting: false
        }

        this._onStatusChange = (id, oldStatus, newStatus) => {
            if (id === this.props.id) {
                if (newStatus !== 'upload successful' && newStatus !== 'deleting' && this.state.deletable) {
                    !this._unmounted && this.setState({
                        deletable: false,
                        deleting: false
                    })
                    this._unregisterStatusChangeHandler()
                }
                else if (newStatus === 'upload successful' && !this.state.deletable) {
                    this.setState({
                        deletable: true,
                        deleting: false
                    })
                }
                else if (newStatus === 'deleting' && !this.state.deleting) {
                    this.setState({ deleting: true })
                }
            }
        }

        this._onClick = () => this.props.uploader.methods.deleteFile(this.props.id)
    }

    componentDidMount() {
        this.props.uploader.on('statusChange', this._onStatusChange)
    }

    componentWillUnmount() {
        this._unmounted = true
        this._unregisterStatusChangeHandler()
    }

    render() {
        const { children, onlyRenderIfDeletable, id, uploader, ...elementProps } = this.props // eslint-disable-line no-unused-vars
        const content = children || 'Delete'

        if (this.state.deletable || this.state.deleting || !onlyRenderIfDeletable) {
            return (
                <button aria-label='cancel'
                        className='react-fine-uploader-cancel-button'
                        disabled={ !this.state.deletable || this.state.deleting }
                        onClick={ this.state.deletable && !this.state.deleting && this._onClick }
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

export default DeleteButton
