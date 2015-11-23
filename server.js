var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

function send404 (response) {
	response.writeHead(404, { 'Content-type': 'text/plain'});
	response.write('Error 404: resoures not founf');
	response.end();
}

function sendFile (response, filePath, fileContents) {
	response.writeHead(
		200,
		{ 'content-type': mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents);
}

function serverStatic (response, cache, absPath) {
	if (cache[absPath]) {
		sendFile(response, absPath, cache[absPath])
	} else {
		fs.exists(absPath, function (exist) {
			if (exist) {
				fs.readFile(absPath, function (err, data) {
					if (err) {
						send404(response)
					} else {
						cache[absPath];
						sendFile(response, absPath, data);
					}
				});
			} else {
				send404(response);
			}
		})
	}
}

var server = http.createServer(function (request, response) {
	var filePath = false;
	if (request.url == '/') {
		filePath = 'public/index.html'
	} else {
		filePath = 'public' + request.url;
	}
	var absPath = './' + filePath;
	serverStatic(response, cache, absPath);
})

server.listen(3000, function () {
	console.log("Server listening on port 3000.");
})