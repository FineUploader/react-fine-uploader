const ExtractTextPlugin = require('extract-text-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production';
const nodeExternals = require('webpack-node-externals');
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
    externals: [nodeExternals()],
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
    plugins: [new ExtractTextPlugin('[name].css')]
}
