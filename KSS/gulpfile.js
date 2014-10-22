'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var paths = require('compass-options').paths();
var compass = require('gulp-compass');
var browserSync = require('browser-sync');
var shell = require('gulp-shell');
var scsslint = require('gulp-scss-lint');
var gulpkss = require('gulp-kss');
var size = require('gulp-filesize');
// var duration = require('gulp-duration')

// Errors

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

//////////////////////////////
// JS lint Tasks
//////////////////////////////
gulp.task('jslint', function () {
  return gulp.src([
      paths.js + '/*.js',
      // '!' + paths.js + '/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
});

//////////////////////////////
// JS Lint Watch
//////////////////////////////
gulp.task('jswatch', function () {
  gulp.watch(paths.js + '/**/*.js', ['jslint']);
});

//////////////////////////////
// SCSS Linting Task
//////////////////////////////
gulp.task('scsslint', function() {
  return gulp.src([
    'sass/**/*.scss',
    '!sass/**/vendor/**/*.scss',
    '!sass/global/mixins/_kickstart-alternative.scss',
    '!sass/global/mixins/_show-hide.scss',
    '!sass/global/_normalize.scss',
    '!sass/styleguide/_kss.scss',
    ])
    .pipe(scsslint({
      'xmlPipeOutput': 'scssReport.xml',
      'bundleExec': true
    }))
    //
});

//////////////////////////////
// SCSS Linting Watch Task
//////////////////////////////

gulp.task('scsslint-watch', function () {
  gulp.watch('sass/**/*.scss', ['scsslint']);
});




//////////////////////////////
// Compass Task - Development (Uses complile mode of config.rb)
// Based on https://gist.github.com/aaronwaldon/8657432
//////////////////////////////

// Default Build task (slower as all non-partial .scss files render in sequence)

gulp.task('compass-build', function() {
  return gulp.src(['./sass/*.scss'])
    .pipe(compass({
          config_file: './config.rb',
          css: 'css',
          sass: 'sass',
          time: 'true',
          sourcemap: 'true',
          style:'expanded',
          comments:'false',
          bundle_exec: true
      }))
      .on('error', handleError)
      .pipe(gulp.dest('css'))
      .pipe(size())
});

// Build ONLY the style.scss file
gulp.task('compass-build-style', function() {
  gulp.src([
    './sass/style.scss',
    './sass/**/_*.scss'
    ])
    .pipe(compass({
          config_file: './config.rb',
          css: 'css',
          sass: 'sass',
          time: 'true',
          sourcemap: 'false',
          style:'compressed',
          comments:'false',
          bundle_exec: true
      }))
    .pipe(gulp.dest('css'))
    .pipe(size())
});


// Build only styleguide.scss files
gulp.task('compass-build-styleguide', function() {
  gulp.src([
    './sass/styleguide.scss',
    './sass/**/_*.scss'
    ])
    .pipe(compass({
          config_file: './config.rb',
          css: 'css',
          sass: 'sass',
          time: 'true',
          sourcemap: 'false',
          style:'compressed',
          comments:'false',
          bundle_exec: true
      }))
    .pipe(gulp.dest('css'))
    .pipe(size())
});

// Build styleguide.scss files
gulp.task('compass-build-ie9', function() {
  gulp.src([
    './sass/ie9.scss',
    './sass/**/_*.scss'
    ])
    .pipe(compass({
          config_file: './config.rb',
          css: 'css',
          sass: 'sass',
          time: 'true',
          sourcemap: 'false',
          style:'compressed',
          comments:'false',
          bundle_exec: true
      }))
    .pipe(gulp.dest('css'))
    .pipe(size())
});

// Build 3 tasks in parrallel
gulp.task('compass-build-fast', ['compass-build-style', 'compass-build-styleguide', 'compass-build-ie9']);


gulp.task('compass-watch', function () {
  gulp.watch('sass/**/*.scss', ['compass-build']);
});



// gulp.task('compass-watch', function () {
//   shell(['bundle exec compass watch --time']);
// });


//////////////////////////////
// Compass Task - Production Build
//////////////////////////////

gulp.task('build', ['compass-build','lint']);

//////////////////////////////
// BrowserSync Task
//////////////////////////////
gulp.task('browserSync', function () {
  browserSync.init([
    paths.css +  '/**/*.css',
    paths.js + '/**/*.js',
    paths.img + '/**/*',
    paths.fonts + '/**/*',
    paths.html + '/**/*.html',
  ]);
});



//////////////////////////////
// Style Guide Task
//////////////////////////////

gulp.task('styleguide', function() {
  gulp.src(['sass/**/*.scss'])
      .pipe(gulpkss({
          overview: __dirname + '/sass/styleguide.md',
          templateDirectory: __dirname + '/styleguide-template',
          markdown: true
      }))
    .pipe(gulp.dest('styleguide/'));
});

// gulp.task('stylewatch', ['server']);

//////////////////////////////
// Server Tasks
//////////////////////////////
gulp.task('watch', ['jswatch', 'compass-watch', 'browserSync']);
// gulp.task('serve', ['server']);
