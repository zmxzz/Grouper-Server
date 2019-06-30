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
        (error) => { sendError(response, error ); }
        );
}

// Decode tken
// Query user, return following
module.exports.getFollowing = function(request, response) {
    let username = decode(request.headers['authorization']).username;
    User.getUserByUsername(username)
    .then(
        (user) => { sendUserFollowings(response, user); },
        (error) => { sendError(response, error ); }
    );
}

// Query user, return follower
module.exports.getFollower = function(request, response) {
    let username = decode(request.headers['authorization']).username;
    User.getUserByUsername(username)
    .then(
        (user) => { sendUserFollowers(response, user); },
        (error) => { sendError(response, error ); }
    );
}

// Helper function to respond basic information
function sendUserBasicInfo(response, user) {
    let result = {
        username: user.username,
        firstname: user.firstname ? user.firstname : "",
        lastname: user.lastname ? user.lastname : "",
        email: user.email
    };
    return responseUtil.contentCreated(response, result);
}

// Helper function to respond followings
function sendUserFollowings(response, user) {
    return responseUtil.contentFound(response,  {following: user.following });
}

// Helper function to respond followers
function sendUserFollowers(response, user) {
    return responseUtil.contentFound(response, { follower: user.follower });
}

// Helper function respondes with error information
function sendError(response, error) {
    return responseUtil.badRequest(response, error);
}

function decode(token) {
    return jwt.verify(token.substring(4), config.secret);
}