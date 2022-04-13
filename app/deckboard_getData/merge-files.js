
const jsonConcat = require('json-concat');
const fs = require('fs');
var isEqual = require('lodash.isequal');
var childProcess = require('child_process');
const path = require('path');

const theDirectory = `${__dirname}/data`; 
const finalDir = `${__dirname}/finalData`

if (!fs.existsSync(theDirectory)){
    fs.mkdirSync(theDirectory);
}

if (!fs.existsSync(finalDir)){
    fs.mkdirSync(finalDir);
}


function runScript(scriptPath, callback) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}

// Now we can run a script and invoke a callback when complete, e.g.
runScript(__dirname, function (err) {
    if (err) throw err;
    console.log('finished running index.js');
	const files = [];

	fs.readdirSync(theDirectory).forEach((file) => {
	files.push(file);
	})

	let finalArray = {};
	finalArray.buttons = [];

	files.forEach(element =>{
		fs.readFile(`${theDirectory}/${element}`, (err, data) => {
			var array = JSON.parse(data);
			array["buttons"].forEach(button =>{
				if(!finalArray.buttons.some(item => isEqual(item, button))){
					finalArray.buttons.push(button);
					console.log(finalArray.buttons);
					fs.writeFileSync(`${finalDir}/finalButton.json`, JSON.stringify(finalArray, null, 4));
				}
					
				
			})
			
		});
		console.log(finalArray.buttons);
	});

	fs.readdir(theDirectory, (err, files) => {
	if (err) throw err;

	for (const file of files) {
		fs.unlink(path.join(theDirectory, file), err => {
		if (err) throw err;
		});
		}
	});
});
