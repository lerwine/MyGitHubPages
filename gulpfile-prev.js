var gulp = require("gulp"),
    clean = require('gulp-clean'),
    tslint = require("gulp-tslint"),
    webserver = require('gulp-webserver'),
    mocha = require('gulp-mocha'),
    ts = require("gulp-typescript"),
    path = require('path');

var tsProject = ts.createProject("tsconfig.json");
var libPath = './dist/lib';

gulp.task("lint", function() {
    return gulp.src([
        "src/**/**.ts",
        "test/**/**.test.ts"
    ])
    .pipe(tslint({ }))
    .pipe(tslint.report("verbose"));
});

gulp.task("clean-lib", function() {
    return gulp.src('./dist/lib/*', {force: true})
        .pipe(clean());
});

gulp.task("deploy-lib", ['clean-lib'], function() {
    gulp.src([
        "./node_modules/jquery/dist/**/*.*"
    ]).pipe(gulp.dest('./dist/lib/jquery'));
    gulp.src([
        "./node_modules/popper.js/dist/**/*.*"
    ]).pipe(gulp.dest('./dist/lib/popper.js'));
    gulp.src([
        "./node_modules/bootstrap/dist/**/*.*"
    ]).pipe(gulp.dest('./dist/lib/bootstrap'));
    gulp.src([
        "./node_modules/bootstrap-table/dist/**/*.*"
    ]).pipe(gulp.dest('./dist/lib/bootstrap-table'));
    return gulp.src([
        "./node_modules/angular/**/*.*"
    ]).pipe(gulp.dest('./dist/lib/angular'));
});

gulp.task('clean-ts', function() {
    return gulp.src(tsProject.config.compilerOptions.outDir, {force: true})
        .pipe(clean());
});

gulp.task('build-ts', function() {
    tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest(tsProject.config.compilerOptions.outDir));
});

gulp.task('startWebServer', function() {
    gulp.src('.').pipe(webserver({
        livereload: true,
        directoryListing: true,
        open: true,
        port: 8085
    }));
});

gulp.task('stopWebServer', function() {
    var stream = gulp.src('.').pipe(webserver());
    stream.emit('kill');
});