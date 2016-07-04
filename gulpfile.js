var gulp = require("gulp"),
    sass = require("gulp-sass"),
    historyApiFallback = require('connect-history-api-fallback'),
    browserSync = require('browser-sync').create();

gulp.task('default', ['sass', 'browserSync'], function () {
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('html/**', browserSync.reload);
});

gulp.task('sass', function () {
    return gulp.src('scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('html/css'));
});

gulp.task('browserSync', ['sass'], function () {
    browserSync.init({
        server: {
            baseDir: 'html',
            middleware: [historyApiFallback({
                index: '/stats.html'
            })]
        },
        open: false,
        reloadOnRestart: true,
    });
});