const cp = require("child_process");
const del = require("del");
const gulp = require("gulp");
const gulpPlumber = require("gulp-plumber");

function publicClean() {
  return del("./public/**");
}

function scriptsBuild() {
  return gulp
    .src("./assets/scripts/main.js", { base: "." })
    .pipe(gulp.dest("./transient/"));
}

function scriptsClean() {
  return del("./transient/assets/scripts/**");
}

function stylesBuild() {
  return gulp
    .src("./assets/styles/main.css", { base: "." })
    .pipe(gulpPlumber(function (error) {
      this.emit('end');
      this.destroy();
    }))
    .pipe(
      require("gulp-postcss")([
        require("postcss-import")(),
        require("postcss-nested")({
          bubble: ["media", "supports", "screen"],
        }),
        require("tailwindcss")("./assets/styles/tailwind.config.js"),
        require("autoprefixer")(),
      ])
    )
    .pipe(gulp.dest("./transient/"));
}

function stylesClean() {
  return del("./transient/assets/styles/**");
}

const depBuild = gulp.parallel(
  gulp.series(stylesClean, stylesBuild),
  gulp.series(scriptsClean, scriptsBuild)
);

function depWatch() {
  gulp.watch(
    ["./assets/styles/**", "layouts/**/*.html"],
    { delay: 500 },
    stylesBuild
  );
}

function siteServe() {
  return cp.spawn("hugo", ["server", "--minify", "--destination", "public"], {
    stdio: "inherit",
  });
}

function siteBuild() {
  return cp.spawn(
    "hugo",
    [
      "--minify",
      "--destination",
      "public",
      "--templateMetrics",
      "--templateMetricsHints",
    ],
    { stdio: "inherit" }
  );
}

gulp.task(
  "serve",
  gulp.series(publicClean, depBuild, gulp.parallel(siteServe, depWatch))
);

gulp.task("publish", gulp.series(publicClean, depBuild, siteBuild));
