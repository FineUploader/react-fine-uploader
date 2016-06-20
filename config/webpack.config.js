const ExtractTextPlugin = require('extract-text-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production';
const path = require('path')

module.exports = {
    entry: {
        traditional: [path.resolve('src/traditional.jsx')]
    },
    output: {
        filename: `dist/index.${isProduction ? 'min.js' : '.js'}`
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
            },
            {
                test: /\.gif$/,
                loader: 'url-loader?mimetype=image/png'
            }
        ]
    },
    plugins: [ new ExtractTextPlugin('[name].css')],
    devtool: 'source-map'
}
