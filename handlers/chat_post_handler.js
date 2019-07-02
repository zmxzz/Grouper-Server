const Chat = require('../models/chat_model');
const Message = require('../models/message_model');
const config = require('../config/database');
const jwt = require('jsonwebtoken');
const responseUtil = require('../utils/response');
const arrays = require('../utils/array');

// Start a chat
module.exports.start = function(request, response) {
    let userIdOne = decode(request.headers['authorization']).userId;
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
    .then((result) => {
        responseUtil.contentCreated(response, result);
    })
    .catch((error) => {
        responseUtil.badRequest(response, error);
    });
};

// Send message
module.exports.sendMessage = function(request, response) {
    
}



// decode token with jwt
function decode(token) {
    return jwt.verify(token.substring(4), config.secret);
}