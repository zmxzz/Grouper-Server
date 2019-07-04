const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserPostHandler = require('../handlers/user_post_handler');
const UserGetHandler = require('../handlers/user_get_handler');
const TweetPostHandler = require('../handlers/tweet_post_handler');
const CommentPostHandler = require('../handlers/comment_post_handler');
const ChatPostHandler = require('../handlers/chat_post_handler');
const ChatGetHandler = require('../handlers/chat_get_handler');
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

// Post new tweet
router.post('/tweet', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    let tweet = TweetPostHandler.initTweet(request);
    TweetPostHandler.postOriginalTweet(tweet, response);
});

// Retweet
router.post('/retweet', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    let tweet = TweetPostHandler.initTweet(request);
    TweetPostHandler.postRetweet(tweet, response);
});

// Comment
router.post('/comment', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    let comment = CommentPostHandler.initComment(request);
    TweetPostHandler.increaseCommentCount(comment.tweet)
    .then((tweet) => {
        CommentPostHandler.postComment(comment, tweet, response);
    })
    .catch((error) => {
        console.log(error);
    })
});

// Like
router.post('/like', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    TweetPostHandler.like(request, response);
});

// Unlike
router.post('/unlike', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    TweetPostHandler.unlike(request, response);
});

// Start Chat
router.post('/startChat', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    ChatPostHandler.start(request, response);
});

// Send Message
router.post('/sendMessage', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    ChatPostHandler.sendMessage(request, response);
})

module.exports = router;