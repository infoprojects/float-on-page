const { src, dest, series, parallel, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const coffee = require('gulp-coffee');
const flatten = require('gulp-flatten');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
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

function cleanDist() {
  return del(path.join(paths.dist.baseDir,'**/*'));
}

function dist(done) {
  src(path.join(paths.dest.baseDir, paths.dest.js, "float-on-page.js"))
    .pipe(flatten())
    .pipe(dest(paths.dist.baseDir));
  done();
}

function watchFiles(done) {
  watch(paths.source.coffee, buildJs);
  watch(paths.source.scss, buildCss);
  watch(paths.source.pug, buildHtml);
  done();
}

exports.build = series(cleanDist,buildJs, dist);
exports.default = series(copyLibs, buildHtml, buildCss, buildJs, serveFiles, watchFiles);
