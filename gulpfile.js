// ? ------------------------------------------------------------------------ Déclaration des variables
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var pipeline = require('readable-stream').pipeline;
const image = require('gulp-image');
const autoprefixer = require('gulp-autoprefixer');

sass.compiler = require('node-sass');

// ? ------------------------------------------------------------------------- FUN 

// Moulinette SCSS
gulp.task('moulinette-sass', function() {
    return gulp.src('./src/css/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename({
            extname: ".min.css"
        }))
        .pipe(gulp.dest('./dist/css'));
});
// Moulinette html
gulp.task('moulinette-html', function() {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist'));
});

// Uglify (minify JS)
// gulp.task('moulinette-js', function() {
//     return pipeline(
//         gulp.src('.src/js/*.js'),
//         uglify(),
//         rename({
//             extname: ".min.js"
//         }),
//         gulp.dest('./dist/js')
//     );
// });
gulp.task('moulinette-js', function() {
    return gulp.src('./src/*.js')
        .pipe(uglify())
        .pipe(rename({
            extname: ".min.js"
        }))
        .pipe(gulp.dest('./dist/js'));
});

// todo : réécrire uglify sans pipeline
// BrowserSync - Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});
// gulp image
gulp.task('compress-image', function() {
    gulp.src('./src/img/*')
        .pipe(image({
            pngquant: true,
            optipng: true,
            zopflipng: true,
            jpegRecompress: true,
            mozjpeg: true,
            gifsicle: true,
            svgo: true,
            concurrent: 10,
            quiet: true // defaults to false
        }))
        .pipe(gulp.dest('./dist/img'));

});
// todo : check version courte pour voir si affichage des %




// ? -------------------------------------------------------------------------EXECUTION
gulp.task('execute',
    gulp.parallel('moulinette-sass', 'moulinette-html', 'moulinette-js', 'compress-image', 'browser-sync',
        function() {
            // gulp update dist files from src changment 
            gulp.watch('./src/*.html', gulp.task('moulinette-html'));
            gulp.watch('./src/css/**/*.scss', gulp.task('moulinette-sass'));
            gulp.watch('./src/js/*.js', gulp.task('moulinette-js'));
            // browser sync watch dist changments
            gulp.watch("./dist/*.html").on('change', browserSync.reload);
            gulp.watch("./dist/css/*.css").on('change', browserSync.reload);
            gulp.watch("./dist/js/*.js").on('change', browserSync.reload);
        }));

// gulp.task('default', ['execute']);
// gulp.task('default', ['compress-image']);