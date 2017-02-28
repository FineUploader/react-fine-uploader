const ExtractTextPlugin = require('extract-text-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production';
const path = require('path')

module.exports = {
    output: {
        path: path.resolve('lib'),
        filename: `[name].${isProduction ? 'min.js' : '.js'}`
    },
    resolve: {
        alias: {
            lib: path.resolve('lib'),
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
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
            }
        ]
    },
    plugins: [new ExtractTextPlugin('[name].css')]
}
