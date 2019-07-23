const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
    },
    content: {
        type: String
    },
    images: [{
        type: String
    }]
});

// Export Review model
const Review = module.exports = mongoose.model('Review', ReviewSchema);

// Save review
module.exports.save = function(review) {
    let save = new Promise((resolve, reject) => {
        review.save((error, result) => {
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