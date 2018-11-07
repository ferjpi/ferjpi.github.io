'use strict'

const gulp = require('gulp')
const panini = require('panini')
const tinyImage = require('gulp-imagemin')
const jsMin = require('gulp-jsmin')
const clean = require('gulp-clean-css')
const rename = require('gulp-rename')
const browser = require('browser-sync')

function pages () {
  return gulp.src('./src/pages/*.html')
    .pipe(panini({
      root: 'src/pages/',
      partials: 'src/partials/',
      layouts: 'src/layouts/',
      pageLayouts: {
        'contacto': 'contacto'
      }
    }))
    .pipe(gulp.dest('./dist'))
}

function minifyImage () {
  return gulp.src('./src/assets/img/*')
    .pipe(tinyImage())
    .pipe(gulp.dest('./dist/assets/img'))
}

function css () {
  return gulp.src('./src/assets/css/*.css')
    .pipe(clean())
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(browser.reload({ stream: true }))
}

function js () {
  return gulp.src('./src/assets/js/*.js')
    .pipe(jsMin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist/assets/js'))
}

function resetPages (cb) {
  panini.refresh()
  cb()
}

function server (cb) {
  browser.init({
    server: 'dist',
    port: 3000
  })
  cb()
}
function watch () {
  gulp.watch('./src/assets/img/*', minifyImage)
  gulp.watch('./src/assets/js/*.js').on('all', gulp.series(js, browser.reload))
  gulp.watch('./src/assets/css/*.css').on('all', css)
  gulp.watch('./src/{layouts,pages,partials}/*.html').on('all', gulp.series(resetPages, pages, browser.reload))
}

gulp.task('build',
  gulp.parallel(js, css, pages, minifyImage)
)

gulp.task('default',
  gulp.series('build', server, watch)
)
