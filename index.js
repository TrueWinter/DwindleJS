const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const UglifyJS = require('uglify-js');
const CleanCSS = require('clean-css');
const util = require('./util.js');

class DwindleJS {
	#htmlFileExtensions = ['.htm', '.html'];
	#jsFileExtensions = ['.js'];
	#cssFileExtensions = ['.css'];
	#removeElementQueries = [];
	#ignoredFileExtensions = ['.dwindle.js', '.dwindle.css'];
	#ignoreJsStartsWith = ['//'];
	#ignoreJsContains = ['://'];
	#ignoreCssStartsWith = ['//'];
	#ignoreCssContains = ['://'];
	#includeJs = [];
	#includeCss = [];
	#dwindleJsPosition = 'before';
	#dwindleCssPosition = 'before';
	#includeJsPosition = 'after';
	#includeCssPosition = 'after';
	#uglifyJsOptions = {
		toplevel: false
	};
	#directory = null;
	#jsOutputFileName = null;
	#cssOutputFileName = null;

	get directory() {
		this.#checkDirectoryIsNotNull();
		return this.#directory;
	}

	set directory(directory) {
		if (!directory) {
			throw new Error('Directory is required');
		}

		if (typeof directory !== 'string') {
			throw new TypeError('Directory must be a string');
		}

		if (!fs.existsSync(directory)) {
			throw new Error('Directory must exist');
		}

		if (!fs.lstatSync(directory).isDirectory()) {
			throw new Error('Directory must be a directory');
		}

		this.#directory = directory;
	}

	get htmlFileExtensions() {
		return this.#htmlFileExtensions;
	}

	set htmlFileExtensions(extensions) {
		if (!Array.isArray(extensions)) {
			throw new TypeError('Extensions must be in an array');
		}

		this.#htmlFileExtensions = extensions;
	}

	get jsFileExtensions() {
		return this.#jsFileExtensions;
	}

	set jsFileExtensions(extensions) {
		if (!Array.isArray(extensions)) {
			throw new TypeError('Extensions must be in an array');
		}

		this.#jsFileExtensions = extensions;
	}

	get cssFileExtensions() {
		return this.#cssFileExtensions;
	}

	set cssFileExtensions(extensions) {
		if (!Array.isArray(extensions)) {
			throw new TypeError('Extensions must be in an array');
		}

		this.#cssFileExtensions = extensions;
	}

	get removeElementQueries() {
		return this.#removeElementQueries;
	}

	set removeElementQueries(array) {
		if (!Array.isArray(array)) {
			throw new TypeError('Queries must be in an array');
		}

		this.#removeElementQueries = array;
	}

	get ignoredFileExtensions() {
		return this.#ignoredFileExtensions;
	}

	set ignoredFileExtensions(extensions) {
		if (!Array.isArray(extensions)) {
			throw new TypeError('Extensions must be in an array');
		}

		this.#ignoredFileExtensions = extensions;
	}

	get ignoreJsStartsWith() {
		return this.#ignoreJsStartsWith;
	}

	set ignoreJsStartsWith(array) {
		if (!Array.isArray(array)) {
			throw new TypeError('An array must be provided');
		}

		this.#ignoreJsContains = array;
	}

	get ignoreCssStartsWith() {
		return this.#ignoreCssStartsWith;
	}

	set ignoreCssStartsWith(array) {
		if (!Array.isArray(array)) {
			throw new TypeError('An array must be provided');
		}

		this.#ignoreCssContains = array;
	}

	get ignoreJsContains() {
		return this.#ignoreJsContains;
	}

	set ignoreJsContains(array) {
		if (!Array.isArray(array)) {
			throw new TypeError('An array must be provided');
		}

		this.#ignoreJsContains = array;
	}

	get ignoreCssContains() {
		return this.#ignoreCssContains;
	}

	set ignoreCssContains(array) {
		if (!Array.isArray(array)) {
			throw new TypeError('An array must be provided');
		}

		this.#ignoreCssContains = array;
	}

	get includeJs() {
		return this.#includeJs;
	}

	set includeJs(array) {
		if (!Array.isArray(array)) {
			throw new TypeError('An array must be provided');
		}

		for (var i = 0; i < array.length; i++) {
			if (!fs.existsSync(array[i])) {
				throw new Error('JavaScript file to be included does not exist');
			}

			if (!fs.lstatSync(array[i]).isFile()) {
				throw new Error('JavaScript file to be included must be a file');
			}

			if (!path.isAbsolute(array[i])) {
				throw new Error('JavaScript file to be included must be absolute');
			}

		}

		this.#includeJs = array;
	}

	get includeCss() {
		return this.#includeCss;
	}

	set includeCss(array) {
		if (!Array.isArray(array)) {
			throw new TypeError('An array must be provided');
		}

		for (var i = 0; i < array.length; i++) {
			if (!fs.existsSync(array[i])) {
				throw new Error('CSS file to be included does not exist');
			}

			if (!fs.lstatSync(array[i]).isFile()) {
				throw new Error('CSS file to be included must be a file');
			}

			if (!path.isAbsolute(array[i])) {
				throw new Error('CSS file to be included must be absolute');
			}

		}

		this.#includeCss = array;
	}

	get dwindleJsPosition() {
		return this.#dwindleJsPosition;
	}

	set dwindleJsPosition(position) {
		if (!['before', 'after'].includes(position)) {
			throw new Error('Invalid option. Valid options are: before, after');
		}

		this.#dwindleJsPosition = position;
	}

	get includeJsPosition() {
		return this.#includeJsPosition;
	}

	set includeJsPosition(position) {
		if (!['before', 'after'].includes(position)) {
			throw new Error('Invalid option. Valid options are: before, after');
		}

		this.#includeJsPosition = position;
	}

	get dwindleCssPosition() {
		return this.#dwindleCssPosition;
	}

	set dwindleCssPosition(position) {
		if (!['before', 'after'].includes(position)) {
			throw new Error('Invalid option. Valid options are: before, after');
		}

		this.#dwindleCssPosition = position;
	}

	get includeCssPosition() {
		return this.#includeCssPosition;
	}

	set includeCssPosition(position) {
		if (!['before', 'after'].includes(position)) {
			throw new Error('Invalid option. Valid options are: before, after');
		}

		this.#includeCssPosition = position;
	}

	get uglifyJsOptions() {
		return this.#uglifyJsOptions;
	}

	set uglifyJsOptions(options) {
		if (!util.isObject(options)) {
			throw new TypeError('Options must be an object');
		}

		this.#uglifyJsOptions = options;
	}

	get jsOutputFileName() {
		return this.#jsOutputFileName;
	}

	set jsOutputFileName(fileName) {
		if (typeof fileName !== 'string') {
			throw new TypeError('File name must be a string');
		}

		this.#jsOutputFileName = fileName;
	}

	get cssOutputFileName() {
		return this.#cssOutputFileName;
	}

	set cssOutputFileName(fileName) {
		if (typeof fileName !== 'string') {
			throw new TypeError('File name must be a string');
		}

		this.#cssOutputFileName = fileName;
	}

	run() {
		this.#checkDirectoryIsNotNull();
		return new Promise((resolve, reject) => {
			util.getFilesInDir(this.#directory).then(allFiles => {
				var filesToHandle = [];

				var scripts = new Map();
				var includeScripts = new Map();
				var finalScripts = new Map();

				var styles = new Map();
				var includeStyles = new Map();
				var finalStyles = new Map();

				for (var i = 0; i < allFiles.length; i++) {
					if (this.#hasSupportedHtmlExtension(allFiles[i]) && !this.#hasIgnoredExtension(allFiles[i])) {
						let thisFile = allFiles[i];
						filesToHandle.push(thisFile);

						this.#extractScripts(thisFile).forEach(v => {
							var p;
							if (v.startsWith('/')) {
								p = path.join(this.#directory, path.sep, v);
							} else {
								p = path.join(thisFile, '..', path.sep, v);
							}

							if (!scripts.has(v) && !this.#hasIgnoredExtension(p)) {
								if (fs.existsSync(p)) {
									scripts.set(p, this.#getFileContent(p));
								}
							}
						});

						this.#extractStyles(thisFile).forEach(v => {
							var p;
							if (v.startsWith('/')) {
								p = path.join(this.#directory, path.sep, v);
							} else {
								p = path.join(thisFile, '..', path.sep, v);
							}

							if (!styles.has(v) && !this.#hasIgnoredExtension(p)) {
								if (fs.existsSync(p)) {
									styles.set(p, this.#getFileContent(p));
								}
							}
						});
					}
				}

				for (var j = 0; j < this.#includeJs.length; j++) {
					includeScripts.set(this.#includeJs[j], this.#getFileContent(this.#includeJs[j]));
				}

				for (var k = 0; k < this.#includeCss.length; k++) {
					includeStyles.set(this.#includeCss[k], this.#getFileContent(this.#includeCss[k]));
				}

				if (this.#includeJsPosition === 'before') {
					finalScripts = new Map([...includeScripts, ...scripts]);
				} else {
					finalScripts = new Map([...scripts, ...includeScripts]);
				}

				if (this.#includeCssPosition === 'before') {
					finalStyles = new Map([...includeStyles, ...styles]);
				} else {
					finalStyles = new Map([...styles, ...includeStyles]);
				}

				var jsCode = Object.fromEntries(finalScripts.entries());
				var jsResult = UglifyJS.minify(jsCode, this.#uglifyJsOptions);

				var cssCode = Array.from(finalStyles.values()).join('\n');
				var cssResult = new CleanCSS().minify(cssCode);

				this.#setOutputJsFileNameIfNull();
				this.#setOutputCssFileNameIfNull();
				fs.writeFileSync(path.join(this.#directory, path.sep, this.#jsOutputFileName), jsResult.code, 'utf8');
				fs.writeFileSync(path.join(this.#directory, path.sep, this.#cssOutputFileName), cssResult.styles, 'utf8');

				for (var l = 0; l < filesToHandle.length; l++) {
					this.#replaceElements(filesToHandle[l]);
				}

				resolve({
					htmlFiles: filesToHandle.length,
					jsFiles: scripts.size,
					includedJsFiles: includeScripts.size,
					cssFiles: styles.size,
					includedCssFiles: includeStyles.size,
					removedElements: this.#removeElementQueries.length
				});
			}).catch(err => reject(err));
		});
	}

	#extractScripts(file) {
		var scripts = new Set();
		var html = this.#getFileContent(file);

		var $ = cheerio.load(html);

		$('script[src]').each((_, script) => {
			// Just incase there's an empty src attribute
			if (script.attribs.src &&
				!this.#fileNameStartsWithIgnored(script.attribs.src, this.#ignoreJsStartsWith) &&
				!this.#fileNameContainsIgnored(script.attribs.src, this.#ignoreJsContains)) {
				scripts.add(script.attribs.src);
			}
		});

		return scripts;
	}

	#extractStyles(file) {
		var styles = new Set();
		var html = this.#getFileContent(file);

		var $ = cheerio.load(html);

		$('link[rel="stylesheet"][href]').each((_, style) => {
			// Just incase there's an empty href attribute
			if (style.attribs.href &&
				!this.#fileNameStartsWithIgnored(style.attribs.href, this.#ignoreCssStartsWith) &&
				!this.#fileNameContainsIgnored(style.attribs.href, this.#ignoreCssContains)) {
				styles.add(style.attribs.href);
			}
		});

		return styles;
	}

	#replaceElements(file) {
		var html = this.#getFileContent(file);
		var $ = cheerio.load(html);

		for (var i = 0; i < this.#removeElementQueries.length; i++) {
			$(this.#removeElementQueries[i]).remove();
		}

		var scripts = $('script[src]');
		if (scripts.length !== 0) {
			if (this.#dwindleJsPosition === 'before') {
				scripts.first().before(`<script src="${this.#getRelativeDirectory(file)}${this.#jsOutputFileName}">`);
			} else {
				scripts.last().before(`<script src="${this.#getRelativeDirectory(file)}${this.#jsOutputFileName}">`);
			}

			scripts.each((_, e) => {
				if (e.attribs.src !== this.#jsOutputFileName) {
					if (!this.#fileNameStartsWithIgnored(e.attribs.src, this.#ignoreJsStartsWith) &&
							!this.#fileNameContainsIgnored(e.attribs.src, this.#ignoreJsContains) &&
							!this.#hasIgnoredExtension(e.attribs.src)) {
						$(e).remove();
					}
				}
			});
		}

		var styles = $('link[rel="stylesheet"][href]');
		if (styles.length !== 0) {
			if (this.#dwindleCssPosition === 'before') {
				styles.first().before(`<link rel="stylesheet" href="${this.#getRelativeDirectory(file)}${this.#cssOutputFileName}">`);
			} else {
				styles.last().before(`<link rel="stylesheet" href="${this.#getRelativeDirectory(file)}${this.#cssOutputFileName}">`);
			}

			styles.each((_, e) => {
				if (e.attribs.href !== this.#cssOutputFileName) {
					if (!this.#fileNameStartsWithIgnored(e.attribs.href, this.#ignoreCssStartsWith) &&
							!this.#fileNameContainsIgnored(e.attribs.href, this.#ignoreCssContains) &&
							!this.#hasIgnoredExtension(e.attribs.href)) {
						$(e).remove();
					}
				}
			});
		}

		fs.writeFileSync(file, $.html(), 'utf8');
	}

	#getRelativeDirectory(file) {
		var relative = '';
		var stat = fs.lstatSync(file);
		var regex = new RegExp(`^\\${path.sep}`);
		var f = file.replace(this.#directory, '').replace(regex, '').split(path.sep);

		if (stat.isDirectory) {
			// Remove just the directory
			f = f.slice(0, -1);
		} else if (stat.isFile()) {
			// Remove the directory and the file
			f = f.slice(0, -2);
		} else {
			// If a non-existent file somehow ends up here, return
			return;
		}

		for (var i = 0; i < f.length; i++) {
			relative += '../';
		}

		return relative;
	}

	#getFileContent(file) {
		return fs.readFileSync(file, {
			encoding: 'utf8',
			flag: 'r'
		});
	}

	#checkDirectoryIsNotNull() {
		if (!this.#directory) {
			throw new Error('The directory must be set first');
		}
	}

	#hasSupportedHtmlExtension(fileName) {
		return this.#fileNameContainsExtensionInArray(fileName, this.#htmlFileExtensions);
	}

	#hasSupportedJsExtension(fileName) {
		return this.#fileNameContainsExtensionInArray(fileName, this.#jsFileExtensions);
	}

	#hasIgnoredExtension(fileName) {
		return this.#fileNameContainsExtensionInArray(fileName, this.#ignoredFileExtensions);
	}

	#fileNameContainsExtensionInArray(fileName, array) {
		// This is required to support files with extensions such as .fd1a8b.js
		for (var i = 0; i < array.length; i++) {
			if (fileName.endsWith(array[i])) {
				return true;
			}
		}

		return false;
	}

	#fileNameStartsWithIgnored(fileName, array) {
		for (var i = 0; i < array.length; i++) {
			if (fileName.startsWith(array[i])) {
				return true;
			}
		}

		return false;
	}

	#fileNameContainsIgnored(fileName, array) {
		for (var i = 0; i < array.length; i++) {
			if (fileName.includes(array[i])) {
				return true;
			}
		}

		return false;
	}

	#setOutputJsFileNameIfNull() {
		if (this.#jsOutputFileName !== null) {
			return;
		}

		this.#jsOutputFileName = `all-${util.randomString(8)}.dwindle.js`;
	}

	#setOutputCssFileNameIfNull() {
		if (this.#cssOutputFileName !== null) {
			return;
		}

		this.#cssOutputFileName = `all-${util.randomString(8)}.dwindle.css`;
	}

	static get _version() {
		return require('./package.json').version;
	}
}

module.exports = DwindleJS;