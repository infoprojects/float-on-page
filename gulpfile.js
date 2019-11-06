const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const coffee = require('gulp-coffee');
const config = require('./config.json');
const browserSync = require('browser-sync').create();
const paths = config.paths;
const path = require('path');

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
      sass()
    )
    .pipe(dest(path.join(paths.dest.baseDir, paths.dest.css)))
    .pipe(browserSync.stream());
}

function buildJs() {
  return src(paths.source.coffee)
    .pipe(
      coffee({
        bare: true
      })
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


function watchFiles(done) {
  watch(paths.source.coffee, buildJs);
  watch(paths.source.scss, buildCss);
  watch(paths.source.pug, buildHtml);
  done();
}

exports.default = series(copyLibs, buildHtml, buildCss, buildJs, serveFiles, watchFiles);
