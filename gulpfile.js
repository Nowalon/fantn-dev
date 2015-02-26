// TODO:
// http://lincolnloop.com/blog/speedy-browserifying-multiple-bundles/

var gulp = require('gulp'),
	// jshint = require('gulp-jshint'),
	// jshintReporter = require('jshint-stylish'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	webpack         = require('webpack'),
	webpackConfig   = require('./webpack.config.js'),
	mocha = require('gulp-mocha'),
	watch = require('gulp-watch');

var $ = require('gulp-load-plugins')();

/*
 * Create variables for our project paths so we can change in one place
 */
var paths = {
	'src':['./models/**/*.js','./routes/**/*.js','./services/**/*.js', 'index.js', 'package.json'],
	'jsxsrc':['./assets/app/scripts/**/*.jsx'],

	// enable for tests
	'tests':['./test/services/**/*.js', './test/routes/*.js']
};

gulp.task('test', function () {

	// gulp.src(paths.tests, {read: false})
	// .pipe(mocha({reporter: 'nyan', timeout: 10000}));
});

// Scripts
gulp.task('scripts', function () {

	// gulp.src('assets/app/scripts/app.js')
	// 	.pipe($.browserify({
	// 		insertGlobals: true,
	// 		transform: ['reactify']
	// 	}))
	// 	.pipe(gulp.dest('public/dist/scripts'))
	// 	.pipe($.size());

	gulp.src('assets/app/scripts/landing.js')
		.pipe($.browserify({
			insertGlobals: true,
		}))
		.pipe(gulp.dest('public/dist/scripts'))
		.pipe($.size());
});

gulp.task('webpack', function(cb) {

	var config = Object.create(webpackConfig);

	// we were executed with a --production option
	if (process.env.NODE_ENV === 'production') {
		config.plugins = config.plugins.concat(new webpack.optimize.UglifyJsPlugin());
	}

	webpack(config, function(err, stats) {
		if (err) { throw new gutil.PluginError('webpack', err); }

		// gutil.log('[webpack]', stats.toString({
		//     // output options
		// }));
		cb();
	});
});


gulp.task('sass', function () {
    gulp.src('./assets/app/styles/sass/screen.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/styles/dist'));
});

// Images
gulp.task('images', function () {
	return gulp.src('assets/app/images/**/*')
		.pipe($.cache($.imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('public/images'))
		.pipe($.size())
});


// gulp lint
gulp.task('lint', function(){
	// gulp.src(paths.src)
	// 	.pipe(jshint())
	// 	.pipe(jshint.reporter(jshintReporter));

	gulp.src(paths.jsxsrc)
	.pipe($.shell([
		'jsxhint <%= file.path %> --reporter node_modules/jshint-stylish/stylish.js'
	], {ignoreErrors: true}));
});

// Watch
gulp.task('default', ['sass', 'lint', 'scripts', 'webpack', 'images'], function () {

	// Watch .js files
	gulp.watch('assets/app/scripts/**/*.js', ['scripts']);
	gulp.watch('assets/app/scripts/**/*.jsx', ['lint', 'webpack']);

	gulp.watch('./assets/app/styles/sass/**/*.scss', ['sass']);

});
