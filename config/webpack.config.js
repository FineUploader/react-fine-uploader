const ExtractTextPlugin = require('extract-text-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production';
const path = require('path')

module.exports = {
    entry: {
        'traditional-wrapper': [path.resolve('src/wrappers/traditional.js')],
        'file-input': [path.resolve('src/components/file-input/styleable-element.jsx')]
    },
    output: {
        path: path.resolve('lib'),
        filename: `[name].${isProduction ? 'min.js' : '.js'}`
    },
    resolve: {
        alias: {
            src: path.resolve('src'),
            test: path.resolve('src/test/unit')
        },
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.js/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            }
        ]
    },
    plugins: [new ExtractTextPlugin('[name].css')]
}
