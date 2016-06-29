import React from 'react'
import ReactDOM from 'react-dom'

import FileInput from 'src/components/file-input'
import FineUploader from 'src/wrappers/traditional'

const uploader = new FineUploader({options: {}})

const fileInput = (
    <FileInput multiple accept='image/*' uploader={ uploader }>
        <button>Select Files</button>
    </FileInput>
)

ReactDOM.render(
    fileInput,
    document.getElementById('content')
)
