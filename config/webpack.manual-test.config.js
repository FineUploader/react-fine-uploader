const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

module.exports = {
    entry: {
        'index': [path.resolve('src/test/manual/index.jsx')]
    },
    output: {
        path: path.resolve('src/test/manual/bundle'),
        filename: '[name].js'
    },
    resolve: {
        alias: {
            src: path.resolve('src')
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
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
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
    plugins: [new ExtractTextPlugin('[name].css')],
    devtool: 'source-map'
}
