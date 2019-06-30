const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
        required: true
    }
});

// Export Comment model
const Comment = module.exports = mongoose.model('Comment', CommentSchema);

// Add, save Comment
module.exports.save = function(comment) {
    let save = new Promise((resolve, reject) => {
        comment.save((error, result) => {
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