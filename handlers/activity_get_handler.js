const Activity = require('../models/activity_model');
const responseUtil = require('../utils/response');

// Get an activity
module.exports.getActivity = function(request, response) {
    if (request.query['activityId'] === undefined) {
        responseUtil.badRequest(response, 'Activity Undefined');
        return;
    }
    Activity.getActivityById(request.query['activityId'])
    .then((activity) => {
        if (activity === null) {
            responseUtil.contentFound(response, 'Activity Not Found');
        }
        else {
            responseUtil.contentFound(response, activity);
        }
    })
    .catch((error) => {
        responseUtil.badRequest(response, error);
    });
};

// Get activity list
module.exports.getActivityList = function(request, response) {
    if (request.query['organizerIdList'] === undefined) {
        responseUtil.badRequest(response, 'Organizer List Undefined');
        return;
    }
    let organizerIdList = request.query['organizerIdList'].split(', ');
    Activity.getActivityByOrganizerIdList(organizerIdList)
    .then((activityList) => {
        responseUtil.contentFound(response, activityList);
    })
    .catch((error) => {
        responseUtil.badRequest(response, error);
    });
};