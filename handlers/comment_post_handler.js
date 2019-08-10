const Comment = require('../models/comment_model');
const Moment = require('../models/moment_model');
const config = require('../config/database');
const jwt = require('jsonwebtoken');
const responseUtil = require('../utils/response');

module.exports.comment = function(request, response) {
    let content = request.body.content;
    let userInfo = decode(request.headers['authorization']);
    let momentId = request.body.momentId;
    let comment = new Comment({
        content: content,
        user: userInfo._id,
        moment: momentId
    });
    Comment.save(comment)
    .then((result) => {
        return Moment.addComment(momentId, result._id);
    })
    .then((result) => {
        return responseUtil.contentCreated(response, 'Success');
    })
    .catch((error) => {
        return responseUtil.badRequest(response, error);
    });
};

// Decode token into user information
function decode(token) {
    return jwt.verify(token.substring(4), config.secret);
}