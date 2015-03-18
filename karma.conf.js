// Karma configuration
// Generated on Sun Jul 27 2014 16:46:39 GMT+0800 (CST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      "bower_components/jquery/dist/jquery.js",
      "bower_components/angular/angular.js",
      "bower_components/angular-animate/angular-animate.js",
      "bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
      "bower_components/ng-grid/build/ng-grid.js",
      "bower_components/angular-charts/dist/angular-charts.min.js",
      "bower_components/es5-shim/es5-shim.js",
      "bower_components/d3/d3.min.js",
      "bower_components/angular-translate/angular-translate.js",
      "bower_components/angular-translate-loader-partial/angular-translate-loader-partial.js",
      "bower_components/angular-resource/angular-resource.js",
      "bower_components/angular-ui-router/release/angular-ui-router.js",
      'src/app/**/module.js',
      'src/app/**/resources.js',
      'src/app/**/widgets.js',
      'src/app/**/*.js'
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {

    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};