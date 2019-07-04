const Chat = require('../models/chat_model');
const User = require('../models/user_model');
const Message = require('../models/message_model');
const config = require('../config/database');
const jwt = require('jsonwebtoken');
const responseUtil = require('../utils/response');
const arrays = require('../utils/array');

// Start a chat
module.exports.start = function(request, response) {
    let userIdOne = decode(request.headers['authorization'])._id;
    let userIdTwo = request.body.userId;
    let currChat = new Chat({
        participants: [
            userIdOne,
            userIdTwo
        ],
        messages: []
    });
    // return 200 if chat is started, 400 if chat is not started
    Chat.save(currChat)
    .then((chat) => {
        responseUtil.contentCreated(response, chat);
        addUserChat(userIdOne, currChat._id);
        addUserChat(userIdTwo, currChat._id);
    })
    .catch((error) => {
        responseUtil.badRequest(response, error);
    });

};

// Send message
module.exports.sendMessage = function(request, response) {
    if (request.body.content === null || request.body.content === '') {
        return responseUtil.badRequest(response);
    }
    let newMessage = new Message({
        content: request.body.content
    });
    Message.save(newMessage)
    .then(() => {
        return Chat.getChatById(request.body.chatId);
    })
    .then((chat) => {
        chat.messages.push(newMessage._id);
        return Chat.save(chat);
    })
    .then(() => {
        responseUtil.contentCreated(response, newMessage);
    })
    .catch((error) => {
        responseUtil.badRequest(response, error);
    });

}

function addUserChat(userId, chatId) {
    User.getUserById(userId)
    .then((user) => {
        user.chats.push(chatId);
        return User.save(user);
    })
    .catch((error) => {
        console.log(error);
    });
}

// decode token with jwt
function decode(token) {
    return jwt.verify(token.substring(4), config.secret);
}