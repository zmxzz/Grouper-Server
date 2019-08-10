const Comment = require('../models/comment_model');
const config = require('../config/database');
const jwt = require('jsonwebtoken');
const responseUtil = require('../utils/response');

module.exports.getInfo = function(request, response) {
    if (request.query['commentId'] === undefined) {
        responseUtil.badRequest(response, 'Comment id undefined');
    }
    Comment.findCommentById(request.query['commentId'])
    .then((result) => {
        responseUtil.contentFound(response, result);
    })
    .catch((error) => {
        console.log('Error: ' + error);
        responseUtil.badRequest(response, error);
    });
};