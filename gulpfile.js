const { src, dest, series } = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const coffee = require('gulp-coffee');
const config = require('./config.json');
const browserSync = require('browser-sync').create();
const paths = config.paths;
const path = require('path');

function serve() {
  browserSync.init({
    server: {
      baseDir: paths.dest.baseDir,
      directory: true
    },
    files: [path.join(paths.dest.baseDir, '**/*')]
  });
}

function html() {
  return src(paths.source.pug)
    .pipe(pug({
      pretty: true
    }))
    .pipe(dest(paths.dest.baseDir));
}

function css() {
  return src(paths.source.scss)
    .pipe(
      sass()
    )
    .pipe(dest(path.join(paths.dest.baseDir, paths.dest.css)));
}

function js() {
  return src(paths.source.coffee)
    .pipe(
      coffee({
        bare: true
      })
    )
    .pipe(dest(path.join(paths.dest.baseDir, paths.dest.js)));
}

exports.html = html;
exports.css = css;
exports.js = js;
exports.serve = serve;

exports.defaults = series(html, css, js, serve);
