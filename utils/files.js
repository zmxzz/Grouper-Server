const fileStream = require('fs');
const config = require('../config/filebase');
const ftp = require('ftp');

module.exports.getFileFromFileServer = function(filename) {
    // Returns a promise when retrieve file
    return getFile(filename);
}

module.exports.putFileToFileServer = function(filename) {
    return putFile(filename);
}

// function putFile(filename) {
//     let ftpClient = new Client();
//     ftpClient.on('ready', function() {
//         ftpClient.put('./temp/' + filename, '.', function(err) {
//             if (err) {
//                 console.log(err);
//             }
//             ftpClient.end();
//         });
//     });
//     ftpClient.connect();
// }

// Check if the file is cached or not, if no, return a promise of retreiving it from the file server
function getFile(filename) {
    let cacheName = getCacheName(filename); // Position of the file if it's cached
    fileStream.access(cacheName, fileStream.F_OK, (error) => {
        if (error) {
            // Error means the file is not found
            return getFileFromBase(filename, cacheName);
        }
        // File exists alreay, resolve
        return new Promise((resolve, reject) => { resolve(); });
    });
}

// Get File from cloud
function getFileFromBase(filename, cacheName) {
    // Create a new ftp client and write files into cache
    const ftpClient = new ftp();
    let getFileFromBase = new Promise((resolve, reject) => {
        ftpClient.on('ready', () => {
            ftpClient.get(filename, (error, stream) => {
                if (error) {
                    console.log(error);
                    reject(error);
                    ftpClient.end();
                }
                else {
                    stream.pipe(fileStream.createWriteStream(cacheName));
                    ftpClient.end();
                    resolve();
                }
            });
        });
        connect(ftpClient);
    });
    return getFileFromBase;
}

// Connect ftpclient to file server
function connect(ftpClient) {
    ftpClient.connect({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password
    });=
}

// reformat filename into cached filename
function getCacheName(filename) {
    return './cache/' + filename.substring(1).split('/').join('-');
}

// generate filename for the given file
module.exports.generateFilename() {
    let date = new Date();
    let filenameArr = [];
    filenameArr.push('.');
    filenameArr.push(date.getFullYear());
    filenameArr.push((date.getMonth() + 1));
    filenameArr.push(date.getDate());
    filenameArr.push(date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds() + '-' + date.getMilliseconds());
    console.log(filenameArr.join('/'));
    return filenameArr.join('/');
}

generateFilename();