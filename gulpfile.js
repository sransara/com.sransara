const cp = require("child_process");
const fs = require("fs");

const del = require("del");
const gulp = require("gulp");
const gulpChanged = require("gulp-changed");
const gulpPlumber = require("gulp-plumber");

function contentPreprocessor() {
  const _ = require("lodash");
  const through = require("through2");
  const vinyl = require("vinyl");

  return through.obj(function(file, enc, cb) {
    var stream = this;

    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      stream.emit("error",
                `File: ${file.path}\n`+
                `  Streams are unsupported`);
      return cb();
    }

    file.path = file.path.replace(/index[.]md$/, "index.json");
    var src = file.contents.toString(enc);
    file.contents = Buffer.from("{}");

    const tagOpener = "{{<";
    const tagCloser = ">}}";
    var shortcodes = {};
    var cshortcode = {};
    var startTagOpener = 0;
    var endTagOpener = 0;
    var startTagCloser = 0;
    var endTagCloser = 0;
    var curr = 0;
    while((startTagOpener = src.indexOf(tagOpener, curr)) != -1) {
      endTagOpener = startTagOpener + tagOpener.length;
      curr = endTagOpener;

      if(src[endTagOpener] === "/") {
        cshortcode["inner"] = src.substring(endTagCloser, startTagOpener).trim();
        continue
      }

      startTagCloser = src.indexOf(tagCloser, curr);
      endTagCloser = startTagCloser + tagCloser.length;
      curr = endTagCloser;

      cshortcode = {};
      if(src[startTagCloser - 1] === "/") {
        cshortcode["inner"] = "";
        startTagCloser -= 1;
      }

      var tagstr = src.substring(endTagOpener, startTagCloser);
      var tagstrparts = tagstr.match(/(?:[^\s"]+|"[^"]*")+/g); 
      var tag = tagstrparts[0];
      var offset = startTagOpener;
      cshortcode["tag"] = tag;
      cshortcode["offset"] = offset;
      cshortcode["ordinal"] = _.size(_.get(shortcodes, [tag], {})) + 1;
      cshortcode["attributes"] = {};
      tagstrparts.slice(1).forEach(function(item, index) {
        var attrparts = item.split("=");
        if(attrparts.length == 2) {
          cshortcode["attributes"][attrparts[0]] = attrparts[1].slice(1, -1);
        }
        else {
          cshortcode["attributes"][attrparts[0]] = "";
        }
      });
      var name = cshortcode["attributes"]["name"] || `${tag}:${offset}`;
      if(!shortcodes[tag]) {
        shortcodes[tag] = {};
      }
      shortcodes[tag][name] = cshortcode;
    }
    file.contents = Buffer.from(JSON.stringify(shortcodes));
    return cb(null, file);
  });
}

function contentBuild() {
  return gulp
    .src("./content/**/*index.md", { base: "." })
    .pipe(gulpPlumber())
    .pipe(gulpChanged("./transient/", { extension: ".json" }))
    .pipe(contentPreprocessor())
    .pipe(gulp.dest("./transient/"));
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

function contentClean() {
  return del("./transient/content/**");
}

const depBuild = gulp.parallel(
  gulp.series(stylesClean, stylesBuild),
  gulp.series(scriptsClean, scriptsBuild),
  gulp.series(contentClean, contentBuild)
);

function depWatch() {
  gulp.watch(["./assets/styles/**", "layouts/**/*.html"], { delay: 500 }, stylesBuild);
  gulp.watch(["./content/**/index.{md,org}"], { delay: 0 }, contentBuild);
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
