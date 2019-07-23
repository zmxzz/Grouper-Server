const Activity = require('../models/activity_model');
const config = require('../config/database');
const jwt = require('jsonwebtoken');
const responseUtil = require('../utils/response');

// Post an activity
module.exports.postActivity = function(request, response) {
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
module.exports.joinActivity = function(request, response) {
    // Get activity -> add user to partcipants
    let token = request.headers['authorization'];
    let user = decode(token);
    Activity.getActivityById(request.body.activityId)
    .then((activity) => {
        // If activity is found and user is not in participant list, push user to the participant list
        if (activity !== null && !activity.participants.includes(user._id)) {
            activity.participants.push(user._id);
            return Activity.save(activity);
        }
        else {
            return Promise.resolve(null);
        }
    })
    .then((activity) => {
        if (activity !== null) {
            responseUtil.requestAccepted(response, activity);
        }
        else {
            responseUtil.contentNotFound(response, 'Activity does not exist');
        }
    })
    .catch((error) => {
        responseUtil.badRequest(error);
    });
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