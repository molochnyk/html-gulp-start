const gulp 					= require('gulp');
const	sass 					= require('gulp-sass');
const	browserSync 	= require('browser-sync');
const	concat 				= require('gulp-concat');
const	cleanCSS 			= require('gulp-clean-css');
const	rename				= require('gulp-rename');
const	del 					= require('del');
const	imagemin 			= require('gulp-imagemin');
const	cache 				= require('gulp-cache');
const	autoprefixer 	= require('gulp-autoprefixer');
const	notify				= require("gulp-notify");
const	spritesmith 	= require('gulp.spritesmith');
const	gcmq 					= require('gulp-group-css-media-queries');
// const uglify 				= require('gulp-uglify'),
		

let njkRender = require('gulp-nunjucks-render');

// Скрипты проекта
gulp.task('main-js', function() {
	return gulp.src([
		'app/js/main.js',
		])
	.pipe(concat('main.js'))
	//.pipe(uglify()) //Минимизировать js
	.pipe(gulp.dest('app/js'));
});

gulp.task('js', ['main-js'], function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'./node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
		'./node_modules/owl.carousel/dist/owl.carousel.min.js',
		'app/js/main.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('app/js'))
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

// создаем gulp задачу на компиляцию всех nunjucks шаблонов в текущей директории
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
	gulp.watch(['libs/**/*.js', 'app/js/main.js'], ['js']);
	gulp.watch(['./app/pages' + '/**/*.+(html|nunjucks)', './app/templates' + '/**/*.+(html|nunjucks)'], ['nunjucks']);
	// gulp.watch('./app/pages/**/*.+(html|nunjucks)', ['nunjucks'], browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); 
});

//Sprite task 
gulp.task('sprite', function () {
  var spriteData = gulp.src('app/img/sprite/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  }));
  return spriteData.pipe(gulp.dest('app/img'));
});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);