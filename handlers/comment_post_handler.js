const Comment = require('../models/comment_model');
const config = require('../config/database');
const jwt = require('jsonwebtoken');
const responseUtil = require('../utils/response');

// Initializa comment with the given request
module.exports.initComment = function(request) {
    let userId = decode(request.headers['authorization'])._id;
    let tweetId = request.body.tweetId;
    let content = request.body.content;
    let comment = new Comment({
        content: content,
        user: userId,
        tweet: tweetId
    });
    return comment;
}

// Save comment to the database
module.exports.postComment = function(comment, tweet, response) {
    if (tweet === null) {
        // response with 404 not found if the given tweetId is not in the database
        return responseUtil.contentNotFound(response, 'Tweet Not Found');
    }
    Comment.save(comment)
    .then((result) => {
        // Successfully created comment
        return responseUtil.contentCreated(response, result);
    })
    .catch((error) => {
        // Error, respond with 400 bad reqeust
        return responseUtil.badRequest(response, error);
    });
};

// Decode token into user information
function decode(token) {
    return jwt.verify(token.substring(4), config.secret);
}