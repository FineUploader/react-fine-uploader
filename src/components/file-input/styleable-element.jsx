import React from 'react'

import './styleable-element.less'

const StyleableFileInput = ({ children }) => (
    <div className='react-fine-uploader-file-input-container'>
        { children }
        <input className='react-fine-uploader-file-input' 
               type='file' 
        />
    </div>
)

export default StyleableFileInput
