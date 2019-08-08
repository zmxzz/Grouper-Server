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
        responseUtil.contentFound(response, fs.createReadStream(request.query['filename']));
    } catch (error) {
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