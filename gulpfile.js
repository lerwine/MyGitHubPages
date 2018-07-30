var gulp = require('gulp');
var WebServer = require('gulp-webserver');
var TS = require("gulp-typescript");
var FS = require("fs");
var Path = require("path");
var Del = require("del");
var http = require('http');

var scriptDistTsConfig = TS.createProject("./src/tsconfig-dist.json");
var scriptTestTsConfig = TS.createProject("./src/tsconfig.json");
var binTsConfig = TS.createProject("./bin-src/tsconfig.json");

gulp.task("clean-dist-script", function() {
    return Del([Path.join(scriptDistTsConfig.options.outDir, "**/*"), "!" + scriptDistTsConfig.options.outDir]);
});

gulp.task("clean-dist-lib", ["clean-dist-lib-angular", "clean-dist-lib-bootstrap", "clean-dist-lib-bootstrap-table", "clean-dist-lib-popper-js", "clean-dist-lib-jquery"]);

gulp.task("clean-dist-lib-angular", function() {
    return Del(["./dist/lib/angular/**/*", "!./dist/lib/angular"]);
});

gulp.task("clean-dist-lib-bootstrap", function() {
    return Del(["./dist/lib/bootstrap/**/*", "!./dist/lib/bootstrap"]);
});

gulp.task("clean-dist-lib-bootstrap-table", function() {
    return Del(["./dist/lib/bootstrap-table/**/*", "!./dist/lib/bootstrap-table"]);
});

gulp.task("clean-dist-lib-popper-js", function() {
    return Del(["./dist/lib/popper.js/**/*", "!./dist/lib/popper.js"]);
});

gulp.task("clean-dist-lib-jquery", function() {
    return Del(["./dist/lib/jquery/**/*", "!./dist/lib/jquery"]);
});

gulp.task('build-dist-script', function() {
    return scriptDistTsConfig.src()
        .pipe(scriptDistTsConfig())
        .pipe(gulp.dest(scriptDistTsConfig.options.outDir));
});

gulp.task('rebuild-dist-script', ['clean-dist-script', 'build-dist-script']);

gulp.task('refresh-dist-lib', ['refresh-dist-lib-angular', 'refresh-dist-lib-bootstrap', 'refresh-dist-lib-bootstrap-table', 'refresh-dist-lib-popper-js', 'refresh-dist-lib-jquery']);

gulp.task('refresh-dist-lib-angular', ["clean-dist-lib-angular"], function() {
    return gulp.src(["./node_modules/angular/**/*.js", "./node_modules/angular/**/*.css"]).pipe(gulp.dest("./dist/lib/angular"));
});

gulp.task('refresh-dist-lib-bootstrap', ["clean-dist-lib-bootstrap"], function() {
    return gulp.src("./node_modules/bootstrap/dist/**/*").pipe(gulp.dest("./dist/lib/bootstrap"));
});

gulp.task('refresh-dist-lib-bootstrap-table', ["clean-dist-lib-bootstrap-table"], function() {
    return gulp.src("./node_modules/bootstrap-table/dist/**/*").pipe(gulp.dest("./dist/lib/bootstrap-table"));
});

gulp.task('refresh-dist-lib-popper-js', ["clean-dist-lib-popper-js"], function() {
    return gulp.src("./node_modules/popper.js/dist/**/*").pipe(gulp.dest("./dist/lib/popper.js"));
});

gulp.task('refresh-dist-lib-jquery', ["clean-dist-lib-jquery"], function() {
    return gulp.src("./node_modules/jquery/dist/**/*").pipe(gulp.dest("./dist/lib/jquery"));
});

gulp.task('build-script-test', function() {
    return scriptTestTsConfig.src()
        .pipe(scriptTestTsConfig())
        .pipe(gulp.dest(scriptTestTsConfig.options.outDir));
});

gulp.task('rebuild-script-test', ['clean', 'build-script-test']);

gulp.task('build-bin', function() {
    return binTsConfig.src()
        .pipe(binTsConfig())
        .pipe(gulp.dest(binTsConfig.options.outDir));
});

gulp.task('build-all-dist', ['build-bin', 'build-dist-script', 'refresh-dist-lib']);

gulp.task('rebuild-all-dist', ['build-bin', 'rebuild-dist-script', 'refresh-dist-lib']);

gulp.task('build-all-test', ['build-bin', 'build-script-test', 'refresh-dist-lib']);

gulp.task('rebuild-all-test', ['build-bin', 'rebuild-script-test', 'refresh-dist-lib']);

var webServerConfig = {
    livereload: true,
    directoryListing: true,
    open: true,
    port: 8085
};
gulp.task('startWebServer', function(done) {
    var stream;
    stream = gulp.src(__dirname);
    webServerConfig.middleware = function(req, res, next) {
        if (/__kill__\/?/.test(req.url)) {
            res.end();
            stream.emit('kill');
            done();
        }
        next();
    };
    stream.pipe(WebServer(webServerConfig));
    return stream;
});

gulp.task('stopWebServer', function(done) {
    http.request('http://localhost:' + webServerConfig.port + '/__kill__').on('close', done).end();
});