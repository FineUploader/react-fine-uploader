import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Filename extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        uploader: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props)

        this.state = {
            filename: props.uploader.methods.getName(props.id)
        }

        this._interceptSetName()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.filename !== this.state.filename
    }

    render() {
        return (
            <span className={ `react-fine-uploader-filename ${this.props.className || ''}` }>
                { this.state.filename }
            </span>
        )
    }

    _interceptSetName() {
        const oldSetName = this.props.uploader.methods.setName

        this.props.uploader.methods.setName = (id, newName) => {
            oldSetName.call(this.props.uploader.methods, id, newName)

            if (id === this.props.id) {
                this.setState({
                    filename: newName
                })
            }
        }
    }
}

export default Filename
