const Comment = require('../models/comment_model');
const config = require('../config/database');
const jwt = require('jsonwebtoken');
const responseUtil = require('../utils/response');

module.exports.comment = function(request, response) {
    let content = request.body.commentContent;
    let user = decode(request.headers['authorization'])._id;
    let moment = request.body.momentId;
    let comment = new Comment({
        content: content,
        user: user,
        moment: moment
    });
    Comment.save(comment)
    .then((result) => {
        return responseUtil.contentCreated(response, result);
    })
    .catch((error) => {
        return responseUtil.badRequest(response, error);
    });
}

// Decode token into user information
function decode(token) {
    return jwt.verify(token.substring(4), config.secret);
}