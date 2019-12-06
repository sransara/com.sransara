const gulp = require("gulp");
const plumber = require("gulp-plumber");
const cp = require("child_process");
const del = require("del");

/* Styles */
const postcss = require("gulp-postcss");
const tailwind = require("tailwindcss");
const purgecss = require("@fullhuman/postcss-purgecss");
const nested = require('postcss-nested');
const autoprefixer = require("autoprefixer");

function styleBuild() {
  return gulp.src("./assets/styles/main.css", { base: '.' })
  .pipe(plumber())
  .pipe(postcss([
    tailwind("./assets/styles/tailwind.config.js"),
    nested(),
    autoprefixer(),
  ]))
  .pipe(gulp.dest("./transient/"));
}

function stylePublish() {
  return gulp.src("./assets/styles/main.css", { base: '.' })
  .pipe(plumber())
  .pipe(postcss([
    tailwind("./assets/styles/tailwind.config.js"),
    nested(),
    purgecss({
      content: ["layouts/**/*.html"],
      extractors: [{
        extractor: class TailwindExtractor {
          static extract(content) {
              return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
          }
        },
        extensions: ["html"]
      }],
      fontFace: true,
    }),
    autoprefixer(),
  ]))
  .pipe(gulp.dest("./transient/"));
}

function styleClean() {
  return del("./transient/assets/styles/**");
}

/* Assets */
const transientBuild = gulp.parallel(
  gulp.series(styleClean, styleBuild)
);

const transientPublish = gulp.parallel(
  gulp.series(styleClean, stylePublish)
);

function transientWatch() {
  gulp.watch("./assets/styles/**",  { delay: 500 }, styleBuild);
}

/* Site */
function siteServe() {
  return cp.spawn("hugo", ["server", "--minify"], { stdio: "inherit" });
}

function sitePublish() {
  return cp.spawn("hugo", ["--minify", "--templateMetrics", "--templateMetricsHints"], { stdio: "inherit" });
}


gulp.task("serve",
  gulp.series(
    transientBuild,
    gulp.parallel(siteServe, transientWatch)
  )
);

gulp.task("publish",
  gulp.series(
    transientPublish,
    sitePublish
  )
);
