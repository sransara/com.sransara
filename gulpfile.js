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
    return gulp.src("./assets/styles/main.css")
        .pipe(plumber())
        .pipe(postcss([
            tailwind("./assets/styles/tailwind.js"),
            nested(),
            autoprefixer({
                grid: true,
                browsers: [">1%"]
            }),
        ]))
        .pipe(gulp.dest("./assets/build/styles/"));
}

function stylePublish() {
    let postCSSPlugins = []
    postCSSPlugins.push(
    )

    return gulp.src("./assets/styles/main.css")
        .pipe(plumber())
        .pipe(postcss([
            tailwind("./assets/styles/tailwind.js"),
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
                whitelistPatternsChildren: [/classless/],
                fontFace: true,
            }),
            autoprefixer({
                grid: true,
                browsers: [">1%"]
            }),
        ]))
        .pipe(gulp.dest("./assets/build/styles/"));
}

function styleClean() {
    return del("./assets/build/styles/**");
}

/* Assets */
const assetBuild =
    gulp.parallel(
        gulp.series(styleClean, styleBuild)
    );


const assetPublish =
    gulp.parallel(
        gulp.series(styleClean, stylePublish)
    );

function assetWatch() {
    gulp.watch("./assets/styles/**",  { delay: 500 }, styleBuild);
}

/* Site */
function siteServe() {
  return cp.spawn("hugo", ["server", "--minify"], { stdio: "inherit" });
}

function sitePublish() {
  return cp.spawn("hugo", ["--minify", "--templateMetrics", "--templateMetricsHints", "--stepAnalysis"], { stdio: "inherit" });
}


gulp.task("serve", 
    gulp.series(
        assetBuild,
        gulp.parallel(siteServe, assetWatch)
    )
);

gulp.task("publish", 
    gulp.series(
        assetPublish,
        sitePublish
    )
);