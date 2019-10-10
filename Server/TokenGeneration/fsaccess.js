const fs = require('fs');

//Read Data from file
exports.ReadDataFile = (params) => {
	let promise = new Promise((resolve, reject) => {
		try {
			fs.readFile(params.path, (err, data) => {
				if (err) {
					resolve({});
					console.log("Read Data File Error: " + err + "For Inputs" + JSON.stringify(params));
				}
				let result = {};
				try {
					result = JSON.parse(data);
				}
				catch (excp) {
					result = {};
				}
				resolve({ result });
			});
		}
		catch (exception) {
			resolve({});
			console.log("Read Data File exception: " + exception + "For Inputs" + JSON.stringify(params));
		}
	});
	return promise;
};

//Write Data to file
exports.WriteDataFile = (params) => {
	let promise = new Promise((resolve, reject) => {
		try {
			resolve(true);
			let data = JSON.stringify(params.data, null, 2);
			fs.writeFile(params.path, data, (err) => {
				if (err) {
					console.log("Write File Error: " + err + "For Inputs" + JSON.stringify(params));
				}
				console.log('Data written to file' + params.path);
			});
		}
		catch (exception) {
			resolve(false);
			console.log("Data written to file exception: " + exception + "For Inputs" + JSON.stringify(params));
		}
	});
	return promise;
};
