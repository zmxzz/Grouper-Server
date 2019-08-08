const request = require('request');
const encryptingServer = require('../config/encryptionServer');
const authenticateServer = require('../config/authenticateServer');

// Send a password list to another server for encrypting password
module.exports.requestEncryption = async function(passwordList) {
    let body = {'passwordList': passwordList};
    let connect = new Promise((resolve, reject) => {
        var options = {
            url: encryptingServer.encryptionServer,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            method: 'POST'
        };
        
        request(options, (error, response, body) => {
            resolve(body);
        });
    });
    return connect;
}

// Compare login password with user's password and get token if the password is valid
module.exports.requestAuthenticate = async function(user, unencryptedPassword) {
    user.friends = [];
    user.friendRequests = [];
    user.chats = [];
    let body = {
        user: user,
        unencryptedPassword: unencryptedPassword
    };
    let connect = new Promise((resolve, reject) => {
        var options = {
            url: authenticateServer.authenticateServer,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            method: 'POST'
        };
        request(options, (error, response, body) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(body);
            }
        });
    });
    return connect;
}