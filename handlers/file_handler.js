const files = require('../utils/files');
const fileStream = require('fs');
const responseUtil = require('../utils/response');

module.exports.uploadFile = function(request, response) {
    let date = new Date();
    let suffix = files.getSuffix(request.file.originalname);
    let directory = files.generateDirectory(date);
    let filename = files.generateFilename(date) + '.' + suffix;

    // Put files to server
    files.putFileToFileServer(request.file.buffer, directory, filename)
    .then((result) => {
        filename = directory + '/' + filename;
        return responseUtil.contentCreated(response, filename);
    })
    .catch((error) => {
        return responseUtil.badRequest(response, error);
    });
};

module.exports.downloadFile = function(request, response) {
    files.getFileFromFileServer(request.query['filename'])
    .then((cacheName) => {
        fileStream.exists(cacheName, function(exists){
            if (exists) {     
              // Content-type is very interesting part that guarantee that
              // Web browser will handle response in an appropriate manner.
              response.writeHead(200, {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": 'inline'
              });
              return fileStream.createReadStream(cacheName).pipe(response);
            } else {
              return responseUtil.badRequest(response, 'ERROR File does not exist');
            }
          });
        }
    )
    .catch((error) => {
        return responseUtil.contentNotFound(response, 'File Not Found');
    });
};

module.exports.deleteFile = function(request, response) {
    files.deleteFile(request.query['filename'])
    .then(() => { 
        return responseUtil.noContent(response);
     })
    .catch((error) => { 
        return responseUtil.contentNotFound(response, 'File Not Found');
     });
}