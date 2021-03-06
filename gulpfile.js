var gulp = require('gulp');
var gulpBrowser = require("gulp-browser");
var reactify = require('reactify');
var del = require('del');
var size = require('gulp-size');


let transforms = [
{
    transform: "babelify",
    options: {presets: ["es2015", "react"]}
}];

// tasks
gulp.task('transform', function () {
    var stream = gulp.src('./project/static/scripts/jsx/*.js')
            .pipe(gulpBrowser.browserify(transforms))
            .pipe(gulp.dest('./project/static/scripts/js/'))
            .pipe(size());
    return stream;
});

gulp.task('del', function () {
  return del(['./project/static/scripts/js']);
});

gulp.task('default', ['del'], function() {
    gulp.start('transform');
});

gulp.task('default', ['del'], function () {
    gulp.start('transform');
    gulp.watch('./project/static/scripts/jsx/*.js', ['transform']);
});
