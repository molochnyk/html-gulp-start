const gulp 					= require('gulp');
const	sass 					= require('gulp-sass');
const	browserSync 	= require('browser-sync');
const	concat 				= require('gulp-concat');
const	cleanCSS 			= require('gulp-clean-css');
const	rename				= require('gulp-rename');
const	cache 				= require('gulp-cache');
const	autoprefixer 	= require('gulp-autoprefixer');
const	notify				= require("gulp-notify");
const	gcmq 					= require('gulp-group-css-media-queries');
const njkRender     = require('gulp-nunjucks-render');
const babel					= require("gulp-babel");
const uglify 				= require('gulp-uglify');
const del						= require('del');

// Скрипты проекта

gulp.task('main-js', function() {
	return gulp.src([
		'app/js/bundle.js',
	])
	.pipe(concat('bundle.min.js'))
	.pipe(babel())
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('vendors-js', function() {
	return gulp.src([
		'./node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
		'./node_modules/swiper/js/swiper.min.js',
		'./node_modules/imask/dist/imask.min.js',
		'./node_modules/jquery-match-height/dist/jquery.matchHeight-min.js',
		'./node_modules/aos/dist/aos.js',
	])
	.pipe(concat('vendors.min.js'))
	.pipe(gulp.dest('app/js'));
});

gulp.task('js', ['main-js', 'vendors-js'], function() {
	return gulp.src('app/js/**/*.js')
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.scss')
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(gcmq())
	.pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('./app/pages/**/*.+(html|nunjucks)')
  // Renders template with nunjucks
  .pipe(njkRender({
		path: ['./app/templates']
  }))
  // output files in app folder
	.pipe(gulp.dest('./app'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', [ 'nunjucks', 'sass', 'js', 'browser-sync'], function() {
	setTimeout(function() {
		gulp.watch('app/sass/**/*.scss', ['sass']);
	}, 1000);
	gulp.watch(['app/js/bundle.js'], ['js']);
	gulp.watch(['./app/pages' + '/**/*.+(html|nunjucks)', './app/templates' + '/**/*.+(html|nunjucks)'], ['nunjucks']);
	// gulp.watch('./app/pages/**/*.+(html|nunjucks)', ['nunjucks'], browserSync.reload);
});

gulp.task('copy', function() {
	gulp.src('./app/*.html')
	.pipe(gulp.dest('dist'));

	gulp.src('./app/css/*.css')
	.pipe(gulp.dest('dist/css'));

	gulp.src('./app/js/*.min.js')
	.pipe(gulp.dest('dist/js'));

	gulp.src('./app/img/**/*.{gif,jpg,png,svg,webp}')
	.pipe(gulp.dest('dist/img'));

	gulp.src('./app/fonts/**/*.{woff,woff2,ttf,eot}')
	.pipe(gulp.dest('dist/fonts'));

	gulp.src('./app/*.php')
	.pipe(gulp.dest('dist'));

	return gulp.src('./app/ht.access')
	.pipe(gulp.dest('dist'));

});

gulp.task('clean', function(){
	return del('dist/**', {force:true});
});

gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);