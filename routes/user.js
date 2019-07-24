const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserPostHandler = require('../handlers/user_post_handler');
const UserGetHandler = require('../handlers/user_get_handler');
const MomentPostHandler = require('../handlers/moment_post_handler');
const CommentPostHandler = require('../handlers/comment_post_handler');
const ChatPostHandler = require('../handlers/chat_post_handler');
const ChatGetHandler = require('../handlers/chat_get_handler');
const ActivityPostHandler = require('../handlers/activity_post_handler');
const ActivityDeleteHandler = require('../handlers/activity_delete_handler');
const ReviewPostHandler = require('../handlers/review_post_handler');
const DatabaseCache = require('../utils/database_cache');

// Variables
let databaseCache = new DatabaseCache.DatabaseCache();

// GET Methods -----------------------------------------------------
router.get('/test', (request, response) => {
    response.json({
        success: true
    });
});
router.get('/info', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserGetHandler.getBasicInfo(request, response);
});

router.get('/friendRequest', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserGetHandler.getFriendRequest(request, response);
})

router.get('/friendList', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserGetHandler.getFriends(request, response);
});

router.get('/isLoggedIn', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserGetHandler.isLoggedIn(request, response);
});

router.get('/chat', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    ChatGetHandler.getChat(request, response);
});

router.get('/message', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    ChatGetHandler.getMessage(request, response);
});

// POST Methods ----------------------------------------------------
// Register
router.post('/register', (request, response, next) => {
    let user = UserPostHandler.initUser(request.body);
    user = UserPostHandler.register(user, response);
    databaseCache.saveUser(user);
});

// Log In
router.post('/login', (request, response, next) => {
    UserPostHandler.authenticate(request.body, response);
});

// Request to add friend
router.post('/sendFriendRequest', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserPostHandler.sendFriendRequest(request, response);
});

// Accept request to add friend
router.post('/acceptFriendRequest', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserPostHandler.acceptFriendRequest(request, response);
});

// Delete friend
router.post('/unfriend', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserPostHandler.unfriend(request, response);
});

// Post a moment
router.post('/postMoment', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    MomentPostHandler.postMoment(request, response);
});


// Comment
router.post('/comment', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    CommentPostHandler.comment(request, response);
});

// Like
router.post('/like', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    MomentPostHandler.like(request, response);
});

// Unlike
router.post('/unlike', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    MomentPostHandler.unlike(request, response);
});

// Start Chat
router.post('/startChat', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    ChatPostHandler.start(request, response);
});

// Send Message
router.post('/sendMessage', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    ChatPostHandler.sendMessage(request, response);
});

// Post Activity
router.post('/postActivity',  passport.authenticate('jwt', {session: false}), (request, response, next) => {
    ActivityPostHandler.postActivity(request, response);
});

// Join Activity
router.post('/joinActivity',  passport.authenticate('jwt', {session: false}), (request, response, next) => {
    ActivityPostHandler.joinActivity(request, response);
});

// Post Review
router.post('/postReview',  passport.authenticate('jwt', {session: false}), (request, response, next) => {
   ReviewPostHandler.postReview(request, response);
});

// DELETE Methods
router.delete('/disbandActivity', (request, response, next) => {
    ActivityDeleteHandler.deleteActivity(request, response);
});

module.exports = router;