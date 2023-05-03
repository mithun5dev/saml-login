var gulp = require("gulp");
var preprocess = require("gulp-preprocess");
var shell = require("gulp-shell");
var argv = require("yargs").argv;
var rename = require("gulp-rename");
var del = require("del");
var environment =
  (argv.env === undefined) | (typeof argv.env != "string") ? "dev" : argv.env;
var platform =
  (argv.platform === undefined) | (typeof argv.platform != "string")
    ? "android"
    : argv.platform;
var replace = require("gulp-replace");
var cheerio = require("gulp-cheerio");

gulp.task("dev", function () {
  return gulp
    .src("./config/env-global.ts")
    .pipe(preprocess({ context: { NODE_ENV: "DEV", DEBUG: true } }))
    .pipe(rename("env.ts"))
    .pipe(gulp.dest("./src/config/"));
});

gulp.task("qa", function () {
  console.log("Config  QA endpoints");
  return gulp
    .src("./config/env-global.ts")
    .pipe(preprocess({ context: { NODE_ENV: "QA", DEBUG: true } }))
    .pipe(rename("env.ts"))
    .pipe(gulp.dest("./src/config/"));
});

gulp.task("prod", function () {
  console.log("Config  PROD endpoints");
  return gulp
    .src("./config/env-global.ts")
    .pipe(preprocess({ context: { NODE_ENV: "PROD" } }))
    .pipe(rename("env.ts"))
    .pipe(gulp.dest("./src/config/"));
});

gulp.task("clean", function () {
  return del(["dist", "www"]);
});

gulp.task("fetch-version", function () {
  return gulp.src(["config.xml"]).pipe(
    cheerio(function ($, file, done) {
      appVersion = $("widget")[0].attribs.version;
      done();
    })
  );
});

gulp.task(
  "version",
  gulp.series("fetch-version", function () {
    return gulp
      .src("www/*.html")
      .pipe(replace(/{VERSION}/g, appVersion))
      .pipe(
        version({
          value: appVersion,
          append: {
            key: "v",
            to: ["css", "js"],
          },
        })
      )
      .pipe(gulp.dest("www/"));
  })
);

gulp.task("serve", gulp.series("qa", shell.task("ionic serve")));

gulp.task(
  "prepare",
  gulp.series(["clean"], shell.task(["ionic cordova prepare --no-build"]))
);

gulp.task(
  "build",
  gulp.series(
    ["clean", environment],
    shell.task(["ionic cordova build " + platform])
  )
);

gulp.task(
  "build_minify",
  gulp.series(
    ["clean", environment],
    shell.task(["ionic cordova build " + platform + " --prod"])
  )
);

gulp.task(
  "run",
  gulp.series(
    ["clean", environment],
    shell.task(["ionic cordova run " + platform])
  )
);
