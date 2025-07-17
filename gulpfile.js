/// <binding Clean='clean' />
"use strict";

const gulp = require("gulp"),
      rimraf = require("rimraf"),
      concat = require("gulp-concat"),
      cleanCSS = require("gulp-clean-css"),
      uglify = require("gulp-uglify"),
      gulpSass = require("gulp-sass")(require("sass"));

const paths = {
  webroot: "./Tailspin.SpaceGame.Web/wwwroot/"
};

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.scss = paths.webroot + "css/**/*.scss";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";

gulp.task("clean:js", done => rimraf(paths.concatJsDest, done));
gulp.task("clean:css", done => rimraf(paths.concatCssDest, done));
gulp.task("clean", gulp.series(["clean:js", "clean:css"]));

gulp.task("compile:scss", () => {
  return gulp.src(paths.scss)
    .pipe(gulpSass().on('error', gulpSass.logError))
    .pipe(gulp.dest(paths.webroot + "css"));
});

gulp.task("min:js", () => {
  return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
    .pipe(concat(paths.concatJsDest))
    .pipe(uglify())
    .pipe(gulp.dest("."));
});

gulp.task("min:css", gulp.series(["compile:scss"], () => {
  return gulp.src([paths.css, "!" + paths.minCss])
    .pipe(concat(paths.concatCssDest))
    .pipe(cleanCSS())
    .pipe(gulp.dest("."));
}));

gulp.task("min", gulp.series(["min:js", "min:css"]));

// A 'default' task is required by Gulp v4
gulp.task("default", gulp.series(["min"]));