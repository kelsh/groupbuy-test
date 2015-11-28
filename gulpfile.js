//gulp vars

var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var config = {
  port: 3000,
  devBaseUrl: 'http://localhost',
  paths : {
  scripts: ['public/js/'],
  images: 'public/img/',
  css:'public/css/',
  less:'public/less/'
  }
}

//gulp tasks

gulp.task('less', function() {
  gulp.src(config.paths.less+'*.less')
    .pipe(less())
    .pipe(gulp.dest(config.paths.css))
    .pipe(livereload());
});
 
gulp.task('watch', function() {
  gulp.watch(config.paths.less+'*', ['less']);
});

gulp.task('init',function(){
	livereload.listen();
	// configure nodemon
	nodemon({
		// the script to run the app
		script: 'app.js',
		ext: 'js'
	}).on('restart', function(){
		// when the app has restarted, run livereload.
		gulp.src('app.js')
			.pipe(livereload());
	});
});

gulp.task('default', ['less', 'watch', 'init']);