"use strict";

const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');

const SRC = 'src/**/*.js';
const LIB = 'lib';

gulp.task('default', () => {
    return gulp.src(SRC)
           .pipe(babel())
           .pipe(gulp.dest(LIB));
});

gulp.task('watch', () => {
    return gulp.src(SRC)
           .pipe(watch(SRC))
           .pipe(babel())
           .pipe(gulp.dest(LIB));
});
