import React from 'react'

const containerStyle = {
    display: 'inline-block',
    position: 'relative'
}

const inputStyle = {
    bottom: 0,
    height: '100%',
    left: 0,
    margin: 0,
    opacity: 0,
    padding: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%'
}

const StyleableFileInput = ({ children, className, onChange, ...params }) => (
    <div className={ `react-fine-uploader-file-input-container ${className || ''}` } 
         style={ containerStyle }
    >
        { children }
        <input { ...params }
               className='react-fine-uploader-file-input'
               onChange={ onChange }
               style={ inputStyle }
               type='file'
        />
    </div>
)

export default StyleableFileInput
