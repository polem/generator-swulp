# Swulp Generator

! This is very largely inspired by [generator-gulp-webapp](https://github.com/yeoman/generator-gulp-webapp)

[Yeoman](http://yeoman.io) generator that scaffolds out a front-end web app using [Gulp](http://gulpjs.com/) for the build process.

![](http://i.imgur.com/rwDYkQy.png)

## Features

Please see our [gulpfile.js](https://github.com/polem/generator-swulp/blob/master/app/templates/gulpfile.js) for up to date information on what we support.

* Compile swig templates
* CSS Autoprefixing *(new)*
* Built-in preview server with LiveReload
* Automagically compile Sass
* Automagically lint your scripts
* Awesome Image Optimization (via OptiPNG, pngquant, jpegtran and gifsicle)
* Automagically wire-up dependencies installed with [Bower](http://bower.io) (when `gulp watch` or `gulp wiredep`)
* TODO: Mocha Unit Testing with PhantomJS
* TODO: Optional - Leaner Modernizr builds *(new)*

For more information on what `generator-swulp` can do for you, take a look at the [Gulp plugins](https://github.com/polem/generator-swulp/blob/master/app/templates/_package.json) used in our `package.json`.


## Getting Started

- Install: `npm install -g generator-swulp`
- Run: `yo swulp`
- Run `gulp` for building and `gulp watch` for preview


#### Third-Party Dependencies

*(HTML/CSS/JS/Images/etc)*

To install dependencies, run `bower install depName --save` to get the files, then add a `script` or `style` tag to your `index.html` or an other appropriate place.

## Options

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after scaffolding has finished.

* `--test-framework=<framework>`

  Defaults to `mocha`. Can be switched for another supported testing framework like `jasmine`.


## Contribute

@TODO

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
