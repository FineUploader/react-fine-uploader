import React from 'react'

import StyleableElement from './styleable-element'

class FileInput extends React.Component {
    constructor() {
        super()

        this.state = { key: newKey() }
        this._onFilesSelected = onFilesSelected.bind(this)
    }

    static propTypes = {
        uploader: React.PropTypes.object.isRequired
    };

    render() {
        return (
            <StyleableElement { ...this.props }
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
