const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/image', (request, response, next) => {
    console.log(request.body);
});

module.exports = router;