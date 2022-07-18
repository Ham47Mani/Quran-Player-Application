var {src, dest, series, parallel, watch}   = require("gulp"), // Import gulp
    concat        = require("gulp-concat"), // Import concatenation plugin
    sass          =require('gulp-sass')(require('sass')), // Import sass plugin
    autoprefixer  = require("gulp-autoprefixer"), // Import auto prefixer plugin
    pug           = require("gulp-pug"), // Import pug plugin
    livereload    = require("gulp-livereload"), // Import live reload plugin
    sourceMaps    = require("gulp-sourcemaps"), // Import source maps plugin
    minify        = require("gulp-minify"), // Import minify plugin
    notify        = require("gulp-notify"), // Import notify plugin
    ts            = require('gulp-typescript'); // Import typescript plugin


/*
  =============================
  HTML task
  =============================
*/
function html () {
  return src("src/html/*.pug")
          .pipe(pug({ pretty: true }))
          .pipe(dest("dist"))
          .pipe(livereload());
}


/*
  =============================
  CSS task
  =============================
*/
function css() {
  src("src/css/libs/*.css").pipe(dest("dist/css/"));
  return src("src/css/**/*.scss", "!src/css/libs")
          .pipe(sourceMaps.init())
          .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError)) //{ outputStyle: "compressed" }
          .pipe(autoprefixer())
          .pipe(concat("main.css"))
          .pipe(sourceMaps.write("."))
          .pipe(dest("dist/css"))
          .pipe(livereload());
}

/*
  =============================
  TypeScript task
  =============================
*/
function typescript() {
  return src("src/script/*.ts")
          .pipe(ts({
            noImplicitAny: true,
          }))
          .pipe(concat("typescript.js"))
          .pipe(dest("src/script"))
          .pipe(livereload());
}
/*
  =============================
  Javascript task
  =============================
*/
function script() {
  src("src/script/JsLibs/*.js").pipe(dest("dist/script/"));
  return src("src/script/*.js")
          .pipe(concat("script.js"))
          .pipe(minify())
          .pipe(dest("dist/script"))
          .pipe(livereload());
}

/*
  =============================
  Move Files task
  =============================
*/
function moveFiles() {
  src("src/fonts/**/*").pipe(dest("dist/fonts"))
  src("src/webfonts/**/*").pipe(dest("dist/webfonts"))
  return src("src/imgs/**/*")
          .pipe(dest("dist/imgs"))
          .pipe(livereload());
}

/*
  =============================
  Watch task
  =============================
*/
function watching () {
  require("./server");
  livereload.listen();
  watch("src/html/**/*.pug", html);
  watch(["src/css/**/*.css", "src/css/**/*.scss"], css);
  watch("src/script/**/*.ts", typescript);
  watch("src/script/**/*.js", script);
}

/*
  =========================================
  Make watching function as a default task
  =========================================
*/

exports.default = watching;
exports.move = moveFiles;