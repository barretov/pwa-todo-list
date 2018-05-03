gulp = require('gulp');
jade = require('gulp-jade');
mcss = require('gulp-mcss');
concat = require('gulp-concat');
uglify = require('gulp-uglify');
connect = require('gulp-connect');

gulp.task('teste', function(){
    console.log("Iniciando o build...");
});

// styles
gulp.task('styles', function(){
    return gulp.src([
                    'node_modules/bootstrap/dist/css/bootstrap.min.css',
                    'src/css/*.css',
                    ])
    .pipe(mcss())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(connect.reload());
});

// fonts
gulp.task('fonts', function(){
    return gulp.src([
			        'node_modules/bootstrap/dist/fonts/*',
                    ])
    .pipe(gulp.dest('build/fonts'))
    .pipe(connect.reload());
});

// imgs
gulp.task('images', function(){
 gulp.src([
          'src/img/*',
          ])
 .pipe(gulp.dest('build/img'))
 .pipe(connect.reload());
});

// htmls
gulp.task('jade', function(){
 gulp.src('src/html/*.jade')
 .pipe(jade())
 .pipe(gulp.dest('build'))
 .pipe(connect.reload());
});

// scripts
gulp.task('js', function() {
    gulp.src([
             'node_modules/jquery/dist/jquery.min.js',
             'node_modules/bootstrap/dist/js/bootstrap.min.js',
             'node_modules/bootbox//bootbox.min.js',
             'src/js/*.js'
             ])
    // .pipe(uglify())
    .pipe(concat('script.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(connect.reload());
});

// service worker
gulp.task('sworker', function() {
    gulp.src([
             'service-worker.js',
             'manifest.json',
             ])
    .pipe(gulp.dest('build/'))
    .pipe(connect.reload());
});

// server
gulp.task('server', function() {
	connect.server({
	    root: ['build'],
	    // https: true,
	    livereload: true,
	    port: 443,
	})
});

gulp.task('watch', function(){
    gulp.watch(['src/css/*'], ['styles']);
    gulp.watch(['src/img/*'], ['images']);
    gulp.watch(['src/*/*.jade'], ['jade']);
    gulp.watch(['src/js/*.js'], ['js']);
    gulp.watch(['/*.js'], ['sworker']);
    gulp.watch(['/*.json'], ['sworker']);
})

gulp.task('default',
          [
          'teste',
          'styles',
          'fonts',
          'images',
          'jade',
          'sworker',
          'js',
          'server',
          'watch',
          ]
          )
