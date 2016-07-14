import React, { Component, PropTypes } from 'react'

import Placeholder from './placeholder'

import './thumbnail.css'
import NotAvailablePlaceholder from './not-available-placeholder.jsx'
import WaitingPlaceholder from './waiting-placeholder.jsx'

export const defaultMaxSize = 120 
export const notAvailableStatus = 'not-available'
export const waitingStatus = 'waiting'

class Thumbnail extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        maxSize: PropTypes.number,
        uploader: PropTypes.object.isRequired
    };

    static defaultProps = {
        maxSize: defaultMaxSize
    };

    constructor() {
        super()

        this.state = {
            drawComplete: false
        }
    }

    componentDidMount() {
        this.props.uploader.methods.drawThumbnail(
            this.props.id,
            this.refs.canvas,
            this.props.maxSize
        )
            .then(
                () => {
                    this.setState({
                        drawComplete: true,
                        success: true
                    })
                },

                () => {
                    this.setState({
                        drawComplete: true,
                        success: false
                    })
                }
            )
    }


    render() {
        return (
            <span className='react-fine-uploader-thumbnail'>
                <canvas ref='canvas'
                        hidden={ !this.state.drawComplete || this._failure }
                />

                { this._maybePlaceholder }
            </span>
        )
    }

    get _failure() {
        return this.state.drawComplete && !this.state.success
    }

    get _maybePlaceholder() {
        if (this._failure) {
            const notAvailableImage = (
                <NotAvailablePlaceholder maxSize={ this.props.maxSize } />
            )
            
            return (
                <Placeholder image={ notAvailableImage }
                             size={ this.props.maxSize }
                             status={ notAvailableStatus }
                />
            )
        }
        else if (!this.state.drawComplete) {
            const waitingImage = (
                <WaitingPlaceholder maxSize={ this.props.maxSize } />
            )

            return (
                <Placeholder image={ waitingImage }
                             size={ this.props.maxSize }
                             status={ waitingStatus }
                />
            )
        }

        return <span />
    }
}

export default Thumbnail
