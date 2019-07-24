const bcrypt = require('bcryptjs');
const User = require('../models/user_model');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const arrays = require('../utils/array');
const responseUtil = require('../utils/response');

// Initialize new user
module.exports.initUser = function(body) {
    let info = getInfo(body);
    let user = new User(info);
    return user;
}

// Add new user to database
module.exports.register = function(user, response) {
    // Encrypt password -> Register
    encryptPassword(user.password)
    .then((hash) => {
        // Set user's password as hash, then save it to database
        user.password = hash;
        // Successfully created, respond with 200 status code
        responseUtil.contentCreated(response, user);
        User.register(user);
    })
    .catch((error) => {
        // Bad request, respond with 400 status code
        console.log(error);
        responseUtil.badRequest(response, error);
    });
};

// Authenticate user with given username and password
module.exports.authenticate = function(user, response) {
    let username = user.username;
    let password = user.password;
    // Get user -> encrypt password -> compare
    User.getUserByUsername(username)
    .then(comparePassword(password))
    .then((user) => sendToken(response, user))
    .catch((error) => {
        responseUtil.badRequest(response, error);
    });
};

// Send request to add friend
module.exports.sendFriendRequest = function(request, response) {
    // Ids of two users
    let userSendingRequest = decode(request.headers['authorization'])._id;
    let userGettingRequest = request.body.userId;
    // Get user -> add request to request list -> save
    User.getUserById(userGettingRequest)
    .then((user) => {
        user.friendRequests.push(userSendingRequest);
        return User.save(user);
    })
    .then((result) => {
        return responseUtil.requestAccepted(response, result);
    })
    .catch((error) => {
        return responseUtil.badRequest(response, error);
    });
};

// Accept request to add friend
module.exports.acceptFriendRequest = function(request, response) {
    // Ids of two users
    let userAcceptingRequest = decode(request.headers['authorization'])._id;
    let userToBeAdded = request.body.userId;
    // Get user -> add friend to both -> save
    User.getUserById(userAcceptingRequest)
    .then((user) => {
        if (user.friendRequests.includes(userToBeAdded) && !user.friends.includes(userToBeAdded)) {
            arrays.removeAll(user.friendRequests, userToBeAdded);
            addFriend(userAcceptingRequest, userToBeAdded);
            return User.save(user);
        }
        else {
            // If the user is not being asked, he has no right to add friend
            return Promise.resolve(null);
        }
    })
    .then((result) => {
        // if result is null, respond with forbidden, otherwise, respond with user
        if (result === null) {
            responseUtil.forbidden(response, 'No access right');
        }
        else {
            responseUtil.requestAccepted(response, result);
        }
    })
    .catch((error) => {
        responseUtil.badRequest(response, error);
    });
};

// Unfriend a user
module.exports.unfriend = function(request, response) {
    let userDeletingFriend = decode(request.headers['authorization'])._id;
    let userGettingDeleted = request.body.userId;
    // Get userDeletingFriend -> check if target is in the friend list -> delete user from both sides
    User.getUserById(userDeletingFriend)
    .then((user) => {
        if (user.friends.includes(userGettingDeleted)) {
            deleteFriends(userDeletingFriend, userGettingDeleted);
            responseUtil.requestAccepted(response, user);
        }
        else {
            responseUtil.forbidden(response, 'User is not friend');
        }
    })
    .catch((error) => {
        responseUtil.badRequest(response, error);
    });
};

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

// parameters: two ids of each user
function addFriend(userAcceptingRequest, userToBeAdded) {
    User.getUserById(userAcceptingRequest)
    .then((user) => {
        user.friends.push(userToBeAdded);
        return User.save(user);
    })
    .catch((error) => {
        console.log(error);
    });
    User.getUserById(userToBeAdded)
    .then((user) => {
        user.friends.push(userAcceptingRequest);
        return User.save(user);
    })
    .catch((error) => {
        console.log(error);
    });
}

// generate encrypted password with salt
// asynchronous function after creating user
function encryptPassword(password) {
    let encrypt = new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (error, salt) => {
            if (error) {
                reject(error);
            }
            bcrypt.hash(password, salt, (error, hash) => {
                if (error) {
                    reject(error);
                }
                resolve(hash);
            });
        });
    })
    return encrypt;
}

// Parse body into information block
function getInfo(body) {
    return {
        "name": body.name,
        "email": body.email,
        "username": body.username,
        "password": body.password
    };
}

// If log in information is valid, generate a token
function sendToken(response, user) {
    let token = jwt.sign(user.toJSON(), config.secret, {
        expiresIn: 86400
    });
    responseUtil.contentCreated(response, 'JWT ' + token);
}

// Compare password with encrypted password
function comparePassword(password) {
    let compareFunction = (user) => {
        let compare = new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (error, isMatch) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                else if (isMatch) {
                    resolve(user);
                }
                else{
                    reject('Password Mismatch');
                }
            });
        });
        return compare;
    }    
    return compareFunction;
}

// Decode function
function decode(token) {
    return jwt.verify(token.substring(4), config.secret);
}