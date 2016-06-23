const ExtractTextPlugin = require('extract-text-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production';
const path = require('path')

module.exports = {
    entry: {
        'traditional-wrapper': [path.resolve('src/wrappers/traditional.js')]
    },
    output: {
        filename: `dist/[name].${isProduction ? 'min.js' : '.js'}`
    },
    resolve: {
        alias: {
            src: path.resolve('src')
        }  
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
