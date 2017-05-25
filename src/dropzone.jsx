import qq from 'fine-uploader/lib/dnd'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

class DropzoneElement extends Component {
    static propTypes = {
        children: PropTypes.node,
        dropActiveClassName: PropTypes.string,
        element: PropTypes.object,
        multiple: PropTypes.bool,
        onDropError: PropTypes.func,
        onProcessingDroppedFiles: PropTypes.func,
        onProcessingDroppedFilesComplete: PropTypes.func,
        uploader: PropTypes.object.isRequired
    };

    static defaultProps = {
        dropActiveClassName: 'react-fine-uploader-dropzone-active'
    }

    componentDidMount() {
        this._registerDropzone()
    }

    componentDidUpdate() {
        this._registerDropzone()
    }

    componentWillUnmount() {
        this._qqDropzone && this._qqDropzone.dispose()
    }

    render() {
        const { uploader, ...elementProps } = this.props // eslint-disable-line no-unused-vars

        return (
            <div { ...getElementProps(this.props) }
                className={`fine-uploader-dropzone-container ${this.props.className || ''}`}
                 ref='dropZone'
            >
                { this.props.children }
            </div>
        )
    }

    _onDropError(errorCode, errorData) {
        console.error(errorCode, errorData)

        this.props.onDropError && this.props.onDropError(errorCode, errorData)
    }

    _onProcessingDroppedFilesComplete(files) {
        this.props.uploader.methods.addFiles(files)

        if (this.props.onProcessingDroppedFilesComplete) {
            this.props.onProcessingDroppedFilesComplete(files)
        }
    }

    _registerDropzone() {
        this._qqDropzone && this._qqDropzone.dispose()

        const dropzoneEl = this.props.element || this.refs.dropZone

        this._qqDropzone = new qq.DragAndDrop({
            allowMultipleItems: !!this.props.multiple,
            callbacks: {
                dropError: this._onDropError.bind(this),
                processingDroppedFiles: this.props.onProcessingDroppedFiles || function() {},
                processingDroppedFilesComplete: this._onProcessingDroppedFilesComplete.bind(this)
            },
            classes: {
                dropActive: this.props.dropActiveClassName || ''
            },
            dropZoneElements: [dropzoneEl]
        })
    }
}

const getElementProps = actualProps => {
    const actualPropsCopy = { ...actualProps }
    const expectedPropNames = Object.keys(DropzoneElement.propTypes)

    expectedPropNames.forEach(expectedPropName => delete actualPropsCopy[expectedPropName])
    return actualPropsCopy
}

export default DropzoneElement
