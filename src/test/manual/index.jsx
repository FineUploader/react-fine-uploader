import React from 'react'
import ReactDOM from 'react-dom'

import Dropzone from 'src/components/dropzone'
import FileInput from 'src/components/file-input'
import FineUploader from 'src/wrappers/traditional'

const uploader = new FineUploader({options: {}})

const DropzoneComponent = () => (
    <Dropzone style={ { border: '1px dotted', height: 200, width: 200} }
              uploader={ uploader }
    >
        <span>Drop Files Here</span>
    </Dropzone>
)

const FileInputComponent = () => (
    <FileInput multiple accept='image/*' uploader={ uploader }>
        <button>Select Files</button>
    </FileInput>
)

const Container = () => (
    <div>
        <FileInputComponent />
        <DropzoneComponent />
    </div>
)

ReactDOM.render(
    <Container />,
    document.getElementById('content')
)
