const express = require('express');
const router = express.Router();
const passport = require('passport');
const CommentGetHandler = require('../handlers/comment_get_handler');

// GET Methods
router.get('/info', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    CommentGetHandler.getInfo(request, response);
});

module.exports = router;

