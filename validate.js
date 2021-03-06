var fs = require('fs'),
	pkg = require('./bower.json'),
	version = pkg.version,
	deps = Object.keys(pkg.dependencies),
	errors = [],
	hashValidate = function(hash) {
		var versionMatch = hash.match(/cdn#([^-]*)/);
		if (versionMatch[1] !== version) {
			errors.push("Error: Version mismatch in bower.json for " + dep + ". Expecting: " + version + ". Found: " + versionMatch[1]);
		}
	},
	fileValidate = function(file, data) {
		var versionMatch = data.match(/\* v?([^ ]*) \-/);
		if (versionMatch[1] !== version) {
			errors.push("Error: Version mismatch in file  " + file + ". Expecting: " + version + ". Found: " + versionMatch[1]);
		}
	},
	dep, depHash, file;

for(var d = 0; d < deps.length; d++){
	dep = deps[d];

	//Validate the bower dependencies
	depHash = pkg.dependencies[dep]
	hashValidate(depHash);

	//Validate files
	switch (dep){
		case "wet-boew":
			file = 'wet-boew/wet-boew/js/wet-boew.min.js'
			break;
		default:
			file = 'wet-boew/' + dep + '/css/theme.min.css', 'utf8'
	}

	fs.readFile(file, 'utf8', (function(file){
		return function(err, data) {
			if (err) throw err;
			fileValidate(file, data)
		}
	})(file));
}

process.on('exit', function(code){
	if (errors.length > 0) {
		for (var e = 0; e < errors.length; e++){
			console.error(errors[e]);
		}
		process.exit(1);
	}
	if (code === 0) {
		console.log("Success!!");
	}
});
