var gulp = require('gulp');
var gulpNgConfig = require('gulp-ng-config');

gulp.task('test', function () {
  gulp.src('app.json')
  .pipe(gulpNgConfig('justMap.config'))
  .pipe(gulp.dest('.'))
});
