const { src, dest, series, parallel, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const flatten = require('gulp-flatten');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('node-sass'));
const del = require('del');
const config = require('./config.json');
const path = require('path');
const paths = config.paths;

function serveFiles(done) {
  browserSync.init({
    server: {
      baseDir: paths.dest.baseDir,
      directory: true
    },
    files: [path.join(paths.dest.baseDir, '**/*')]
  });
  done();
}

function buildHtml() {
  return src(paths.source.pug)
    .pipe(pug({
      pretty: true
    }))
    .pipe(dest(paths.dest.baseDir));
}

function buildCss() {
  return src(paths.source.scss)
    .pipe(
      sass({
        includePaths: ['node_modules/@infoprojects/baseline-grid/scss']
      })
    )
    .pipe(dest(path.join(paths.dest.baseDir, paths.dest.css)))
    .pipe(browserSync.stream());
}

function buildJs() {
  return src(paths.source.babel)
    .pipe(
      babel()
    )
    .pipe(dest(path.join(paths.dest.baseDir, paths.dest.js)))
    .pipe(browserSync.stream());
}

function copyLibs(done) {
  src(paths.libs.jquery)
    .pipe(dest(path.join(paths.dest.baseDir, paths.dest.jslibs)));
  src(paths.libs.normalize)
    .pipe(dest(path.join(paths.dest.baseDir, paths.dest.csslibs)));
  done();
}

function cleanDist() {
  return del(path.join(paths.dist.baseDir, '**/*'));
}

function dist(done) {
  src(path.join(paths.dest.baseDir, paths.dest.js, 'float-on-page.js'))
    .pipe(flatten())
    .pipe(dest(paths.dist.baseDir));
  done();
}

function watchFiles(done) {
  watch(paths.source.babel, buildJs);
  watch(paths.source.scss, buildCss);
  watch(paths.source.pug, buildHtml);
  done();
}

exports.css = buildCss;
exports.build = series(cleanDist, buildJs, dist);
exports.default = series(copyLibs, buildHtml, buildCss, buildJs, serveFiles, watchFiles);
