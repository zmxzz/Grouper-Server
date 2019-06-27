const fileStream = require('fs');
const config = require('../config/filebase');
const ftp = require('ftp');

module.exports.putFileToFileServer = function(fileBuffer, directory, filename) {
    // Generate folder and put file
    let putFileToFileServer = new Promise((resolve, reject) => {
        generateFolder(directory)
        .then(() => {
            return putFile(fileBuffer, directory + '/' + filename);
        })
        .then(() => {
            resolve(); 
        })
        .catch((error) => { reject(error); });
    });
    return putFileToFileServer;
}

module.exports.getFileFromFileServer = function(filename) {
    // Returns a promise when retrieve file
    let getFileFromFileServer = new Promise((resolve, reject) => {
        let cloudName = getCloudName(filename); // Location of file on cloud
        let cacheName = getCacheName(filename); // Loccation of the file if it's cached
        fileStream.access(cacheName, fileStream.F_OK, (error) => {
            if (error) {
                // Error means the file is not found
                getFileFromBase(cloudName, cacheName)
                .then(resolve, reject);
            }
            // File exists alreay, resolve
            else {
                console.log('File Exists');
                resolve(cacheName);
            }
        });
    });
    return getFileFromFileServer;
}

module.exports.deleteFile = function(filename) {
    let deleteFile = new Promise((resolve, reject) => {
        deleteLocalFile(filename)
        .then(() => { return deleteServerFile(filename); })
        .then(resolve)
        .catch(reject);
    });
    return deleteFile;
}

// generate file directory for the given file
module.exports.generateDirectory = function(date) {
    let filenameArr = [];
    filenameArr.push(date.getFullYear());
    filenameArr.push((date.getMonth() + 1));
    filenameArr.push(date.getDate());
    return filenameArr.join('/');
};

// generate filename for the given file
module.exports.generateFilename = function(date) {
    return date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds() + '-' + date.getMilliseconds();
};

// get files suffix
// parse suffix of the filename
module.exports.getSuffix = function(filename) {
    let parts = filename.split('.');
    return parts.pop();
};

// Helper Function for deleteFileFromServer
function deleteLocalFile(filename) {
    let deleteLocalFile = new Promise((resolve, reject) => {
        let cacheName = getCacheName(filename);
        fileStream.unlink(cacheName, (error) => {
            if (error) {
                console.log(error);
            }
        });
        resolve();
    });
    return deleteLocalFile;
}

// Helper Function for deleteFileFromServer
// Try to delete files on server, if not found, reject;
function deleteServerFile(filename) {
    let deleteServerFile = new Promise((resolve, reject) => {
        let cloudName = getCloudName(filename);
        let ftpClient = new ftp();
        ftpClient.on('ready', () => {
            ftpClient.delete(cloudName, (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
        connect(ftpClient);
    });
    return deleteLocalFile;
}

// If the folder does not exist, generate it
function generateFolder(directory) {
    let generateFolder = new Promise((resolve, reject) => {
        let ftpClient = new ftp();
        directory = getCloudName(directory);
        ftpClient.on('ready', () => {
            ftpClient.cwd(directory, (error, currDirectory) => {
                if (error) {
                    ftpClient.mkdir(directory, true, (error) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(directory);
                        }
                    });
                }
                else {
                    resolve(currDirectory);
                }
            });
        });
        connect(ftpClient);
    });
    return generateFolder;
}

// Put file onto the server
function putFile(fileBuffer, filename) {
    let putFile = new Promise((resolve, reject) => {
        let ftpClient = new ftp();
        filename = getCloudName(filename);
        ftpClient.on('ready', () => {
            ftpClient.put(fileBuffer, filename, (error) => {
                if (error) {
                    console.log('Error: ' + error);
                    reject(error);
                }
                else {
                    resolve(filename);
                }
            });
        });
        connect(ftpClient);
    });
    return putFile;
}

// Get File from cloud
function getFileFromBase(cloudName, cacheName) {
    // Create a new ftp client and write files into cache
    const ftpClient = new ftp();
    let getFileFromBase = new Promise((resolve, reject) => {
        ftpClient.on('ready', () => {
            ftpClient.get(cloudName, (error, stream) => {
                if (error) {
                    console.log(error);
                    reject(error);
                    ftpClient.end();
                }
                else {
                    stream.pipe(fileStream.createWriteStream(cacheName));
                    ftpClient.end();
                    resolve(cacheName);
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
    });
}

// reformat filename into cached filename
function getCacheName(filename) {
    return './cache/' + filename.split('/').join('-');
}

// reformat filename info cloud filename
function getCloudName(filename) {
    return './files/' + filename;
}