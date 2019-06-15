/**
 * gulp配置文件
 */
var gulp = require('gulp'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  del = require('del'),
  rev  = require('gulp-rev-append'),
  merge = require('merge-stream'),
  server = require('gulp-devserver'),
  minifyCss = require("gulp-minify-css");

/**
 * 清空内容
 */
gulp.task('clean:interface', function (done) {
  return del([
    'interface/**/**/*',
  ]);
});

/**
 * 复制文件
 */
gulp.task('copy', function (done) {
  var libs = gulp.src('./src/lib/**/*')
    .pipe(gulp.dest('./interface/lib'));

  var static = gulp.src(['./src/static/**/*', './src/static/**/**/*', '!./src/static/css/*', '!./src/static/js/*'])
    .pipe(gulp.dest('interface/static/'));

  var favicon = gulp.src('src/favicon.ico')
    .pipe(gulp.dest('interface/'));

  return merge(libs, static, favicon);
})

/**
 * 引入文件添加版本号
 */
gulp.task('rev',function(){
  return gulp.src('src/*.html')
      .pipe(rev())
      .pipe(gulp.dest('./interface/'));
});
 
/**
 * 压缩css
 */
gulp.task('minify-css', function () {
  return gulp.src('./src/static/css/*.css') // 要压缩的css文件
  .pipe(minifyCss()) //压缩css
  .pipe(gulp.dest('interface/static/css/'));
});

/**
 * 处理js
 */
gulp.task('uglify-js', function(){
  return gulp.src('src/static/js/*.js')
      // 将ES6代码转译为可执行的JS代码
      .pipe(babel())
      // js压缩
      .pipe(uglify({
        mangle: false
      }))
      // 文件输出
      .pipe(gulp.dest('interface/static/js/'))
})

/**
 * 开发代理服务
 */
gulp.task('devserver', function () {
  return gulp.src('./src')
    .pipe(server({
      listdir: false,
      debug: false,
      open: false,
      port: 3000,
      livereload: {
      	clientConsole: false
      },
      proxy: {
      	enable: true,
      	host: 'http://10.74.20.25',
      	urls: /^\/api\//
      }
     }));
});

/**
 * 编译任务
 */
gulp.task('build', gulp.series('clean:interface', 'copy', 'minify-css', 'uglify-js', 'rev', function (done) {
  done();
}));