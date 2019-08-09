const Moment = require('../models/moment_model');
const responseUtil = require('../utils/response');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

// get moments posted by the given user id
module.exports.getMomentBySingleUser = async function(request, response) {
    let userId = request.query['userId'];
    try {
        let moment = await Moment.getMomentByUserId(userId);
        responseUtil.contentFound(response, moment);
    } catch (error) {
        responseUtil.badRequest(response, error);
    }
};

// get moments posted by the given user id list
module.exports.getMomentByMultipleUsers = async function(request, response) {
    if (request.query['userIdList'] === undefined) {
        responseUtil.badRequest(response, 'user id list undefined');
        return;
    }
    let userIdList = JSON.parse(request.query['userIdList']);
    try {
        let moment = await Moment.getMomentByUserIdList(userIdList);
        responseUtil.contentFound(response, moment);
    } catch (error) {
        responseUtil.badRequest(response, error);
    }
}

// Decode function
function decode(token) {
    return jwt.verify(token.substring(4), config.secret);
}