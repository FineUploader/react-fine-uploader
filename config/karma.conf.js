var path = require('path'),
    webpackConfig = require('./webpack.config'),
    customLaunchers = {
        sl_chrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows 7',
            version: 'latest'
        },
        sl_firefox: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Windows 10',
            version: 'latest'
        },
        sl_ios_safari: {
            base: 'SauceLabs',
            appiumVersion: '1.5.2',
            browserName: 'Safari',
            deviceName: "iPhone 6",
            platformName: 'iOS',
            platformVersion: '9.2',
            name: 'iPhone 6'
        },
        sl_osx_safari: {
            base: 'SauceLabs',
            browserName: 'Safari',
            platform: 'OS X 10.11',
            version: '9.0'
        },
        sl_ie_11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 8.1',
            version: '11'
        },
        sl_edge: {
            base: 'SauceLabs',
            browserName: 'MicrosoftEdge',
            platform: 'Windows 10',
            version: '13.10586'
        }
    }

webpackConfig.module.loaders[0].query = { plugins: ['rewire'] }
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
        sauceLabs: {
            testName: 'react-fine-uploader tests'
        },
        customLaunchers: customLaunchers,
        browsers: Object.keys(customLaunchers),
        browserNoActivityTimeout: 30000,
        captureTimeout: 120000,
        concurrency: 5,
        reporters: ['spec', 'saucelabs'],
        singleRun: true,
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        }
    });
};
