const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    }
});

// Export Message model
const Message = module.exports = mongoose.model('Message', MessageSchema);

// Add, save message
module.exports.save = function(message) {
    let save = new Promise((resolve, reject) => {
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
};

// Retrieve message
module.exports.getMessageById = function(id) {
    const query = { _id: id };
    let find = new Promise((resolve, reject) => {
        Message.findOne(query, (error, result) => {
            if (error) {
                reject(error);
            }
            else if (!result) {
                reject('Message Not Found')
            }
            else {
                resolve(result);
            }
        });
    });
    return find;
};

