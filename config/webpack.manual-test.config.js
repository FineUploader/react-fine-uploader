const path = require('path')
const webpackConfig = require('./webpack.config')

module.exports = Object.assign({}, webpackConfig, {
    devtool: 'source-map',
    entry: {
        index: [path.resolve('src/test/manual/index.jsx')]
    },
    output: {
        path: path.resolve('src/test/manual/bundle'),
        filename: '[name].js'
    }
})
