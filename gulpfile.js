'use strict';

const gulp          = require('gulp');
const fs            = require('fs-extra');
const plumber       = require('gulp-plumber');
const sass          = require('gulp-sass');
const sourcemaps    = require('gulp-sourcemaps');
const autoprefixer  = require('gulp-autoprefixer');
const rename        = require('gulp-rename');
const browserSync   = require('browser-sync').create();
const imagemin      = require('gulp-imagemin');
const mmq           = require('gulp-merge-media-queries');
const minifycss     = require('gulp-uglifycss'); // Minifies CSS files.
const uglify        = require('gulp-uglify');
const htmlImport    = require('gulp-html-import');
const htmlMin       = require('gulp-htmlmin');
const babel         = require('gulp-babel');
const webpack       = require("webpack");
const webpackConfig = require("./webpack.config.js");
const lec           = require('gulp-line-ending-corrector');

const autoprefixerOptions = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
];

const dirs = {
    src            : './src',
    dest           : './assets',
    node           : './node_modules',
    template_parts : './template-parts',
    templates      : './templates',
};

// Image Minification

gulp.task('image:dev', () =>
    gulp.src(`${dirs.src}/img/*`)
        .pipe(gulp.dest(`${dirs.dest}/img`))
);

gulp.task('image:build', () =>
    gulp.src(`${dirs.src}/img/*`)
        .pipe(imagemin({progressive : true}))
        .pipe(gulp.dest(`${dirs.dest}/img`))
);

// HTML Import and Minification

gulp.task('html:dev', () =>
    gulp.src(`${dirs.templates}/**/*.html`)
        .pipe(htmlImport(`${dirs.template_parts}/`))
        .pipe(lec({verbose : true, eolc : 'LF', encoding : 'utf8'}))
        .pipe(gulp.dest('./')));

gulp.task('html:build', () =>
    gulp.src(`${dirs.templates}/**/*.html`)
        .pipe(htmlImport(`${dirs.template_parts}/`))
        .pipe(lec({verbose : false, eolc : 'LF', encoding : 'utf8'}))
        .pipe(htmlMin({collapseWhitespace : true}))
        .pipe(gulp.dest('./'))
);

// Clean
gulp.task('clean', function () {
    fs.emptyDir(`${dirs.dest}/css`, (err) => {})
    fs.emptyDir(`${dirs.dest}/fonts`, (err) => {})
    fs.emptyDir(`${dirs.dest}/img`, (err) => {})
    fs.emptyDir(`${dirs.dest}/js`, (err) => {})
});

// Run:
// gulp copy-assets

gulp.task('copy-assets', () => {

    // FontAwesome
    //gulp.src(`${dirs.node}/font-awesome/scss/*.scss`).pipe(gulp.dest(`${dirs.src}/sass/vendor/font-awesome`));

    gulp.src(`${dirs.node}/font-awesome/fonts/**/*.{ttf,woff,woff2,eot,svg}`).pipe(gulp.dest(`${dirs.dest}/fonts/font-awesome`));

    // Owl Carousel
    //gulp.src(`${dirs.node}/owl.carousel/src/scss/*.scss`).pipe(gulp.dest(`${dirs.src}/sass/vendor/owl.carousel`));

    gulp.src(`${dirs.node}/owl.carousel/src/img/*`).pipe(gulp.dest(`${dirs.src}/img`));

    //gulp.src(`${dirs.node}/owl.carousel/dist/owl.carousel.min.js`).pipe(gulp.dest(`${dirs.dest}/js`));

    // Bootstrap
    //gulp.src([`${dirs.node}/bootstrap-sass/assets/stylesheets/*`,`${dirs.node}/bootstrap-sass/assets/stylesheets/**/*`]).pipe(gulp.dest(`${dirs.src}/sass/vendor/bootstrap`));

    gulp.src(`${dirs.node}/bootstrap-sass/assets/fonts/**/*`).pipe(gulp.dest(`${dirs.dest}/fonts`));

    //gulp.src(`${dirs.node}/bootstrap-sass/assets/javascripts/bootstrap.min.js`).pipe(gulp.dest(`${dirs.dest}/js`));

    // jQuery
    //gulp.src(`${dirs.node}/jquery/dist/jquery.min.js`).pipe(gulp.dest(`${dirs.dest}/js`));

});

// Scripts

gulp.task('scripts:dev', () =>
    gulp.src(`${dirs.src}/js/scripts.js`)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(babel({
            presets : ["es2015"]
        }).on('error', console.error.bind(console)))
        .pipe(plumber.stop())
        .pipe(sourcemaps.write({includeContent : false}))
        .pipe(lec({verbose : true, eolc : 'LF', encoding : 'utf8'}))
        .pipe(gulp.dest(`${dirs.dest}/js`)));

