'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rimraf = require('rimraf');

var config = {
  paths: {
    js: './src/js/**/*.js',
    sass: './src/css/**/*.scss',
    html: './src/partials/**/*.html'
  }
};

/*
gulp.task    // define tasks
gulp.src     // source - read (input)
gulp.dest    // destination - write (output)
gulp.watch   // watch files for changes, to run tasks
  *.pipe     // string together actions
*/

gulp.task('clean-js', function(cb) {
  rimraf('./public/js', cb);
});
gulp.task('clean-css', function(cb) {
  rimraf('./public/css', cb);
});
gulp.task('clean-html', function(cb) {
  rimraf('./public/partials', cb);
});

gulp.task('js', ['clean-js'], function() {
  return gulp.src(config.paths.js)
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('css', ['clean-css'], function() {
  return gulp.src(config.paths.sass)
    .pipe(sass())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('html', ['clean-html'], function() {
  return gulp.src(config.paths.html)
    .pipe(gulp.dest('./public/partials'));
});

gulp.task('watch', function() {
  gulp.watch(config.paths.sass, ['css']);
  gulp.watch(config.paths.js, ['js']);
  gulp.watch(config.paths.html, ['html']);
});

gulp.task('build', ['js', 'css', 'html']);
gulp.task('default', ['build', 'watch']);
