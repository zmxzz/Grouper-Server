const express = require('express');
const router = express.Router();
const ActivityGetHandler = require('../handlers/activity_get_handler');

// GET Methods
router.get('/info', (request, response, next) => {
    ActivityGetHandler.getActivity(request, response);
});

// Get activities information with a list of userIds
router.get('/activityList', (request, response, next) => {
    ActivityGetHandler.getActivityList(request, response);
});

module.exports = router;