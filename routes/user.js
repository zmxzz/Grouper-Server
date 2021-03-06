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

// GET Methods -----------------------------------------------------
router.get('/test', (request, response) => {
    response.json({
        success: true
    });
});
router.get('/info', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserGetHandler.getBasicInfo(request, response);
});

router.get('/infoById', (request, response) => {
    UserGetHandler.getBasicInfoById(request, response);
});

router.get('/friendRequest', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserGetHandler.getFriendRequest(request, response);
})

router.get('/friendList', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserGetHandler.getFriends(request, response);
});

router.get('/friendSuggestionList', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserGetHandler.getFriendSuggestionList(request, response);
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
    UserPostHandler.register(request, response);
});

// Log In
router.post('/login', (request, response, next) => {
    UserPostHandler.authenticate(request.body, response);
});

// Set bio
router.post('/bio', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserPostHandler.setBio(request, response);
});

// Request to add friend
router.post('/sendFriendRequest', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserPostHandler.sendFriendRequest(request, response);
});

// Accept request to add friend
router.post('/acceptFriendRequest', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserPostHandler.acceptFriendRequest(request, response);
});

// Decline request to add friend
router.post('/declineFriendRequest', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    UserPostHandler.declineFriendRequest(request, response);
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
router.post('/postComment', passport.authenticate('jwt', {session: false}), (request, response, next) => {
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

// Quit Activity
router.post('/quitActivity', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    ActivityPostHandler.quitActivity(request, response);
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
