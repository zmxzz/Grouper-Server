const Activity = require('../models/activity_model');
const config = require('../config/database');
const jwt = require('jsonwebtoken');
const responseUtil = require('../utils/response');

// Delete an activity
module.exports.deleteActivity = function(request, response) {
    let activityId = request.query['activityId'];
    // Delete activity
    Activity.deleteActivityById(activityId)
    .then(() => {
        responseUtil.noContent(response)
    })
    .catch((error) => {
        responseUtil.badRequest(response, error);
    });
}