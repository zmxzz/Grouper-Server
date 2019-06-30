const mongoose = require('mongoose');

const TweetSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isRetweet: {
        type: Boolean,
        required: true
    },
    retweetFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    },
    retweetCount: {
        type: Number,
        required: true
    },
    likeCount: {
        type: Number,
        required: true
    },
    commentCount: {
        type: Number,
        required: true
    },
    images: [{
        type: String
    }],
    video: {
        type: String
    },
    retweets: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        required: true
    },
    likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        required: true
    }
});

// Export User model
const Tweet = module.exports = mongoose.model('Tweet', TweetSchema);

// Post tweet
module.exports.post = function(tweet) {
    let post = new Promise((resolve, reject) => {
        tweet.save((error, result) => {
            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
    return post;
};

// Save tweet
module.exports.save = function(tweet) {
    let save = new Promise((resolve, reject) => {
        tweet.save((error, result) => {
            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
    return save;
};

// Find tweet by id
module.exports.getTweetById = function(id) {
    const query = { _id: id };
    let find = new Promise((resolve, reject) => {
        Tweet.findOne(query, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
    return find;
};