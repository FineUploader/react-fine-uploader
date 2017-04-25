import React from 'react'
import PropTypes from 'prop-types'

const Placeholder = ({ className, image, size, status }) => {
    const style = {
        display: 'inline-block',
        maxHeight: size,
        maxWidth: size
    }

    return (
        <div className={ `react-fine-uploader-thumbnail-placeholder react-fine-uploader-thumbnail-${status} ${className || ''}` }
             style={ style }
        >
            { image }
        </div>
    )
}

Placeholder.propTypes = {
    image: PropTypes.node.isRequired,
    size: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired
}

export default Placeholder
