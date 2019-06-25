const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user_model');
const UserPostHandler = require('../handlers/user_post_handler');
const UserGetHandler = require('../handlers/user_get_handler');

// GET Methods -----------------------------------------------------
router.get('/info', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserGetHandler.getBasicInfo(request, response);
});

router.get('/following', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserGetHandler.getFollowing(request, response);
});

router.get('/follower', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserGetHandler.getFollower(request, response);
});

// POST Methods ----------------------------------------------------
// Register
router.post('/register', (request, response, next) => {
    let user = UserPostHandler.initUser(request.body);
    UserPostHandler.register(user, response);
});

// Log In
router.post('/login', (request, response, next) => {
    UserPostHandler.authenticate(request.body, response);
});

// Follow
router.post('/follow', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserPostHandler.follow(request, response);
});

// Unfollow
router.post('/unfollow', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserPostHandler.unfollow(request, response);
});

module.exports = router;