import React from 'react'

import './styleable-element.css'

const StyleableFileInput = ({ children, className, onChange, ...params }) => (
    <div className={ `react-fine-uploader-file-input-container ${className || ''}` }>
        { children }
        <input { ...params }
               className='react-fine-uploader-file-input'
               onChange={ onChange }
               type='file'
        />
    </div>
)

export default StyleableFileInput
