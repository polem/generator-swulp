'use strict';
// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

var gulp = require('gulp');
var open = require('open');
var wiredep = require('wiredep').stream;

// Load plugins
var $ = require('gulp-load-plugins')();

<% if (includeSass) { %>
// Styles
gulp.task('styles', function () {
  return gulp.src('app/styles/main.scss')
    .pipe($.rubySass({
      style: 'expanded',
      loadPath: ['app/bower_components']
    }))
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.size());
});
<% } else { %>
// Styles
gulp.task('styles', function () {
  return gulp.src('app/styles/main.css')
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.size());
});
<% } %>
// Scripts
gulp.task('scripts', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('default'))
    .pipe($.size());
});

// HTML
gulp.task('html', ['styles', 'scripts'], function () {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');

  return gulp.src(['app/*.html', '.tmp/*.html'])
    .pipe($.useref.assets())
    .pipe(jsFilter)
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe($.useref.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

// Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size());
});

// Clean
gulp.task('clean', require('del').bind(null, ['dist/styles', 'dist/scripts', 'dist/images']));

// Build
gulp.task('build', ['templates', 'html', 'images']);

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

// Connect
gulp.task('connect', $.connect.server({
    root: ['.tmp', 'app'],
    port: 9000,
    livereload: true
}));

// Swig templates
gulp.task('templates', function() {

  var options = {
    'load_json' : true,
    'json_path': 'app/datas/',
    'defaults': {
      'cache': false
    }
  };

  return gulp.src(['app/**/*.swig', '!**/_*.swig'])
    .pipe($.swig(options))
    .pipe(gulp.dest('.tmp/'))
    .pipe($.size());
});


// Open
gulp.task('serve', ['templates', 'connect'<% if (includeSass) { %>, 'styles'<% } %>], function() {
  open("http://localhost:9000");
});

// Inject Bower components
gulp.task('wiredep', function () {
  gulp.src('app/styles/*.<% if (includeSass) { %>scss<% } else { %>css<% } %>')
    .pipe(wiredep({
      directory: 'app/bower_components',
      ignorePath: 'app/bower_components/'
    }))
    .pipe(gulp.dest('app/styles'));

    gulp.src('app/*.html')
      .pipe(wiredep({
        directory: 'app/bower_components',
        ignorePath: 'app/'
      }))
      .pipe(gulp.dest('app'));

    gulp.src('app/layouts/*.swig')
      .pipe(wiredep({
        directory: 'app/bower_components',
        ignorePath: '../'
      }))
      .pipe(gulp.dest('app'));
});

// Watch
gulp.task('watch', ['connect', 'serve'], function () {
  // Watch for changes in `app` folder
  gulp.watch([
    'app/*.html',
    '.tmp/*.html',
    'app/styles/**/*.css',
    '.tmp/styles/**/*.css',
    'app/scripts/**/*.js',
    'app/images/**/*'
  ], function (event) {
    return gulp.src(event.path)
      .pipe($.connect.reload());
  });

  // Watch .swig files
  gulp.watch(['app/*.swig', 'app/datas/*.json'], ['templates']);

  <% if (includeSass) { %>// Watch .scss files
  gulp.watch('app/styles/**/*.scss', ['styles']);

  <% } else { %>// Watch .css files
  gulp.watch('app/styles/**/*.css', ['styles']);

  <% }  %>// Watch .js files
  gulp.watch('app/scripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('app/images/**/*', ['images']);

  // Watch bower files
  gulp.watch('bower.json', ['wiredep']);
});

