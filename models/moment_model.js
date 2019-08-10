const mongoose = require('mongoose');

// Moment Schema
const MomentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    images: [{
        type: String
    }],
    content: {
        type: String
    },
    video: {
        type: String
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

// Export Moment model
const Moment = module.exports = mongoose.model('Moment', MomentSchema);

// Save moment to database
module.exports.save = function(moment) {
    let save = new Promise((resolve, reject) => {
        moment.save((error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
    return save;
};

// Find moments by users' id list
// userIdList: list of string representing user's id list
module.exports.getMomentByUserIdList = async function(userIdList) {
    const query = {user: { $in: userIdList }}
    let getMomentByUserIdList = new Promise((resolve, reject) => {
        Moment.find(query).sort({ _id: -1 }).exec((error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
    return getMomentByUserIdList;
};

// Find moments by a single user
module.exports.getMomentByUserId = async function(userId) {
    let getMomentByUser = new Promise((resolve, reject) => {
        Moment.find({user: userId}, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
    return getMomentByUser;
};

// Add comment to the moment
module.exports.addComment = async function(momentId, commentId) {
    return Moment.update({ _id: momentId }, { $addToSet: { comments: commentId } });
}

// Put userId into likes list
module.exports.like = async function(userId, momentId) {
    return Moment.update({ _id: momentId }, { $addToSet: { likes: userId } });
};

// Remove userId from likes list
module.exports.unlike = async function(userId, momentId) {
    return Moment.update({ _id: momentId }, { $pullAll: { likes: [userId] } });
};