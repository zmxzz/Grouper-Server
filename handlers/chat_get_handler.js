const Chat = require('../models/chat_model');
const Message = require('../models/message_model');
const responseUtil = require('../utils/response');

// Retrieve a chat
module.exports.getChat = function(request, response) {
    Chat.getChatById(request.body.chatId)
    .then((chat) => {
        return responseUtil.contentFound(response, chat);
    })
    .catch((error) => {
        responseUtil.contentNotFound(response, error);
    });
};

// Retrieve a message
module.exports.getMessage = function(request, response) {
    Message.getMessageById(request.body.messageId)
    .then((message) => {
        return responseUtil.contentFound(response, message);
    })
    .catch((error) => {
        responseUtil.contentNotFound(response, error);
    });
};