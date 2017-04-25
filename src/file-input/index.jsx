import React, { Component } from 'react'
import PropTypes from 'prop-types'

import StyleableElement from './styleable-element'

class FileInput extends Component {
    static propTypes = {
        text: PropTypes.shape({
            selectFile: PropTypes.string,
            selectFiles: PropTypes.string,
        }),
        uploader: PropTypes.object.isRequired
    };

    static defaultProps = {
        text: {
            selectFile: 'Select a File',
            selectFiles: 'Select Files',
        }
    }

    constructor() {
        super()

        this.state = { key: newKey() }
        this._onFilesSelected = onFilesSelected.bind(this)
    }

    render() {
        const { text, uploader, ...elementProps } = this.props // eslint-disable-line no-unused-vars

        return (
            <StyleableElement { ...elementProps }
                              key={ this.state.key }
                              onChange={ this._onFilesSelected }
            >
                {
                    this.props.children
                        ? this.props.children
                        : <span>{ elementProps.multiple ? text.selectFiles : text.selectFile }</span>
                }
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
