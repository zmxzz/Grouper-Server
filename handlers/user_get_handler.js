const bcrypt = require('bcryptjs');
const User = require('../models/user_model');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const responseUtil = require('../utils/response');

// Decode token
// Query user, return basic information
module.exports.getBasicInfo = function(request, response) {
    let username = decode(request.headers['authorization']).username;
    console.log('Username is ' + username);
    User.getUserByUsername(username)
    .then((user) => { 
        responseUtil.contentFound(response, getUserBasicInfo(user));
    })
    .catch((error) => { 
        responseUtil.badRequest(response, error);
    });
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
function getUserBasicInfo(user) {
    let result = {
        username: user.username,
        firstname: user.firstname ? user.firstname : "",
        lastname: user.lastname ? user.lastname : "",
        email: user.email,
        _id: user._id
    };
    return result;
}

function decode(token) {
    return jwt.verify(token.substring(4), config.secret);
}