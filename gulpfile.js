var gulp = require('gulp');
var gulpNgConfig = require('gulp-ng-config');

gulp.task('configvars', function () {
  gulp.src('app.json')
  .pipe(gulpNgConfig('justMap.config'))
  .pipe(gulp.dest('public/js'))
});
