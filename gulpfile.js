"use strict";

const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');

const SRC = 'src/**/*.js';
const LIB = 'dist';
const OPTS = {presets:['es2015']};

gulp.task('default', () => {
    return gulp.src(SRC)
           .pipe(babel(OPTS))
           .pipe(gulp.dest(LIB));
});

gulp.task('watch', () => {
    return gulp.src(SRC)
           .pipe(watch(SRC))
           .pipe(babel(OPTS))
           .pipe(gulp.dest(LIB));
});
