const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer  = require('multer');
const upload = multer();
const fileHandler = require('../handlers/file_handler');

router.post('/upload', upload.single('file'), (request, response, next) => {
    fileHandler.uploadFile(request, response);
});

router.get('/download', (request, response, next) => {
    fileHandler.downloadFile(request, response);
})

module.exports = router;