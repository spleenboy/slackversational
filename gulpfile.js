"use strict";

const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const del = require('del');
const vinylPaths = require('vinyl-paths');

const SRC = 'src/**/*.js';
const LIB = 'dist';
const OPTS = {presets:['es2015']};


gulp.task('build', () => {
    return gulp.src(SRC)
           .pipe(babel(OPTS))
           .pipe(gulp.dest(LIB));
});

gulp.task('clean', () => {
    return gulp.src(`${LIB}/*`)
           .pipe(vinylPaths(del));
});

gulp.task('watch', () => {
    return gulp.src(SRC)
           .pipe(watch(SRC))
           .pipe(babel(OPTS))
           .pipe(gulp.dest(LIB));
});

gulp.task('default', ['clean', 'build']);
