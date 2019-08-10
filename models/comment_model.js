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
    moment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Moment',
        required: true
    }
});

// Export Comment model
const Comment = module.exports = mongoose.model('Comment', CommentSchema);

// Add, save Comment
module.exports.save = function(comment) {
    return comment.save();
};

// Find comment by id
module.exports.findCommentById = function(commentId) {
    return Comment.findOne({ _id: commentId });
};