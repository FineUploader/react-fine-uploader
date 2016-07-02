// TODO Integrate pica scaling plugin
// TODO Param for no thumbnail URI - scale w/ CSS for quicker loading & avoidance of iOS subsampling issue
// TODO Param for waiting URI - scale w/ CSS for "..."

import React, { Component, PropTypes } from 'react'

class Thumbnail extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        maxSize: PropTypes.number,
        uploader: PropTypes.object.isRequired
    };

    static defaultProps = {
        maxSize: 120
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
        ).then(() => this.setState({ drawComplete: true }))
    }


    render() {
        return (
            <canvas ref='canvas' hidden={ !this.state.drawComplete } />
        )
    }
}

export default Thumbnail
