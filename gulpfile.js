'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  sassGlob = require('gulp-sass-glob'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  cleanCSS = require('gulp-clean-css'),
  pathBase = './',
  files = {
    src: {
      css: pathBase + 'src/sass/*.scss',
      js: pathBase + 'src/js/*.js',
      npm: pathBase + 'node_modules/'
    },
    dist: {
      css: pathBase + 'dist/',
      js: pathBase + 'dist/'
    }
  };

gulp.task('css', async function () {
  gulp.src(files.src.css, {sourcemaps: true})
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(gulp.dest(files.dist.css))
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(files.dist.css, {sourcemaps: '.'}));
});

gulp.task('js', async function () {
  gulp.src(files.src.js, {sourcemaps: true})
    .pipe(gulp.dest(files.dist.js))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(files.dist.js, {sourcemaps: '.'}));
});

gulp.task('watch', async function () {
  gulp.watch(
    [files.src.css, files.src.js],
    {interval: 1000, usePolling: true},
    gulp.series(
      gulp.parallel('css', 'js')
    )
  );
});

gulp.task('default', function (callback1) {
  return gulp.series('css', 'js', (callback2) => {
    callback1();
    callback2();
  })();
})