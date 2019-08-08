const bcrypt = require('bcryptjs');
const User = require('../models/user_model');
const Activity = require('../models/activity_model');
const Moment = require('../models/moment_model');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const responseUtil = require('../utils/response');

// Decode token
// Query user, return basic information
module.exports.getBasicInfo = async function(request, response) {
    let username = decode(request.headers['authorization']).username;
    try {
        let userInfo = await User.getUserByUsername(username);
        let activities = await Activity.getActivityByOrganizerIdList([userInfo._id]);
        let moments = await Moment.getMomentByUserIdList([userInfo._id]);
        let userBasicInfo = {
            _id: userInfo._id,
            username: userInfo.username,
            firstname: userInfo.firstname,
            lastname: userInfo.lastname,
            friendCount: userInfo.friends.length,
            momentCount: moments.length,
            activityCount: activities.length
        };
        responseUtil.contentFound(response, userBasicInfo);
    } catch (error) {
        responseUtil.badRequest(response, error);
    }
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
};

// Return a list for friend suggestion
module.exports.getFriendSuggestionList = async function(request, response) {
    let userInfo = decode(request.headers['authorization']);
    try {
        let friendSuggestionList = await User.getFriendSuggestionList(userInfo._id);
        responseUtil.contentFound(response, friendSuggestionList);
    } catch (error) {
        console.log(error);
        responseUtil.badRequest(response, error);
    }
};

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