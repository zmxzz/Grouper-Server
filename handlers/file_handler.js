const fs = require('fs');
const mkdirp = require('mkdirp');
const files = require('../utils/files');
const responseUtil = require('../utils/response');

module.exports.uploadFile = async function(request, response) {
    let date = new Date();
    let suffix = files.getSuffix(request.file.originalname);
    let directory = '../files/' + files.generateDirectory(date);
    let filename = directory + '/' + files.generateFilename(date) + '.' + suffix;
    try {
        await createDirectory(directory);
        await writeFile(filename, request.file.buffer);
        responseUtil.contentCreated(response, filename);
    } catch (error) {
        responseUtil.badRequest(response, error);
    }
};

module.exports.downloadFile = function(request, response) {
    try {
        let filename = request.query['filename'];
        let dirs = filename.split('.');
        response.writeHead(200, {'Content-Type': 'image/' + dirs[dirs.length - 1]});
        let readStream = fs.createReadStream(filename);
        readStream.pipe(response); 
    } catch (error) {
        console.log(error);
        responseUtil.badRequest(response, error);
    }
};

module.exports.deleteFile = function(request, response) {
}

function writeFile(filename, buffer) {
    let writeFile = new Promise((resolve, reject) => {
        fs.writeFile(filename, buffer, (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
    return writeFile;
}

function createDirectory(directory) {
    let createDirectory = new Promise((resolve, reject) => {
        mkdirp(directory, function (error) {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
    return createDirectory;
}