const path = require('path');
const fs = require('fs');

// https://stackoverflow.com/a/45130990
function getFilesInDir(dir) {
	return new Promise((resolve, reject) => {
		fs.promises.readdir(dir, { withFileTypes: true }).then(dirents => {
			Promise.all(dirents.map((dirent) => {
				const res = path.resolve(dir, dirent.name);
				return dirent.isDirectory() ? getFilesInDir(res) : res;
			})).then(files => resolve(Array.prototype.concat(...files)));
		}).catch(err => reject(err));
	});
}

function randomString(length) {
	var result = '';
	var characters = 'abcdef0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function isObject(object) {
	if (object === null) {
		return false;
	}

	return typeof object === 'object' && !Array.isArray(object);
}

module.exports.getFilesInDir = getFilesInDir;
module.exports.randomString = randomString;
module.exports.isObject = isObject;