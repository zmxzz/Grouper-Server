const Moment = require('../models/moment_model');
const responseUtil = require('../utils/response');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

// Add new moment to database
module.exports.postMoment = function(request, response) {
    if (request.body.content === undefined || request.body.content === '') {
        responseUtil.badRequest(response, 'Moment is undefined or empty');
        return;
    }
    // Initialize a new moment object
    let moment = new Moment(getInfo(request));
    // 200 for success create, 400 for error
    Moment.save(moment)
    .then((result) => {
        responseUtil.contentCreated(response, result);
    })
    .catch((error) => {
        responseUtil.badRequest(response, error);
    });
};

// Add like to moment
module.exports.like = function(request, response) {
    let userInfo = decode(request.headers['authorization']);
    if (userInfo._id === undefined || request.body.momentId === undefined) {
        responseUtil.badRequest(response, 'Undefined');
        return;
    }
    Moment.like(userInfo._id, request.body.momentId)
    .then(responseUtil.requestAccepted(response, 'Success'))
    .catch((error) => {
        responseUtil.badRequest(response, error);
    });
};

// Remove userID from moment's like list
module.exports.unlike = function(request, response) {
    if (request.body.momentId === undefined) {
        responseUtil.badRequest(response, 'Moment Undefined');
        return;
    }
    let userInfo = decode(request.headers['authorization']);
    Moment.unlike(userInfo._id, request.body.momentId)
    .then(responseUtil.requestAccepted(response, 'Success'))
    .catch((error) => {
        responseUtil.badRequest(response, error);
    });
};

// Gather information to create moment object
function getInfo(request) {
    let body = request.body;
    let moment = {
        user: decode(request.headers['authorization'])._id,
        images: request.body.images,
        content: request.body.content,
        video: request.body.video,
        likes: [],
        comments: []
    };
    return moment;
}

// Decode function
function decode(token) {
    return jwt.verify(token.substring(4), config.secret);
}