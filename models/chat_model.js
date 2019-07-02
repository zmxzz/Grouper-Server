const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]
});

// Export Chat model
const Chat = module.exports = mongoose.model('Chat', ChatSchema);

// Add, save Chat
module.exports.save = function(chat) {
    let save = new Promise((resolve, response) => {
        chat.save((error, result) => {
            chat.save((error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    });
    return save;
};