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