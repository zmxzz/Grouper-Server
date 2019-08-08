const bcrypt = require('bcryptjs');
const User = require('../models/user_model');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const arrays = require('../utils/array');
const responseUtil = require('../utils/response');
const databaseCache = require('../utils/database_cache');
const requestUtil = require('../utils/request');

// Add new user to database
module.exports.register = function(request, response) {
    if (request.body.email === undefined || request.body.password === undefined && request.body.username === undefined) {
        responseUtil.badRequest(response, 'Incomplete Information');
    }
    else {
        responseUtil.contentCreated(response, 'Content Created');
        // Initialize user with body information
        let user = initUser(request.body);
        encryptAndSaveUser(user);
    }
};

// Authenticate user with given username and password
module.exports.authenticate = function(user, response) {
    let username = user.username;
    let password = user.password;
    // Get user -> encrypt password -> compare
    User.getUserByUsername(username)
    .then((user) => {
        return requestUtil.requestAuthenticate(user, password);
    })
    .then((token) => {
        return responseUtil.contentFound(response, token);
    })
    .catch((error) => {
        responseUtil.badRequest(response, error);
    });
};

// Send request to add friend
module.exports.sendFriendRequest = async function(request, response) {
    // Ids of two users
    let userSendingRequest = decode(request.headers['authorization'])._id;
    let userGettingRequest = request.body.userId;
    // Update user's friend request list
    try {
        let userObjectGettingRequest = await User.getUserById(userGettingRequest);
        if (userObjectGettingRequest.friends.includes(userSendingRequest)) {
            throw 'User already added';
        }
        await User.updateFriendRequest(userGettingRequest, userSendingRequest);
        responseUtil.requestAccepted(response, 'Friend request sent');
    } catch (error) {
        responseUtil.badRequest(response, error);
    }
};

// Decline request to add friend
module.exports.declineFriendRequest = async function(request, response) {
    // Ids of two users
    let userDecliningRequest = decode(request.headers['authorization'])._id;
    let userGettingDeclined = request.body.userId;
    // Remove requests from user's request list
    try {
        await User.removeFriendRequest(userDecliningRequest, userGettingDeclined);
        responseUtil.requestAccepted(response, 'Friend request declined');
    } catch (error) {
        responseUtil.badRequest(response, error);
    }
};

// Accept request to add friend
module.exports.acceptFriendRequest = async function(request, response) {
    // Ids of two users
    let userAcceptingRequest = decode(request.headers['authorization'])._id;
    let userToBeAdded = request.body.userId;
    if (userToBeAdded === undefined || userToBeAdded === null) {
        responseUtil.badRequest(response, 'User undefined');
        return;
    }
    // Get user -> add friend to both -> save
    try {
        let user = await User.getUserById(userAcceptingRequest);
        if (user.friends.includes(userToBeAdded)) {
            throw 'User already added';
        }
        else {
            await User.removeFriendRequest(userAcceptingRequest, userToBeAdded);
            await User.addFriend(userAcceptingRequest, userToBeAdded);
            responseUtil.requestAccepted(response, 'User added');
        }
    } catch (error) {
        responseUtil.badRequest(response, error);
    }
};

// Unfriend a user
module.exports.unfriend = async function(request, response) {
    let userDeletingFriend = decode(request.headers['authorization'])._id;
    let userGettingDeleted = request.body.userId;
    // Get userDeletingFriend -> check if target is in the friend list -> delete user from both sides
    try {
        await User.removeFriend(userDeletingFriend, userGettingDeleted);
        responseUtil.requestAccepted(response, 'User unfriended');
    } catch (error) {
        responseUtil.badRequest(response, error);
    }
};

// Helper function for getting password from users' list
// Return a list of unencrypted password list
function getUnencryptedPassword(userList) {
    let unencryptedPasswordList = [];
    for (let i = 0; i < userList.length; i++) {
        unencryptedPasswordList.push(userList[i].password);
    }
    return unencryptedPasswordList;
}

