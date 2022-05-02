# DwindleJS

DwindleJS is a JavaScript and CSS minifier that automatically updates the HTML files to use the single minified file that DwindleJS creates.

**Please note that DwindleJS is still in beta, bugs may occur.**

# Why?

There are many minifiers and combiners available, so you might wonder why I wrote my own. Grunt supports this by using comments like `<!-- build:js scripts/combined.concat.min.js -->` around script tags, and other tools have ways of doing the same.

Unfortunately, all of the tools I looked at had one thing in common: you had to know how the website is structed and where all the files are, or be able to add comments. Most of the time, this isn't an issue. But what if you're working with a tool that dynamically generates a static site (like a documentation tool such as JavaDoc)? In that case, using existing tools becomes challengingas you can't be sure what the output will be, where the files are, what files will be used, etc.

That's why DwindleJS was made.

# Usage

## Simple Example

```js
const dwindle = new DwindleJS();
dwindle.directory = '/var/www/example.com';
dwindle.run().then(result => {
	/* Result is an object containing the following:
		htmlFiles: the number of HTML files found
		jsFiles: the number of unique JavaScript files found referenced in the HTML
		includedJsFiles: the number of scripts you included additionally
		cssFiles: the number of unique CSS files found referenced in the HTML
		includedCssFiles: the number of scripts you included additionally
		removedElements: the number of remove element queries provided
	*/
});
```

## API

Note that all operations are synchronous, except for `run()` which returns a Promise. Due to this, DwindleJS should only be used during the build step of the website.

### get directory()
Returns the directory set. Throws an error of no directory has been set yet.

### set directory(directory)
Sets the directory, which should be a string containing an absolute path to the directory the website is located in.

### get htmlFileExtensions()
What extensions should be considered HTML files, by default: `.htm` and `.html`.

### set htmlFileExtensions(extensions)
Sets the extensions that are considered HTML files. An error is thrown if the extensions are not an array.

### get jsFileExtensions()
See `get htmlFileExtensions()`.

### set jsFileExtensions(extensions)
See `set htmlFileExtensions()`. Default: `.js`.

### get cssFileExtensions()
See `get htmlFileExtensions()`.

### set cssFileExtensions(extensions)
See `set htmlFileExtensions()`. Default: `.css`.

### get removeElementQueries()
Returns the queries that will be run when removing elements.

### set removeElementQueries(array)
Sets the [Cheerio](https://npmjs.com/package/cheerio) queries that will determine which additional elements will be removed. This has no effect on the default removal of JavaScript and CSS elements. An error is thrown if the parameter is not an array.

### get ignoredFileExtensions()
Sets the list of file extensions that will be ignored. This applies to HTML, JavaScript, and CSS files. Default: `.dwindle.js`, `.dwindle.css`.

### set ignoredFileExtensions(extensions)
Sets the list of ignored file extensions. An error is thrown if this is not an array.

### get ignoreJsStartsWith()
Returns the ignored JavaScript starts with array.

### set ignoreJsStartsWith(array)
Sets the ignored JavaScript starts with array. Any script tag with an `src` attribute starting with this will be ignored. An error is thrown if this is not an array. Default: `//`.

### get ignoreCssStartsWith()
See `get ignoreJsStartsWith()`.

### set ignoreCssStartsWith(array)
See `set ignoreJsStartsWith()`.

### get ignoreJsContains()
Returns the ignored JavaScript contains array.

### set ignoreJsContains(array)
Sets the ignored JavaScript contains array. Any script tag with an `src` attribute containing this will be ignored. An error is thrown if this is not an array. Default: `://`.

### get ignoreCssContains()
See `get ignoreJsContains()`.

### set ignoreCssContains(array)
See `set ignoreJsContains()`. Default: `://`.

### get includeJs()
Returns the list of JavaScript files that will be additionally included in the output JavaScript file.

### set includeJs(array)
Sets the list of JavaScript files that will be included additionally. An error is thrown if this is not an array, or if any of the files: don't exist, aren't files, or aren't absolute.

### get includeCss()
See `get includeJs()`.

### set includeCss(array)
See `set includeJs()`.

### get includeJsPosition()
Returns whether the additional JavaScript will go before or after the JavaScript DwindleJS extracts.

### set includeJsPosition(position)
Sets the additional JavaScript position. An error is thrown if the position is not either `before` or `after`. Default: `after`.

### get includeCssPosition()
See `get includeJsPosition()`.

### set includeCssPosition(position)
See `set includeJsPosition()`. Default: `after`.

### get uglifyJsOptions()
Returns the options that will be passed to [UglifyJS](https://www.npmjs.com/package/uglify-js).

### set uglifyJsOptions(options)
Sets the options that will be passed to UglifyJS. An error is thrown if the options are not an object. Additional errors may be thrown by UglifyJS. Default: `{toplevel: false}`.

### get jsOutputFileName()
Returns the JavaScript output file name, or null if one hasn't been set yet.

### set jsOutputFileName(fileName)
Sets the JavaScript output file name. If no name is set by the time DwindleJS runs, a random one will be generated and can be retrieved with `get jsOutputFileName()` after DwindleJS has finished.

### get cssOutputFileName()
See `get jsOutputFileName()`.

### set cssOutputFileName(fileName)
See `set jsOutputFileName()`.

### run()
Runs DwindleJS and returns a Promise.

## Command Line

DwindleJS can also be used from the command line. Run `dwindle-js --help` for more information.