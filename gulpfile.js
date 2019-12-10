const cp = require("child_process");

const del = require("del");
const gulp = require("gulp");
const gulpChanged = require('gulp-changed');
const gulpPlumber = require("gulp-plumber");
const gulpPostcss = require("gulp-postcss");
const postcssAutoprefixer = require("autoprefixer");
const postcssPurgecss = require("@fullhuman/postcss-purgecss");
const postcssNested = require('postcss-nested');
const postcssTailwind = require("tailwindcss");


function mdxBuild() {
  return gulp.src("./content/**/*.md", { base: '.' })
    .pipe(gulpChanged("./transient/"))
    .pipe(gulp.dest("./transient/"));
}

function styleBuild() {
  return gulp.src("./assets/styles/main.css", { base: '.' })
    .pipe(gulpPlumber())
    .pipe(gulpPostcss([
      postcssTailwind("./assets/styles/tailwind.config.js"),
      postcssNested(),
      postcssPurgecss({
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
      postcssAutoprefixer(),
    ]))
    .pipe(gulp.dest("./transient/"));
}

function styleClean() {
  return del("./transient/assets/styles/**");
}

function mdxClean() {
  return del("./transient/content/**");
}

const transientBuild = gulp.parallel(
  gulp.series(styleClean, styleBuild),
  gulp.series(mdxClean, mdxBuild),
);

function transientWatch() {
  gulp.watch("./assets/styles/**",  { delay: 500 }, styleBuild);
}

function siteServe() {
  return cp.spawn("hugo", ["server", "--minify"], { stdio: "inherit" });
}

function siteBuild() {
  return cp.spawn("hugo", ["--minify", "--templateMetrics", "--templateMetricsHints"], { stdio: "inherit" });
}


gulp.task("serve",
  gulp.series(
    transientBuild,
    gulp.parallel(siteServe, transientWatch),
  )
);

gulp.task("publish",
  gulp.series(
    transientBuild,
    siteBuild,
  )
);
