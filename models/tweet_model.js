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
    },
    comments: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        required: true
    },
});

// Export User model
const Tweet = module.exports = mongoose.model('Tweet', TweetSchema);
