// Karma configuration
// Generated on Sun Mar 22 2020 15:45:01 GMT+0100 (Central European Standard Time)

var webpackConfig = require('./webpack.config');

module.exports = function(config) {
  const webpack = webpackConfig();

  config.set({

    files: [
      {pattern: 'src/app/**/*.spec.ts', type: 'js', watched: false}
    ],
    preprocessors: {
      'src/app/**/*.spec.ts': ['webpack', 'sourcemap']
    },
    webpack: webpack,
    frameworks: ['jasmine'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      }
    },
    browsers: ['ChromeHeadlessNoSandbox'],
    singleRun: true,
    reporters: ['spec'],
    specReporter: {
      showSpecTiming: true,
      suppressSkipped: true,
    },
    plugins: [
      "karma-*",
    ],
  })
};
