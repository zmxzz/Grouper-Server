const Activity = require('../models/activity_model');
const config = require('../config/database');
const jwt = require('jsonwebtoken');
const responseUtil = require('../utils/response');

// Post an activity
module.exports.postActivity = function(request, response) {
    if (request.body.activityName === undefined) {
        responseUtil.badRequest(response, 'Activity Undefined');
        return;
    }
    // Create a new activity object
    let activity = new Activity(getInfo(request));
    // Save it to database
    Activity.save(activity)
    .then((result) => {
        return responseUtil.contentCreated(response, result);
    })
    .catch((error) => {
        console.log('Error is ' + error);
        return responseUtil.badRequest(response, error);
    });
};

// Join an activity
module.exports.joinActivity = async function(request, response) {
    if (request.body.activityId === undefined) {
        responseUtil.badRequest(response, 'Activity Undefined');
        return;
    }
    // Get activity -> add user to partcipants
    let token = request.headers['authorization'];
    let user = decode(token);
    try {
        await Activity.addParticipant(request.body.activityId, user._id);
        responseUtil.noContent(response);
    } catch (error) {
        responseUtil.badRequest(response, error);
    }
};

module.exports.quitActivity = async function(request, response) {
    if (request.body.activityId === undefined) {
        responseUtil.badRequest(response, 'Activity Undefined');
        return;
    }
    let token = request.headers['authorization'];
    let user = decode(token);
    try {
        await Activity.removeParticipant(request.body.activityId, user._id);
        responseUtil.noContent(response);
    } catch (error) {
        responseUtil.badRequest(response, error);
    }
};

// Returns an object representing activity
function getInfo(request) {
    let organizer = decode(request.headers['authorization'])._id;
    let body = request.body;
    let activity = {
        activityName: body.activityName,
        introduction: body.introduction,
        category: body.category,
        year: body.year,
        month: body.month,
        day: body.day,
        hour: body.hour,
        minute: body.minute,
        state: body.state,
        city: body.city,
        address: body.address,
        organizer: organizer,
        participants: [],
        groupSize: body.groupSize,
        reviews: [],
        images: []
    };
    return activity;
}

// decode token with jwt
function decode(token) {
    return jwt.verify(token.substring(4), config.secret);
}