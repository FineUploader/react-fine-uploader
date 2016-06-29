import FileInput from 'src/components/file-input/styleable-element'
import React from 'react'
import ReactDOM from 'react-dom'

const fileInput = (
    <FileInput multiple accept='image/*'>
        <button>Select Files</button>
    </FileInput>
)

ReactDOM.render(
    fileInput,
    document.getElementById('content')
)
