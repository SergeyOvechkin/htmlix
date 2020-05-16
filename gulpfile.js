const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
 
gulp.task('default', () =>
    gulp.src('htmlix-components/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: [
        ['@babel/preset-env', {modules: false}]
]
        }))
        .pipe(concat('htmlix.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
); 