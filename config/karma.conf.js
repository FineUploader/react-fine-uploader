var path = require('path'),
    webpackConfig = require('./webpack.config');

webpackConfig.module.rules[0].query = { plugins: ['rewire'] }
webpackConfig.devtool = 'inline-source-map'

module.exports = function (config) {
    config.set({
        basePath: 'src',
        files: [
            path.resolve('src/test/unit/tests.bundle.js')
        ],
        frameworks: ['jasmine'],
        preprocessors: (function() {
            var preprocessors = {}
            preprocessors[path.resolve('src/test/unit/tests.bundle.js')] = ['webpack', 'sourcemap']
            return preprocessors
        }()),
        browsers: ['Firefox'],
        browserNoActivityTimeout: 30000,
        captureTimeout: 120000,
        concurrency: 5,
        reporters: ['spec'],
        singleRun: true,
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        }
    });
};
