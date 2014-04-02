'use strict';
var fs = require('fs');
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var wiredep = require('wiredep');

var AppGenerator = module.exports = function Appgenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // setup the test-framework property, gulpfile template will need this
  this.testFramework = options['test-framework'] || 'mocha';

  // for hooks to resolve on mocha by default
  options['test-framework'] = this.testFramework;

  // resolved to mocha by default (could be switched to jasmine for instance)
  this.hookFor('test-framework', {
    as: 'app',
    options: {
      options: {
        'skip-install': options['skip-install-message'],
        'skip-message': options['skip-install']
      }
    }
  });

  this.options = options;
  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AppGenerator, yeoman.generators.Base);

AppGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  if (!this.options['skip-welcome-message']) {
    console.log(this.yeoman);
    console.log(chalk.magenta('Out of the box I include HTML5 Boilerplate, jQuery, and a gulpfile.js to build your app.'));
  }

  var prompts = [{
    type: 'checkbox',
    name: 'features',
    message: 'What more would you like?',
    choices: [{
      name: 'Sass with Compass',
      value: 'includeSass',
      checked: true
    }, {
      name: 'Bootstrap',
      value: 'includeBootstrap',
      checked: true
    }, {
      name: 'Modernizr',
      value: 'includeModernizr',
      checked: true
    }]
  }];

  this.prompt(prompts, function (answers) {
    var features = answers.features;

    function hasFeature(feat) { return features.indexOf(feat) !== -1; }

    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.includeSass = hasFeature('includeSass');
    this.includeBootstrap = hasFeature('includeBootstrap');
    this.includeModernizr = hasFeature('includeModernizr');

    cb();
  }.bind(this));
};

AppGenerator.prototype.gulpfile = function gulpfile() {
  this.template('gulpfile.js');
};

AppGenerator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

AppGenerator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

AppGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.copy('bower.json', 'bower.json');
};

AppGenerator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

AppGenerator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

AppGenerator.prototype.h5bp = function h5bp() {
  this.copy('favicon.ico', 'app/favicon.ico');
  this.copy('404.html', 'app/404.html');
  this.copy('robots.txt', 'app/robots.txt');
  this.copy('htaccess', 'app/.htaccess');
};

AppGenerator.prototype.mainStylesheet = function mainStylesheet() {
  var css = 'main.' + (this.includeSass ? 's' : '') + 'css';
  this.copy(css, 'app/styles/' + css);
};

AppGenerator.prototype.writeBaseLayout = function writeBaseLayout() {
  this.copy('index.swig', 'app/index.swig');

  this.mkdir('app/datas');
  this.copy('datas/index.json', 'app/datas/index.json');

  this.baseLayoutFile = this.readFileAsString(path.join(this.sourceRoot(), 'layouts/_base.swig'));
  this.baseLayoutFile = this.engine(this.baseLayoutFile, this);

  // wire Bootstrap plugins
  if (this.includeBootstrap) {
    var bs = 'bower_components/bootstrap' + (this.includeSass ? '-sass/vendor/assets/javascripts/bootstrap/' : '/js/');
    this.baseLayoutFile = this.appendScripts(this.baseLayoutFile, 'scripts/plugins.js', [
      bs + 'affix.js',
      bs + 'alert.js',
      bs + 'dropdown.js',
      bs + 'tooltip.js',
      bs + 'modal.js',
      bs + 'transition.js',
      bs + 'button.js',
      bs + 'popover.js',
      bs + 'carousel.js',
      bs + 'scrollspy.js',
      bs + 'collapse.js',
      bs + 'tab.js'
    ]);
  }

  this.baseLayoutFile = this.appendFiles({
    html: this.baseLayoutFile,
    fileType: 'js',
    optimizedPath: 'scripts/main.js',
    sourceFileList: ['scripts/main.js']
  });
};

AppGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/scripts');
  this.mkdir('app/styles');
  this.mkdir('app/images');
  this.write('app/layouts/_base.swig', this.baseLayoutFile);
  this.write('app/scripts/main.js', 'console.log(\'\\\'Allo \\\'Allo!\');');
};

AppGenerator.prototype.install = function () {
  var howToInstall =
    '\nAfter running `npm install & bower install`, inject your front end dependencies into' +
    '\nyour HTML by running:' +
    '\n' +
    chalk.yellow.bold('\n  gulp wiredep');

  if (this.options['skip-install']) {
    console.log(howToInstall);
    return;
  }

  var done = this.async();
  this.installDependencies({
    skipMessage: this.options['skip-install-message'],
    skipInstall: this.options['skip-install'],
    callback: function () {
      var bowerJson = JSON.parse(fs.readFileSync('./bower.json'));

      // wire Bower packages to .html
      wiredep({
        bowerJson: bowerJson,
        directory: 'app/bower_components',
        ignorePath: 'app/',
        src: 'app/layouts/_base.swig'
      });

      if (this.includeSass) {
        // wire Bower packages to .scss
        wiredep({
          bowerJson: bowerJson,
          directory: 'app/bower_components',
          ignorePath: '../bower_components/',
          src: 'app/styles/*.scss'
        });
      }

      done();
    }.bind(this)
  });
};
