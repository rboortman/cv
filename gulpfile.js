const gulp = require('gulp');
const merge = require('merge-stream');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const livereload = require('gulp-livereload');
const include = require("gulp-include");
const image = require('gulp-image');

gulp.task('html', function(){
  return gulp.src('src/pug/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('build'))
    .pipe(livereload())
});

gulp.task('image', function(){
  return gulp.src('assets/*.{png,jpg,jpeg}')
    .pipe(image())
    .pipe(gulp.dest('build/assets/img'));
});

gulp.task('fonts', function(){
  return gulp.src('assets/*.{ttf,otf}')
    .pipe(gulp.dest('build/assets/fonts'));
});

gulp.task('css', function(){
  return gulp.src('src/scss/*.scss')
    .pipe(sass({ includePaths: [ './node_modules/materialize-css/sass/' ] }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/css'))
    .pipe(livereload())
});

gulp.task('icons', function(){
  const css = gulp.src('node_modules/\\@fortawesome/fontawesome-free/css/*')
    .pipe(gulp.dest('build/assets/fonts/font-awesome/css'));
  const js = gulp.src('node_modules/\\@fortawesome/fontawesome-free/js/*')
    .pipe(gulp.dest('build/assets/fonts/font-awesome/js'));
  const sprites = gulp.src('node_modules/\\@fortawesome/fontawesome-free/sprites/*')
    .pipe(gulp.dest('build/assets/fonts/font-awesome/sprites'));
  const fonts = gulp.src('node_modules/\\@fortawesome/fontawesome-free/webfonts/*')
    .pipe(gulp.dest('build/assets/fonts/font-awesome/webfonts'));
  return merge(css, js, sprites, fonts);
  // return css;
});

gulp.task('js', function(){
  return gulp.src('src/js/*.js')
    .pipe(include({
      includePaths: [
        __dirname + "/node_modules",
        __dirname + "/src/js"
      ]
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'))
    .pipe(livereload())
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('src/pug/*.pug', gulp.parallel( 'html' ));
  gulp.watch('src/scss/*.scss', gulp.parallel( 'css' ));
  gulp.watch('src/js/*.js', gulp.parallel( 'js' ));
});

gulp.task('build', gulp.parallel( 'html', 'image', 'fonts', 'css', 'icons', 'js' ));
gulp.task('development', gulp.series( 'build', 'watch' ));
gulp.task('default', gulp.parallel( 'development' ));
