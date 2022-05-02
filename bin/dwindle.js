#!/usr/bin/env node
const DwindleJS = require('../index.js');
const colors = require('colors/safe');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

console.log(colors.magenta(`DwindleJS v${DwindleJS._version} by TrueWinter`));
yargs(hideBin(process.argv))
	.command('$0', 'Run DwindleJS',
		// builder function is not used
		// eslint-disable-next-line no-empty-function
		() => {},
		(args) => {
			try {
				run(args);
			} catch (err) {
				console.error('An error occurred: ', err);
				process.exit(1);
			}
		}
	)
	.options({
		dir: {
			description: 'the directory the website is in',
			type: 'string',
			nargs: 1,
			demandOption: true
		},
		'html-file-extensions': {
			description: 'a list of HTML file extensions',
			type: 'array'
		},
		'js-file-extensions': {
			description: 'a list of JavaScript file extensions',
			type: 'array'
		},
		'css-file-extensions': {
			description: 'a list of CSS file extensions',
			type: 'array'
		},
		'remove-element-queries': {
			description: 'a Cheerio query for elements to remove from the HTML',
			type: 'array'
		},
		'ignored-file-extensions': {
			description: 'a list of ignored file extensions',
			type: 'array'
		},
		'ignored-js-starts-with': {
			description: 'if a script tag\' src attribute starts with one of these, it will be ignored',
			type: 'array'
		},
		'ignored-js-contains': {
			description: 'if a script tag\' src attribute contains one of these, it will be ignored',
			type: 'array'
		},
		'ignored-css-starts-with': {
			description: 'if a CSS tag\' href attribute starts with one of these, it will be ignored',
			type: 'array'
		},
		'ignored-css-contains': {
			description: 'if a CSS tag\' href attribute contains one of these, it will be ignored',
			type: 'array'
		},
		'include-js': {
			description: 'if you want to add JavaScript to the output file that isn\'t already added by DwindleJS, add the absolute path here',
			type: 'array'
		},
		'include-js-position': {
			description: 'whether the included JavaScript should go before or after the other JavaScript',
			type: 'string',
			nargs: 1
		},
		'include-css': {
			description: 'if you want to add CSS to the output file that isn\'t already added by DwindleJS, add the absolute path here',
			type: 'array'
		},
		'include-css-position': {
			description: 'whether the included CSS should go before or after the other CSS',
			type: 'string',
			nargs: 1
		},
		'output-file-name': {
			description: 'the file name that DwindleJS will save the JavaScript to',
			type: 'string',
			nargs: 1
		},
		'uglifyjs-options': {
			description: 'these options will be passed to UglifyJS',
			type: 'string',
			nargs: 1
		}
	})
	.parse();

function run(args) {
	const dwindle = new DwindleJS();

	if (args['html-file-extensions']) {
		if (args['html-file-extensions'].length === 0) {
			console.error('At least one HTML extension must be provided');
			process.exit(1);
		} else {
			dwindle.htmlFileExtensions = args['html-file-extensions'];
		}
	}

	if (args['js-file-extensions']) {
		if (args['js-file-extensions'].length === 0) {
			console.error('At least one JavaScript extension must be provided');
			process.exit(1);
		} else {
			dwindle.jsFileExtensions = args['js-file-extensions'];
		}
	}

	if (args['css-file-extensions']) {
		if (args['css-file-extensions'].length === 0) {
			console.error('At least one CSS extension must be provided');
			process.exit(1);
		} else {
			dwindle.cssFileExtensions = args['css-file-extensions'];
		}
	}

	if (args['remove-element-queries']) {
		if (args['remove-element-queries'].length === 0) {
			console.log('At least one removal query must be set');
			process.exit(1);
		} else {
			dwindle.removeElementQueries = args['remove-element-queries'];
		}
	}

	if (args['ignored-file-extensions']) {
		if (args['ignored-file-extensions'].length === 0) {
			console.error('At least one ignored extension must be provided');
			process.exit(1);
		} else {
			dwindle.ignoredFileExtensions = args['ignored-file-extensions'];
		}
	}

	if (args['ignored-js-starts-with']) {
		if (args['ignored-js-starts-with'].length === 0) {
			console.error('At least one ignored starts with value must be provided');
			process.exit(1);
		} else {
			dwindle.ignoreJsStartsWith = args['ignored-js-starts-with'];
		}
	}

	if (args['ignored-js-contains']) {
		if (args['ignored-js-contains'].length === 0) {
			console.error('At least one ignored contains must be provided');
			process.exit(1);
		} else {
			dwindle.ignoreJsContains = args['ignored-js-contains'];
		}
	}

	if (args['ignored-css-starts-with']) {
		if (args['ignored-css-starts-with'].length === 0) {
			console.error('At least one ignored starts with value must be provided');
			process.exit(1);
		} else {
			dwindle.ignoreCssStartsWith = args['ignored-css-starts-with'];
		}
	}

	if (args['ignored-css-contains']) {
		if (args['ignored-css-contains'].length === 0) {
			console.error('At least one ignored contains must be provided');
			process.exit(1);
		} else {
			dwindle.ignoreCssContains = args['ignored-css-contains'];
		}
	}

	if (args['include-js']) {
		if (args['include-js'].length === 0) {
			console.error('The include-js option requires at least one file');
			process.exit(1);
		} else {
			dwindle.includeJs = args['include-js'];
		}
	}

	if (args['include-js-position']) {
		if (!['before', 'after'].includes(args['include-js-position'])) {
			console.error('The valid options for include-js-position are: before, after');
			process.exit(1);
		}

		if (!args['include-js']) {
			console.error('The include-js option is required when setting the position');
			process.exit(1);
		}

		dwindle.includeJsPosition = args['include-js-position'];
	}

	if (args['include-css']) {
		if (args['include-css'].length === 0) {
			console.error('The include-css option requires at least one file');
			process.exit(1);
		} else {
			dwindle.includeCss = args['include-css'];
		}
	}

	if (args['include-css-position']) {
		if (!['before', 'after'].includes(args['include-css-position'])) {
			console.error('The valid options for include-css-position are: before, after');
			process.exit(1);
		}

		if (!args['include-css']) {
			console.error('The include-css option is required when setting the position');
			process.exit(1);
		}

		dwindle.includeCssPosition = args['include-css-position'];
	}

	if (args['uglifyjs-options']) {
		try {
			dwindle.uglifyJsOptions = JSON.parse(args['uglifyjs-options']);
		} catch (err) {
			console.error('Failed to setting UglifyJS options', err);
			process.exit(1);
		}
	}

	dwindle.directory = args.dir;
	dwindle.run().then(result => {
		console.log(colors.green(`Looked through ${result.htmlFiles} HTML files. Found ${result.jsFiles} unique JavaScript files used, found ${result.cssFiles} unique CSS files used.`));
		var opt = [];
		if (result.includedJsFiles !== 0) {
			opt.push(`Included ${result.includedJsFiles} JavaScript files.`);
		}
		if (result.includedCssFiles !== 0) {
			opt.push(`Included ${result.includedCssFile} CSS files.`);
		}
		if (result.removedElements !== 0) {
			opt.push(`Ran ${result.removedElements} remove element queries.`);
		}
		if (opt.length !== 0) {
			console.log(colors.green(opt.join(' ')));
		}
		console.log(colors.green(`Saved JavaScript to ${dwindle.jsOutputFileName}, CSS to ${dwindle.cssOutputFileName} and replaced script/link tags in HTML files.`));
	}).catch(err => {
		console.error('Failed to run DwindleJS: ', err);
	});
}