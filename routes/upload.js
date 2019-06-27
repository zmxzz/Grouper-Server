const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer  = require('multer')
const upload = multer()

router.post('/image', upload.single('image'), (request, response, next) => {
    console.log(request.file);
});

module.exports = router;