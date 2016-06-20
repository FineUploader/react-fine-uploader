var defaultConfig = require('./karma.conf'),
    webpackConfig = require('./webpack.config')

module.exports = function (config) {
    defaultConfig(config)
    config.set({
        browsers: ['Firefox'],
        reporters: ['spec'],
        webpack: webpackConfig
    });
};
