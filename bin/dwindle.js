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
		'output-dir': {
			description: 'the directory DwindleJS will output to',
			type: 'string',
			nargs: 1
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
		replacer: {
			description: 'a string or regex that will be replaced, use the replacer-regex flag to use regex',
			type: 'string',
			nargs: 1
		},
		'replacer-regex': {
			description: 'whether to parse the replacer as regex',
			type: 'boolean'
		},
		'replace-with': {
			description: 'a string or regex that the replacer will be replaced with, use the replace-with-regex flag to use regex',
			type: 'string',
			nargs: 1
		},
		'replace-with-regex': {
			description: 'whether to parse the replacer as regex',
			type: 'boolean'
		},
		'replacer-scope': {
			description: 'what elements should the replacer run on',
			type: 'string',
			nargs: 1
		},
		'replacer-attributes': {
			description: 'what attributes should the replacer run on',
			type: 'array'
		},
		'replacer-extensions': {
			description: 'what extensions should the replacer run on',
			type: 'array'
		},
		'replacer-ignored-extensions': {
			description: 'what extensions should the replacer ignore',
			type: 'array'
		},
		'replacer-ignore-starts-with': {
			description: 'attribute values starting with any of these will be ignored',
			type: 'array'
		},
		'replacer-ignore-contains': {
			description: 'attribute values containing any of these will be ignored',
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
		'dwindle-js-position': {
			description: 'whether the DwindleJS JavaScript file should go before or after other script tags with an src attribute',
			type: 'string',
			nargs: 1
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
		'dwindle-css-position': {
			description: 'whether the DwindleJS CSS file should go before or after other script tags with an src attribute',
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

	if (args.replacer) {
		if (!args['replace-with']) {
			console.error('replace-with must be set to use the replacer option');
			process.exit(1);
		}

		if (args['replacer-regex']) {
			var tmpReplacerRegex = new RegExp(args.replacer);
			console.log(`Using replacer regex: ${tmpReplacerRegex}`);
			dwindle.replacer = tmpReplacerRegex;
		} else {
			dwindle.replacer = args.replacer;
		}
	}

	if (args.replaceWith) {
		if (!args.replacer) {
			console.error('replacer must be set to use the replace-with option');
			process.exit(1);
		}

		if (args['replace-with-regex']) {
			var tmpReplaceWithRegex = new RegExp(args.replaceWith);
			console.log(`Using replace-with regex: ${tmpReplaceWithRegex}`);
			dwindle.replaceWith = tmpReplaceWithRegex;
		} else {
			dwindle.replaceWith = args.replaceWith;
		}
	}

	if (args['replacer-scope']) {
		if (!['dwindle', 'local'].includes(args['replacer-scope'])) {
			console.error('Valid options for replacer-scope are: dwindle, local');
			process.exit(1);
		}

		dwindle.replacerScope = args['replacer-scope'];
	}

	if (args['replacer-attributes']) {
		if (args['replacer-attributes'].length === 0) {
			console.error('At least one attribute must be provided for replacer-attributes');
			process.exit(1);
		}

		dwindle.replacerAttributes = args['replacer-attributes'];
	}

	if (args['replacer-extensions']) {
		if (args['replacer-extensions'].length === 0) {
			console.error('At least one extension must be provided for replacer-extensions');
			process.exit(1);
		}

		dwindle.replacerExtensions = args['replacer-extensions'];
	}

	if (args['replacer-ignored-extensions']) {
		if (args['replacer-ignored-extensions'].length === 0) {
			console.error('At least one ignored extension must be provided for replacer-ignored-extensions');
			process.exit(1);
		}

		dwindle.replacerIgnoredExtensions = args['replacer-ignored-extensions'];
	}

	if (args['replacer-ignore-starts-with']) {
		if (args['replacer-ignore-starts-with'].length === 0) {
			console.error('At least one replacer-ignore-starts-with must be provided');
			process.exit(1);
		}

		dwindle.replacerIgnoreStartsWith = args['replacer-ignore-starts-with'];
	}

	if (args['replacer-ignore-contains']) {
		if (args['replacer-ignore-contains'].length === 0) {
			console.error('At least one replacer-ignore-contains must be provided');
			process.exit(1);
		}

		dwindle.replacerIgnoreContains = args['replacer-ignore-contains'];
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

	if (args['dwindle-js-position']) {
		if (!['before', 'after'].includes(args['dwindle-js-position'])) {
			console.error('The valid options for dwindle-js-position are: before, after');
			process.exit(1);
		}

		dwindle.dwindleJsPosition = args['dwindle-js-position'];
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

	if (args['dwindle-css-position']) {
		if (!['before', 'after'].includes(args['dwindle-css-position'])) {
			console.error('The valid options for dwindle-css-position are: before, after');
			process.exit(1);
		}

		dwindle.dwindleCssPosition = args['dwindle-css-position'];
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

	// This needs to be after the input directory is set
	if (args['output-dir']) {
		dwindle.outputDirectory = args['output-dir'];
	}

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