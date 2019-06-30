const Tweet = require('../models/tweet_model');
const config = require('../config/database');
const jwt = require('jsonwebtoken');
const responseUtil = require('../utils/response');
const arrays = require('../utils/array');

// Initialize a new twitter based on the request information
module.exports.initTweet = function(request) {
    let info = getInfo(request.body);
    info.user = decode(request.headers['authorization'])._id;
    let tweet = new Tweet(info);
    return tweet;
}

// Post tweet if it's not retweet
module.exports.postOriginalTweet = function(tweet, response) {
    Tweet.save(tweet)
    .then(() => {
        // If saved successfully, respond with 201 Content Created status code
        return responseUtil.contentCreated(response, tweet);
    })
    .catch((error) => {
        // If saved unsuccessfully, we don't know the error yet, respond with 500 Internal Server Error
        return responseUtil.internalServerError(response, error);
    });
}

// Post retweet
module.exports.postRetweet = function(tweet, response) {
    Tweet.getTweetById(tweet.retweetFrom)
    .then((originalTweet) => {
        // Append current tweet to original tweet's retweet list
        return addRetweetToOriginalTweet(originalTweet, tweet);
    })
    .then(() => {
        // Save Tweet, respond based on the result of saving process
        return Tweet.save(tweet); // Save current tweet
    })
    .then(() => {
        // Success, 201 Content Created
        return responseUtil.contentCreated(response, tweet);
    })
    .catch((error) => {
        console.log(error);
        // The problem should be the tweet got retweeted is not found any more
        return responseUtil.contentNotFound(response, error);
    });
}

// Add comment count for a tweet
module.exports.increaseCommentCount = function(tweetId) {
    let increaseCommentCount = new Promise((resolve, reject) => {
        Tweet.getTweetById(tweetId)
        .then((tweet) => {
            // if tweet is not null, add comment count
            // Pass tweet to next promise, if it's null, next promise will throw error
            if (tweet !== null) {
                tweet.commentCount++;
            }
            resolve(tweet);
        })
        .catch((error) => {
            reject(error);
        });
    });
    return increaseCommentCount;
};

// Increase like count by 1, add user to like list
module.exports.like = function(request, response) {
    let userInfo = decode(request.headers['authorization']);
    Tweet.getTweetById(request.body.tweetId)
    .then((tweet) => {
        // If tweet is not found, respond with 404 Not Found code
        if (tweet === null) {
            return responseUtil.contentNotFound(response, 'Tweet Not Found');
        }
        // If user has already liked tweet, respond with 400 Bad Request
        else if (tweet.likes.includes(userInfo._id)) {
            return responseUtil.badRequest(response, 'User already liked tweet');
        }
        // Otherwise, add user to the like list
        else {
            tweet.likes.push(userInfo._id);
            tweet.likeCount++;
            Tweet.save(tweet);
            return responseUtil.requestAccepted(response, 'Request Accepted');
        }
    })
    .catch((error) => {
        console.log(error);
        return responseUtil.internalServerError(response, 'Unknown Error');
    });
};

// Decrease like count by 1, remove user from like list
module.exports.unlike = function(request, response) {
    let userInfo = decode(request.headers['authorization']);
    Tweet.getTweetById(request.body.tweetId)
    .then((tweet) => {
        // If tweet is not found, respond with 404 Not Found code
        if (tweet === null) {
            return responseUtil.contentNotFound(response, 'Tweet Not Found');
        }
        // If user is not in the like list, respond with 400 Bad Request
        else if (!tweet.likes.includes(userInfo._id)) {
            return responseUtil.badRequest(response, 'User does not like tweet');
        }
        // Otherwise, remove user from the like list
        else {
            arrays.remove(tweet.likes, userInfo._id);
            Tweet.save(tweet);
            return responseUtil.requestAccepted(response, 'Request Accepted');
        }
    })
    .catch((error) => {
        console.log(error);
        return responseUtil.internalServerError(response, 'Unknown Error');
    });
};

// add current tweet id to the original tweet's retweet list
function addRetweetToOriginalTweet(originalTweet, newTweet) {
    if (originalTweet === null) {
        throw 'Original Tweet Not Found!';
    }
    // add new tweet to the old tweet's retweet list
    originalTweet.retweets.push(newTweet._id);
    originalTweet.retweetCount++;
    return Tweet.save(originalTweet);
}

// retrieve information from body 
function getInfo(body) {
    return {
        'content': body.content,
        'user': '',
        'isRetweet': body.isRetweet,
        'retweetFrom': body.isRetweet ? body.retweetFrom : null,
        'retweetCount': 0,
        'likeCount': 0,
        'commentCount': 0,
        'images': body.images ? body.images : null,
        'video': body.video ? body.video : null,
        'retweets': [],
        'likes': [],
        'comments': []
    };
}

// decode token with jwt
function decode(token) {
    return jwt.verify(token.substring(4), config.secret);
}

