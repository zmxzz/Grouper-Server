const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    }
});

// Export Chat model
const Message = module.exports = mongoose.model('Message', MessageSchema);

// Add, save Chat
module.exports.save = function(message) {
    let save = new Promise((resolve, response) => {
        message.save((error, result) => {
            message.save((error, result) => {
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
} 