const bcrypt = require('bcryptjs');
const User = require('../models/user_model');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

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
    response.status(200).json({
        username: user.username,
        firstname: user.firstname ? user.firstname : "",
        lastname: user.lastname ? user.lastname : "",
        email: user.email
    });
}

// Helper function to respond followings
function sendUserFollowings(response, user) {
    response.status(200).json({
        following: user.following
    });
}

// Helper function to respond followers
function sendUserFollowers(response, user) {
    response.status(200).json({
        follower: user.follower
    });
}

// Helper function respondes with error information
function sendError(response, error) {
    response.status(400).json({
        error: error
    });
}

function decode(token) {
    return jwt.verify(token.substring(4), config.secret);
}