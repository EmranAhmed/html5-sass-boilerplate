'use strict';

const fs           = require('fs-extra');
const download     = require('download');
const gulp         = require('gulp');
const extract      = require('extract-zip');
//const plumber      = require('gulp-plumber');
const sass         = require('gulp-sass');
const sourcemaps   = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const lineec       = require('gulp-line-ending-corrector');
const rename       = require('gulp-rename');
const browserSync  = require('browser-sync').create();
const imagemin     = require('gulp-imagemin');
const wpPot        = require('gulp-wp-pot');
const mmq          = require('gulp-merge-media-queries');
const minifycss    = require('gulp-uglifycss'); // Minifies CSS files.
const sort         = require('gulp-sort'); // Recommended to prevent unnecessary changes in pot-file.
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify');
const htmlImport   = require('gulp-html-import');

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
    src      : './src',
    dest     : './assets',
    node     : './node_modules',
    elements : './elements',
    html     : './html'
};

gulp.task('import', () => {
    gulp.src(`${dirs.html}/*.html`)
        .pipe(htmlImport(`${dirs.elements}/`))
        .pipe(gulp.dest('./'));
});

// Run:
// gulp copy-assets
// Copy all needed dependency assets files from bower_component assets to themes /js, /scss and /fonts folder. Run this task after bower install or bower update

gulp.task('copy-assets', () => {
    gulp.src(`${dirs.node}/font-awesome/scss/*.scss`)
        .pipe(gulp.dest(`${dirs.src}/sass/font-awesome`));
    gulp.src(`${dirs.node}/font-awesome/fonts/**/*.{ttf,woff,woff2,eot,svg}`)
        .pipe(gulp.dest(`${dirs.dest}/fonts/font-awesome`));
    gulp.src(`${dirs.node}/owl.carousel/src/scss/*.scss`)
        .pipe(gulp.dest(`${dirs.src}/sass/owl.carousel`));
    gulp.src(`${dirs.node}/owl.carousel/src/img/*`)
        .pipe(gulp.dest(`${dirs.dest}/img`));
    gulp.src(`${dirs.node}/owl.carousel/dist/owl.carousel.min.js`)
        .pipe(gulp.dest(`${dirs.dest}/js`));
    gulp.src([
        `${dirs.node}/bootstrap-sass/assets/stylesheets/*`,
        `${dirs.node}/bootstrap-sass/assets/stylesheets/**/*`
    ]).pipe(gulp.dest(`${dirs.src}/sass/bootstrap`));
    gulp.src(`${dirs.node}/bootstrap-sass/assets/fonts/**/*`)
        .pipe(gulp.dest(`${dirs.dest}/fonts`));
    gulp.src(`${dirs.node}/bootstrap-sass/assets/javascripts/bootstrap.min.js`)
        .pipe(gulp.dest(`${dirs.dest}/js`));

    gulp.src(`${dirs.node}/jquery/dist/jquery.min.js`).pipe(gulp.dest(`${dirs.dest}/js`));

});

gulp.task('styles', () => {
    gulp.src(`${dirs.src}/sass/style.scss`)
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole : true,
            //outputStyle     : 'compact',
            outputStyle     : 'compressed',
            // outputStyle: 'nested',
            // outputStyle: 'expanded',
            precision       : 10
        })).on('error', console.error.bind(console))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(sourcemaps.write({includeContent : false, sourceRoot : '../../src/sass'}))
        //.pipe(lineec())
        .pipe(gulp.dest(`${dirs.dest}/css`))
});

gulp.task('scripts', () => {
    gulp.src([ // Add global script file name here

            //`${dirs.dest}/js/owl.carousel.min.js`,
            `${dirs.dest}/js/jquery.min.js`,
            `${dirs.dest}/js/bootstrap.min.js`,
            `${dirs.dest}/js/scripts.js`
        ])
        .pipe(concat(`${dirs.dest}/js/scripts.min.js`))
        //.pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest('./'))
        .pipe(uglify())
        //.pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest('./'));
});

const browserSyncOptions = {
    proxy  : "sites.dev/git-training",
    notify : false
};

gulp.task('browser-sync', () => {
    browserSync.init({

        // For more options
        // @link http://www.browsersync.io/docs/options/

        // Project URL.
        proxy : browserSyncOptions.proxy,

        // `true` Automatically open the browser with BrowserSync live server.
        // `false` Stop the browser from automatically opening.
        open : true,

        // Inject CSS changes.
        // Commnet it to reload browser for every CSS change.
        injectChanges : true,

        // Use a specific port (instead of the one auto-detected by Browsersync).
        // port: 7000,

    });
});

const wpPotOptions = {
    'domain'         : 'starter',
    'destFile'       : 'starter.pot',
    'package'        : 'starter',
    'bugReport'      : 'https://themehippo.com/contact/',
    'lastTranslator' : 'ThemeHippo <themehippo@gmail.com>',
    'team'           : 'ThemeHippo <themehippo@gmail.com>',
    'translatePath'  : './languages'
};

gulp.task('translate', () => {
    return gulp.src(`./**/*.php`)
        .pipe(sort())
        .pipe(wpPot(wpPotOptions))
        .pipe(gulp.dest(wpPotOptions.translatePath))
});

gulp.task('default', ['styles', 'scripts', 'import', 'browser-sync'], function () {
    //gulp.watch('./**/*.php', browserSync.reload); // Reload on PHP file changes.
    //gulp.watch('./**/*.html', browserSync.reload); // Reload on PHP file changes.
    gulp.watch('./src/sass/**/*.scss', ['styles']); // Reload on SCSS file changes.
    //gulp.watch('./assets/js/**/*.js', ['scripts', browserSync.reload]); // Reload on customJS file changes.
});