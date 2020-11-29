const cp = require("child_process");
const del = require("del");
const gulp = require("gulp");

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
    .pipe(gulpPlumber())
    .pipe(
      require("gulp-postcss")([
        require("tailwindcss")("./assets/styles/tailwind.config.js"),
        require("postcss-nested")(),
        require("@fullhuman/postcss-purgecss")({
          content: ["layouts/**/*.html"],
          extractors: [
            {
              extractor: class TailwindExtractor {
                static extract(content) {
                  return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
                }
              },
              extensions: ["html"]
            }
          ],
          fontFace: true
        }),
        require("autoprefixer")()
      ])
    )
    .pipe(gulp.dest("./transient/"));
}

function stylesClean() {
  return del("./transient/assets/styles/**");
}

const depBuild = gulp.parallel(
  gulp.series(stylesClean, stylesBuild),
  gulp.series(scriptsClean, scriptsBuild),
);

function depWatch() {
  gulp.watch(["./assets/styles/**", "layouts/**/*.html"], { delay: 500 }, stylesBuild);
}

function siteServe() {
  return cp.spawn("hugo", ["server", "--minify"], { stdio: "inherit" });
}

function siteBuild() {
  return cp.spawn(
    "hugo",
    ["--minify", "--templateMetrics", "--templateMetricsHints"],
    { stdio: "inherit" }
  );
}

gulp.task(
  "serve",
  gulp.series(depBuild, gulp.parallel(siteServe, depWatch))
);

gulp.task("publish", gulp.series(depBuild, siteBuild));
