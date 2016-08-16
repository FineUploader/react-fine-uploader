import React, { Component, PropTypes } from 'react'

class RetryButton extends Component {
    static propTypes = {
        children: PropTypes.node,
        id: PropTypes.number.isRequired,
        onlyRenderIfRetryable: PropTypes.bool,
        uploader: PropTypes.object.isRequired
    };

    static defaultProps = {
        onlyRenderIfRetryable: true
    };

    constructor() {
        super()

        this.state = { retryable: false }

        this._onComplete = (id, name, response) => {
            if (id === this.props.id && !this._unmounted) {
                const retryForbidden = isRetryForbidden(response, this.props.uploader)

                if (!response.success && !retryForbidden && !this.state.retryable) {
                    this.setState({ retryable: true })
                }
                else if (response.success && this.state.retryable) {
                    this.setState({ retryable: false })
                }
                else if (retryForbidden && this.state.retryable) {
                    this.setState({ retryable: false })
                    this._unregisterOnCompleteHandler()
                }
            }
        }

        this._onClick = () => this.props.uploader.methods.retry(this.props.id)
    }

    componentDidMount() {
        this.props.uploader.on('complete', this._onComplete)
    }

    componentWillUnmount() {
        this._unmounted = true
        this._unregisterOnCompleteHandler()
    }

    render() {
        const { children, onlyRenderIfRetryable, id, uploader, ...elementProps } = this.props // eslint-disable-line no-unused-vars
        const content = children || 'Retry'

        if (this.state.retryable || !onlyRenderIfRetryable) {
            return (
                <button aria-label='retry'
                        className='react-fine-uploader-retry-button'
                        disabled={ !this.state.retryable }
                        onClick={ this.state.retryable && this._onClick }
                    { ...elementProps }
                >
                    { content }
                </button>
            )
        }

        return null
    }

    _unregisterOnCompleteHandler() {
        this.props.uploader.off('complete', this._onComplete)
    }
}

const isRetryForbidden = (response, uploader) => {
    const preventRetryResponseProperty =
        (uploader.options.retry && uploader.options.retry.preventRetryResponseProperty)
        || 'preventRetry'

    return !!response[preventRetryResponseProperty]
}

export default RetryButton
