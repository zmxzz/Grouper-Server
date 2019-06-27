const files = require('../utils/files');
const fileStream = require('fs');

module.exports.uploadFile = function(request, response) {
    let date = new Date();
    let suffix = files.getSuffix(request.file.originalname);
    let directory = files.generateDirectory(date);
    let filename = files.generateFilename(date) + '.' + suffix;

    // Put files to server
    files.putFileToFileServer(request.file.buffer, directory, filename)
    .then((result) => {
        filename = directory + '/' + filename;
        return response.status(200).json({
            success: true,
            filename: filename
        });
    })
    .catch((error) => {
        return response.status(400).json({
            success: false,
            error: error
        });
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
              fileStream.createReadStream(cacheName).pipe(response);
            } else {
              response.writeHead(400, {"Content-Type": "text/plain"});
              response.end("ERROR File does not exist");
            }
          });
        }
    )
    .catch((error) => {
        response.status(404).json({
            success: false,
            status: 'File Not Found'
        });
    });
};

module.exports.deleteFile = function(request, response) {
    files.deleteFile(request.query['filename'])
    .then(() => { response.status(204).end(); })
    .catch((error) => { response.status(404).send('File Not Found').end(); });
}