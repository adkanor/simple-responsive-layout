"use strict";

const { src, dest, watch} = require("gulp");
const gulp = require('gulp');
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const imagemin = require("gulp-imagemin");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const rigger = require("gulp-rigger");
const sass = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify");
const del = require("del");
const { removeAllListeners } = require("process");


const srcPath = "src/";
const distPath = "dist/";

const path = {
  build: {
    html: distPath,
    css: distPath + "css/",
    js: distPath + "js/",
    images: distPath + "images/",
  },
  src: {
    html: "index.html",
    css: srcPath + "scss/*.scss",
    js: srcPath + "js/*.js",
    images: srcPath + "images/**/*.{png,svg}",
  },
  watch: {
    html: "*.html",
    css: srcPath + "scss/**/*.scss",
    js: srcPath + "js/**/*.js",
    images: srcPath + "images/**/*.{png,svg}",
  },
  clean: "./" + distPath,
};

function serve() {
    browserSync.init({
      server: {
        baseDir: "./" + distPath,
      },
    });
  }


  function html() {
    return src(path.src.html)
      .pipe(plumber())
      .pipe(dest(path.build.html))
      .pipe(browserSync.reload({ stream: true }));
  }

function css() {
    return src(path.src.css)
      .pipe(plumber())
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(dest(path.build.css))
      .pipe(
        cssnano({
          zindex: false,
          discardComments: {
            removeAll: true,
          },
        })
      )
      .pipe(
        rename({
          suffix: ".min",
          extname: ".css",
        })
      )
      .pipe(dest(path.build.css))
      .pipe(browserSync.reload({ stream: true }));
  }


function js() {
    return src(path.src.js)
      .pipe(plumber())
      .pipe(rigger())
      .pipe(uglify())
      .pipe(
        rename({
          suffix: ".min",
          extname: ".js",
        })
      )
      .pipe(dest(path.build.js))
      .pipe(browserSync.reload({ stream: true }));
  }
  function images() {
    return src(path.src.images)
      .pipe(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ quality: 85, progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
          imagemin.svgo({
            plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
          }),
        ])
      )
      .pipe(dest(path.build.images))
      .pipe(browserSync.reload({ stream: true }));
  }


  function clean() {
    return del(path.clean);
  }



  function watchFiles(){
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.images], images)
  }
  const build = gulp.series(clean, gulp.parallel(html, css, js, images));
  const dev = gulp.parallel(build, watchFiles, serve);
  exports.html = html;
  exports.css = css;
  exports.js = js;
  exports.images = images;
  exports.clean = clean;
  exports.build = build;
  exports.dev = dev;
exports.default = dev;








