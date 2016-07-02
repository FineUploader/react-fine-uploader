import React, { Component, PropTypes } from 'react'

import StyleableElement from './styleable-element'

class FileInput extends Component {
    static propTypes = {
        uploader: PropTypes.object.isRequired
    };

    constructor() {
        super()

        this.state = { key: newKey() }
        this._onFilesSelected = onFilesSelected.bind(this)
    }

    render() {
        const { uploader, ...elementProps } = this.props // eslint-disable-line no-unused-vars

        return (
            <StyleableElement { ...elementProps }
                              key={ this.state.key }
                              onChange={ this._onFilesSelected }
            >
                { this.props.children }
            </StyleableElement>
        )
    }

    _resetInput() {
        this.setState({ key: newKey() })
    }
}

const onFilesSelected = function(onChangeEvent) {
    this.props.uploader.methods.addFiles(onChangeEvent.target)
    this._resetInput()
}

const newKey = () => Date.now()

export default FileInput