// Helper function for setting encrypted password to users' list, return void
function setEncryptedPassword(userList, encryptedPasswordList) {
    for (let i = 0; i < userList.length; i++) {
        userList[i].password = encryptedPasswordList[i];
    }
}

// Cache uncrypted user into the list, wait for all of them to get encrypted and save them into database
function encryptAndSaveUser(user) {
    // Add user to the cachce
    databaseCache.addUnencryptedUser(user);
    // If the timeout has not started, start a timeout to encrypt all the user in the cache
    if (!databaseCache.hasSetTimeoutForEncryptUser()) {
        databaseCache.setTimeoutForEncryptAndSave(async () => {
            // Get unencrypted user and password list
            let userList = databaseCache.getUnencryptedUserList();
            let unencryptedPasswordList = getUnencryptedPassword(userList);
            // Reset cache for next timeout
            databaseCache.resetUnencryptedUserList();
            // Waiting for the password to get encrypted
            try {
                let encryptedPasswordList = await requestUtil.requestEncryption(unencryptedPasswordList);
                setEncryptedPassword(userList, JSON.parse(encryptedPasswordList));
                // After encrypted all the password, save them
                for (let i = 0; i < userList.length; i++) {
                    saveUser(userList[i]);
                }
            } catch (error) {
                console.log(error);
            }
        });
    }
}

function saveUser(user) {
    // Add user to the cache
    databaseCache.addSaveUser(user);
    // If the timeout has not started, start a timeout to save all the users into database
    if (!databaseCache.hasSetTimeoutForSaveUser()) {
        databaseCache.setTimeoutForSaveUserList(() => {
            let saveUserList = databaseCache.getSaveUserList();
            // Empty save user list for next timeout
            databaseCache.resetSaveUserList();
            User.saveAll(saveUserList)
            .catch((error) => { console.log(error); });
        });
    }
}

// Initialize new user
function initUser(body) {
    let info = getInfo(body);
    let user = new User(info);
    return user;
}

// Delete users from each friend's list
function deleteFriends(userDeletingFriend, userGettingDeleted) {
    // Delete user for userDeletingFriend
    User.getUserById(userDeletingFriend)
    .then((user) => {
        arrays.remove(user.friends, userGettingDeleted);
        return User.save(user);
    })
    .catch((error) => {
        console.log('Fail to delete user: ' + error);
    });
    // Delete user for userGettingDeleted
    User.getUserById(userGettingDeleted)
    .then((user) => {
        arrays.remove(user.friends, userDeletingFriend);
        return User.save(user);
    })
    .catch((error) => {
        console.log('Fail to delete user: ' + error);
    });   
}

// generate encrypted password with salt
// asynchronous function after creating user
// function encryptPassword(password) {
//     let encrypt = new Promise((resolve, reject) => {
//         bcrypt.genSalt(10, (error, salt) => {
//             console.log('Salt Generated');
//             if (error) {
//                 reject(error);
//             }
//             bcrypt.hash(password, salt, (error, hash) => {
//                 if (error) {
//                     reject(error);
//                 }
//                 console.log('Encrypted');
//                 resolve(hash);
//             });
//         });
//     })
//     return encrypt;
// }

// Parse body into information block
function getInfo(body) {
    return {
        "name": body.name,
        "email": body.email,
        "firstname": body.firstname,
        'lastname': body.lastname,
        "username": body.username,
        "password": body.password
    };
}

// If log in information is valid, generate a token
// function sendToken(response, user) {
//     let token = jwt.sign(user.toJSON(), config.secret, {
//         expiresIn: 86400
//     });
//     responseUtil.contentCreated(response, 'JWT ' + token);
// }

// Compare password with encrypted password
// function comparePassword(password) {
//     let compareFunction = (user) => {
//         let compare = new Promise((resolve, reject) => {
//             bcrypt.compare(password, user.password, (error, isMatch) => {
//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 }
//                 else if (isMatch) {
//                     resolve(user);
//                 }
//                 else{
//                     reject('Password Mismatch');
//                 }
//             });
//         });
//         return compare;
//     }    
//     return compareFunction;
// }

// Decode function
function decode(token) {
    return jwt.verify(token.substring(4), config.secret);
}