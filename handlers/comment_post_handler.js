const Comment = require('../models/comment_model');
const Moment = require('../models/moment_model');
const config = require('../config/database');
const jwt = require('jsonwebtoken');
const responseUtil = require('../utils/response');

module.exports.comment = function(request, response) {
    if (request.body.content === undefined || request.body.content === '' || request.body.momentId === null) {
        responseUtil.badRequest(response, 'Something Undefined');
        return;
    }
    let content = request.body.content;
    let userInfo = decode(request.headers['authorization']);
    let momentId = request.body.momentId;
    let comment = new Comment({
        content: content,
        user: userInfo._id,
        moment: momentId
    });
    let commentId = null;
    // Save comment, return its id
    Comment.save(comment)
    .then((result) => {
        commentId = result._id;
        return Moment.addComment(momentId, result._id);
    })
    .then((result) => {
        return responseUtil.contentCreated(response, commentId);
    })
    .catch((error) => {
        return responseUtil.badRequest(response, error);
    });
};

// Decode token into user information
function decode(token) {
    return jwt.verify(token.substring(4), config.secret);
}