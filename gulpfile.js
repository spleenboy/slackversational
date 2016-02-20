"use strict";

const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const watch = require('gulp-watch');

const del = require('del');
const vinylPaths = require('vinyl-paths');

const SRC = 'src/**/*.js';
const LIB = 'dist';
const OPTS = {presets:['es2015']};


gulp.task('clean', () => {
    return gulp.src(LIB + "/*")
           .pipe(vinylPaths(del));
});

gulp.task('build', ['clean'], () => {
    return gulp.src(SRC)
           .pipe(babel(OPTS))
           .pipe(gulp.dest(LIB));
});

gulp.task('lint', () => {
    return gulp.src(LIB + "/**/*.js")
           .pipe(eslint({}))
           .pipe(eslint.format())
           .pipe(eslint.failOnError());
});

gulp.task('watch', () => {
    gulp.watch(SRC, ['build']);
});

gulp.task('default', ['build']);
