const Moment = require('../models/moment_model');
const responseUtil = require('../utils/response');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

// Add new moment to database
module.exports.postMoment = function(request, response) {
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