import React from 'react'

const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    direction: 'ltr',
}

const inputStyle = {
    height: '100%',
    margin: 0,
    opacity: 0,
    padding: 0,
    position: 'absolute',
    right: 0,
    top: 0
}

const StyleableFileInput = ({ children, className, onChange, ...params }) => (
    <div className={`react-fine-uploader-file-input-container ${className || ''}`}
        style={containerStyle}
    >
        {children}
        <input {...params}
            className='react-fine-uploader-file-input'
            onChange={onChange}
            style={inputStyle}
            type='file'
        />
    </div>
)

export default StyleableFileInput
