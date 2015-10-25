(function() {
  'use strict';

  var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    plugin = require('gulp-load-plugins')(),
    env = process.env.NODE_ENV || 'development';

  gulp.task('clean', plugin.shell.task([
    'rm -rf public/',
    'rm -rf built/'
  ]));

  gulp.task('jshint', function() {
    gulp.src(['src/{,*/}*.js', 'js/{,*/}*.js', '!js/libs/{,*/}*.js'])
      .pipe(plugin.plumber(function(err) {
        console.log('\x07');
      }))
      .pipe(plugin.jshint())
      .pipe(plugin.jshint.reporter(plugin.stylish))
      // No JS shall pass (if it is broken)!
      .pipe(plugin.jshint.reporter('fail'))
  });

  /*
  **
  ** DEVELOPMENT
  **
  **/

  gulp.task('nodemon', function() {
    plugin.nodemon({
      script: 'app.js',
      ext: 'js',
      watch: ['app.js', 'src/'],
      nodeArgs: ['--debug', '--harmony'],
      env: { 'NODE_ENV': env }
    }).on('restart', function() {
      gulp.start('jshint');
    });
  });

  gulp.task('repo:setup', ['npm:install', 'bower:install']);

  gulp.task('npm:install', plugin.shell.task([
    'npm prune',
    'npm install'
  ]));

  gulp.task('bower:install', plugin.shell.task([
    'bower prune',
    'bower install'
  ]));

  gulp.task('fonts:copy', function() {
    gulp.src('./fonts/**/*.*')
      .pipe(gulp.dest('./public/fonts'));
  });

  gulp.task('images:copy', function() {
    gulp.src('./images/**/*.*')
      .pipe(plugin.newer('./public/img'))
      .pipe(gulp.dest('./public/img'));
  });

  gulp.task('stylus', function() {
    gulp.src('./styles/main.styl')
      .pipe(plugin.plumber())
      .pipe(plugin.stylus())
      .pipe(plugin.autoprefixer({ cascade: true }))
      .pipe(gulp.dest('./public/css'));
  });

  gulp.task('js', ['jshint'], function() {
    gulp.src(['./js/{,*/}*.js'])
      .pipe(gulp.dest('./public/js'));
  });

  gulp.task('livereload', function() {
    plugin.livereload.changed();
  });

  gulp.task('watch', function() {
    plugin.livereload.listen();
    plugin.watch({ glob: 'views/**/*.jade' }, ['livereload']);
    plugin.watch({ glob: 'js/**/*.js' }, ['js', 'livereload']);
    plugin.watch({ glob: 'styles/**/*.styl' }, ['stylus', 'livereload']);
    plugin.watch({ glob: 'images/**/*.*' }, ['images:copy', 'livereload']);
    plugin.watch({ glob: 'fonts/**/*.*' }, ['fonts:copy', 'livereload']);
    plugin.watch({ glob: 'bower_components/**/*.js' }, ['bower:install', 'livereload']);
  });

  /*
  **
  ** BUILD
  **
  **/

  gulp.task('bower:build', function() {
    return plugin.bower('./built/bower_components');
  });

  gulp.task('fonts:build', function() {
    gulp.src('./fonts/**/*.*')
      .pipe(plugin.revAll({ ignore: ['woff.json', 'woff2.json'] }))
      .pipe(gulp.dest('./public/fonts'));
  });

  gulp.task('images:build', function() {
    var pngquant = require('imagemin-pngquant');
    var optipng = require('imagemin-optipng');
    var mozjpeg = require('imagemin-mozjpeg');

    // Copy files from /images to /public/img
    gulp.src('./images/**/*.*')
      .pipe(plugin.newer('./public/img'))
      .pipe(plugin.imagemin({
        use: [
          mozjpeg(),
          pngquant(),
          optipng()
        ]
      }))
      .pipe(gulp.dest('./public/img'));
  });

  gulp.task('js:build', ['jshint'], function() {
    gulp.src(['./js/{,*/}*.js'])
      .pipe(gulp.dest('./built/js'));
  });

  gulp.task('stylus:build', function() {
    gulp.src('./styles/main.styl')
      .pipe(plugin.plumber())
      .pipe(plugin.stylus({ compress: true }))
      .pipe(plugin.autoprefixer({ cascade: true }))
      .pipe(gulp.dest('./built/css'));
  });

  gulp.task('usemin', ['js:build', 'stylus:build', 'bower:build'], function() {
    gulp.src(['./views/**/*.jade'])
      .pipe(plugin.plumber())
      .pipe(plugin.jadeUsemin({
        assetsDir: './built',
        path: './built',
        outputRelativePath: '../../public/',
        js: [
          plugin.uglify({
            mangle: true
          }),
          plugin.revAll()
        ],
        css: [plugin.revAll()]
      }))
      .pipe(gulp.dest('./built/views'));
  });

  gulp.task('default', function() { runSequence('clean', 'repo:setup', ['nodemon', 'watch']); });
  gulp.task('build', function() { runSequence('clean', ['usemin', 'images:build', 'fonts:build']); });

})();
