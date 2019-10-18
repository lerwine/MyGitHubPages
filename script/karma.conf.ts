import * as karma from 'karma';

module.exports = function (config: karma.Config) {
    console.log("Setting confnig");
    config.set(<karma.ConfigOptions>{
        files: [
            '../src/lib/angular.js/angular.js2',
            '../src/lib/angular.js/angular-route.js',
            '../src/lib/angular.js/angular-mocks.js',
            '../src/lib/twitter-bootstrap/bootstrap.js',
            '../src/app.js',
            'tests/**/*.js'
        ],
        autoWatch: true,
        frameworks: ['jasmine'],
        browsers: ['Chrome'],
        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
        ]
    });
};