gulp.task('scripts:build', () =>
    gulp.src(`${dirs.src}/js/scripts.js`)
        .pipe(plumber())
        .pipe(babel({
            presets : ["es2015"]
        }).on('error', console.error.bind(console)))
        .pipe(uglify())
        .pipe(plumber.stop())
        //.pipe(rename({
        //    suffix : ".min"
        //}))
        .pipe(lec({verbose : false, eolc : 'LF', encoding : 'utf8'}))
        .pipe(gulp.dest(`${dirs.dest}/js`))
);

// Styles

gulp.task('styles:dev', () =>
    gulp.src(`${dirs.src}/sass/styles.scss`)
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole : true,
            // outputStyle     : 'compact',
            //outputStyle     : 'compressed',
            // outputStyle: 'nested',
            outputStyle     : 'expanded',
            precision       : 10
        })).on('error', console.error.bind(console))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(sourcemaps.write({includeContent : false}))
        .pipe(lec({verbose : true, eolc : 'LF', encoding : 'utf8'}))
        .pipe(gulp.dest(`${dirs.dest}/css`))
);

gulp.task('styles:build', () =>
    gulp.src(`${dirs.src}/sass/styles.scss`)
        //.pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole : true,
            //outputStyle     : 'compact',
            outputStyle     : 'compressed',
            // outputStyle: 'nested',
            // outputStyle: 'expanded',
            precision       : 10
        })).on('error', console.error.bind(console))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(mmq())
        .pipe(minifycss({
            "maxLineLen"   : 80,
            "uglyComments" : true
        }))
        //.pipe(sourcemaps.write({includeContent : false}))
        //.pipe(rename({
        //    suffix : ".min"
        //}))
        .pipe(lec({verbose : false, eolc : 'LF', encoding : 'utf8'}))
        .pipe(gulp.dest(`${dirs.dest}/css`))
);

// Webpack

gulp.task('webpack:build', (callback) => {

    let buildConfig             = Object.create(webpackConfig);
    buildConfig.devtool         = '#source-map';
    buildConfig.output.filename = 'scripts.js';
    buildConfig.plugins         = (buildConfig.plugins || []).concat([
        new webpack.DefinePlugin({
            "process.env" : {
                // This has effect on the react lib size
                "NODE_ENV" : JSON.stringify("production")
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress : {
                warnings : false
            }
        }),
        new webpack.ProvidePlugin({
            $               : "jquery",
            jQuery          : "jquery",
            jquery          : "jquery",
            'window.jQuery' : 'jquery',
            'window.$'      : 'jquery'
        })]);

    webpack(buildConfig, function (err, stats) {
        callback();
    })
});

gulp.task('webpack:dev', (callback) => {

    let devConfig             = Object.create(webpackConfig);
    devConfig.devtool         = '#eval-source-map';
    devConfig.output.filename = 'scripts.js';
    devConfig.plugins         = (devConfig.plugins || []).concat([
        new webpack.ProvidePlugin({
            $               : "jquery",
            jQuery          : "jquery",
            jquery          : "jquery",
            'window.jQuery' : 'jquery',
            'window.$'      : 'jquery'
        })
    ]);
    webpack(devConfig, function (err, stats) {
        callback();
    })
});

const browserSyncOptions = {
    proxy  : "sites.dev",
    notify : false
};

gulp.task('browser-sync', () =>
    browserSync.init({

        // For more options
        // @link http://www.browsersync.io/docs/options/

        // Project URL.
        //proxy : browserSyncOptions.proxy,

        server : {
            baseDir : "./"
        },

        // `true` Automatically open the browser with BrowserSync live server.
        // `false` Stop the browser from automatically opening.
        open : true,

        // Inject CSS changes.
        // Commnet it to reload browser for every CSS change.
        injectChanges : true,

        // Use a specific port (instead of the one auto-detected by Browsersync).
        // port: 7000,

    }));

// npm run build
gulp.task('build', ['styles:build', 'webpack:build', 'html:build']);

// npm run dev
gulp.task('dev', ['styles:dev', 'webpack:dev', 'html:dev', 'browser-sync'], () => {
    gulp.watch([`${dirs.templates}/**/*.html`, `${dirs.template_parts}/**/*.html`], ['html:dev', browserSync.reload]); // Reload on HTML file changes.
    gulp.watch(`${dirs.src}/sass/*.scss`, ['styles:dev', browserSync.reload]); // Reload on SCSS file changes.
    gulp.watch(`${dirs.src}/js/*.js`, ['webpack:dev', browserSync.reload]); // Reload on customJS file changes.
});
