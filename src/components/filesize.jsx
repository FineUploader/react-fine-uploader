import React, { Component, PropTypes } from 'react'

class Filesize extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        units: PropTypes.shape({
            byte: PropTypes.string,
            kilobyte: PropTypes.string,
            megabyte: PropTypes.string,
            gigabyte: PropTypes.string,
            terabyte: PropTypes.string
        }),
        uploader: PropTypes.object.isRequired
    };

    static defaultProps = {
        units: {
            byte: 'B',
            kilobyte: 'KB',
            megabyte: 'MB',
            gigabyte: 'GB',
            terabyte: 'TB'
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            size: props.uploader.methods.getSize(props.id)
        }

        // If this is a scaled image, the size won't be known until upload time.
        this._onUploadHandler = id => {
            if (id === this.props.id) {
                this.setState({
                    size: this.props.uploader.getSize(id)
                })
            }
        }
    }

    componentDidMount() {
        this.props.uploader.on('upload', this._onUploadHandler)
    }

    componentWillUnmount() {
        this.props.uploader.off('upload', this._onUploadHandler)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.size !== this.state.size || !areUnitsEqual(nextProps.units, this.props.units)
    }

    render() {
        const size = this.state.size
        const units = this.props.units
        const { formattedSize, formattedUnits } = formatSizeAndUnits({ size, units })

        return (
            <span className='react-fine-uploader-filesize'>
                <span className='react-fine-uploader-filesize-value'>
                    { formattedSize }
                </span>
                <span className='react-fine-uploader-filesize-unit'>
                    { formattedUnits }
                </span>
            </span>
        )
    }
}

const formatSizeAndUnits = ({ size, units }) => {
    let formattedSize,
        formattedUnits

    switch(size) {
        case size < 1e+3: {
            formattedSize = size
            formattedUnits = units.byte
            break
        }
        case size >= 1e+3 && size < 1e+6: {
            formattedSize = (1e+3 / size).toFixed(2)
            formattedUnits = units.kilobyte
            break
        }
        case size >= 1e+6 && size < 1e+9: {
            formattedSize = (1e+6 / size).toFixed(2)
            formattedUnits = units.megabyte
            break
        }
        case size >= 1e+9 && size < 1e+12: {
            formattedSize = (1e+9 / size).toFixed(2)
            formattedUnits = units.gigabyte
            break
        }
        default: {
            formattedSize = (1e+12 / size).toFixed(2)
            formattedUnits = units.terabyte
        }
    }

    return { formattedSize, formattedUnits }
}

const areUnitsEqual = (units1, units2) => {
    const keys1 = Object.keys(units1)

    if (keys1.length === Object.keys(units2).length) {
        return keys1.every(key1 => units1[key1] === units2[key1])
    }

    return false
}

export default Filesize
