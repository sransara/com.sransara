const cp = require("child_process");
const fs = require("fs");

const del = require("del");
const gulp = require("gulp");
const gulpChanged = require("gulp-changed");
const gulpPlumber = require("gulp-plumber");

function mdPreprocessor() {
  const _ = require("lodash");
  const through = require("through2");
  const vinyl = require("vinyl");
  const unified = require("unified");
  const parse = require("remark-parse");
  const shortcodes = require("remark-shortcodes");
  const visit = require("unist-util-visit");

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      this.emit(
        "error",
        new pluginError(PLUGIN_NAME, "Streams are unsupported")
      );
      return cb();
    }

    file.path = file.path.replace(/index.md$/, "index.json");
    mdsrc = file.contents.toString(enc);
    gstream = this;

    var tree = unified()
      .use(parse)
      .use(shortcodes, { startBlock: "{{<", endBlock: ">}}", inlineMode: true })
      .parse(mdsrc);

    var meta = {};
    file.contents = Buffer.from(JSON.stringify(meta));
    visit(tree, "shortcode", function(node) {
      if (node.identifier.indexOf("named-") == 0) {
        if (
          _.has(meta, [
            "named-shortcode",
            node.identifier,
            node.attributes.name
          ])
        ) {
          gstream.emit(
            "error",
            `File: ${file.path}\n  shortcode: ${node.identifier}\n  conflicting names "${node.attributes.name}"`
          );
        }
        _.set(
          meta,
          ["named-shortcode", node.identifier, node.attributes.name],
          {
            ordinal:
              _.size(_.get(meta, ["named-shortcode", node.identifier], {})) + 1
          }
        );
      }
    });
    file.contents = Buffer.from(JSON.stringify(meta));
    return cb(null, file);
  });
}

function mdxBuild() {
  return gulp
    .src("./content/**/index.md", { base: "." })
    .pipe(gulpPlumber())
    .pipe(gulpChanged("./transient/", { extension: ".json" }))
    .pipe(mdPreprocessor())
    .pipe(gulp.dest("./transient/"));
}

function styleBuild() {
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

function styleClean() {
  return del("./transient/assets/styles/**");
}

function mdxClean() {
  return del("./transient/content/**");
}

const transientBuild = gulp.parallel(
  gulp.series(styleClean, styleBuild),
  gulp.series(mdxClean, mdxBuild)
);

function transientWatch() {
  gulp.watch(
    ["./assets/styles/**", "layouts/**/*.html"],
    { delay: 500 },
    styleBuild
  );

  gulp.watch(["./content/**/index.md"], { delay: 500 }, mdxBuild);
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
  gulp.series(transientBuild, gulp.parallel(siteServe, transientWatch))
);

gulp.task("publish", gulp.series(transientBuild, siteBuild));
