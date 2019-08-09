const express = require('express');
const router = express.Router();
const passport = require('passport');
const MomentGetHandler = require('../handlers/moment_get_handler');

// GET Methods
router.get('/momentBySingleUser', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    MomentGetHandler.getMomentBySingleUser(request, response);
});

// Get activities information with a list of userIds
router.get('/momentByMultipleUsers', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    MomentGetHandler.getMomentByMultipleUsers(request, response);
});

module.exports = router;