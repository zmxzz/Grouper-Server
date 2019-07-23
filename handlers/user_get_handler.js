const bcrypt = require('bcryptjs');
const User = require('../models/user_model');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const responseUtil = require('../utils/response');

// Decode token
// Query user, return basic information
module.exports.getBasicInfo = function(request, response) {
    let username = decode(request.headers['authorization']).username;
    User.getUserByUsername(username)
    .then(
        (user) => { sendUserBasicInfo(response, user); },
        (error) => { sendError(response, error); }
        );
};

// Decode token
// Query user, return friend list
module.exports.getFriends = function(request, response) {
    let username = decode(request.headers['authorization']).username;
    User.getUserByUsername(username)
    .then((user) => {
        responseUtil.contentFound(response, user.friends);
    })
    .catch((error) => {
        responseUtil.badRequest(response, error);
    });
};

module.exports.getFriendRequest = function(request, response) {
    let user = decode(request.headers['authorization']);
    User.getUserById(user._id)
    .then((user) => {
        responseUtil.contentFound(response, user.friendRequests);
    })
    .catch((error) => {
        responseUtil.badRequest(response, error);
    });
}

module.exports.isLoggedIn = function(request, repsonse) {
    responseUtil.requestAccepted(response, 'Token not expired yet');
};

// Helper function to respond basic information
function sendUserBasicInfo(response, user) {
    let result = {
        username: user.username,
        firstname: user.firstname ? user.firstname : "",
        lastname: user.lastname ? user.lastname : "",
        email: user.email,
        _id: user._id
    };
    return responseUtil.contentFound(response, result);
}

// Helper function respondes with error information
function sendError(response, error) {
    return responseUtil.badRequest(response, error);
}

function decode(token) {
    return jwt.verify(token.substring(4), config.secret);
}