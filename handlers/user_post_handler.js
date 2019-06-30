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
        return User.register(user);
    })
    .then((user) => {
        // Successfully created, respond with 200 status code
        return responseUtil.contentCreated(response, user);
    })
    .catch((error) => {
        // Bad request, respond with 400 status code
        responseUtil.badRequest(resp, error);
    });
}

// Authenticate user with given username and password
module.exports.authenticate = function(user, response) {
    let username = user.username;
    let password = user.password;
    // Get user -> encrypt password -> compare
    User.getUserByUsername(username)
    .then(comparePassword(password))
    .then((user) => sendToken(response, user))
    .catch((error) => {
        responseUtil.badRequest(error);
    });
}

// Follow the given userId
module.exports.follow = function(request, response) {
    let username = decode(request.headers['authorization']).username;
    let followId = request.body.followId + '';
    // 
    User.getUserByUsername(username)
    .then((user) => {
        return addFollowing(user, followId);
    })
    .then(User.save)
    .then((user) => {
        return addFollower(user, followId);
    })
    .then(User.save)
    .then((result) => { 
        return responseUtil.noContent(response, result);
     })
    .catch((error) => { 
         if (error === 400) {
            return responseUtil.badRequest(response, error);
         }
         else {
            return responseUtil.contentFound(response, 'User Not Found');
         }
    });
}

// Unfollow
module.exports.unfollow = function(request, response) {
    // Get follower based on username
    // Get followee based on _id in the body
    let username = decode(request.headers['authorization']).username;
    let unfollowId = request.body.unfollowId + '';
    User.getUserByUsername(username)
    .then((user) => {
        return removeFollowing(user, unfollowId);
    })
    .then(User.save)
    .then((user) => {
        return removeFollower(user, unfollowId);
    })
    .then(User.save)
    .then((result) => { resolveWithSuccessStatus(response)(result); })
    .catch((error) => { 
        if (error === 400) {
            responseUtil.badRequest(response, 'Bad Request');
        }
        else {
           responseUtil.contentNotFound(response, 'User Not Found');
        }
   });
}

// Add followee to follower.following list
// Add follower to followee.follower list
// Remove follower from followee.follower
// Remove followee from follower.following
// ---------------------------------------------------------------------------------
function addFollowing(user, followId) {
    let addFollowing = new Promise((resolve, reject) => {
        if (user.following.includes(followId) || user._id + '' === followId) {
            reject(400);
        }
        user.following.push(followId);
        resolve(user);
    });
    return addFollowing;
}

function addFollower(user, followId) {
    let addFollower = new Promise((resolve, reject) => {
        User.getUserById(followId)
        .then((followUser) => {
            followUser.follower.push(user._id);
            resolve(followUser);
        })
        .catch((error) => { reject(error) });
    });
    return addFollower;
}

function removeFollowing(user, unfollowId) {
    let removeFollowing = new Promise((resolve, reject) => {
        if (!user.following.includes(unfollowId)) {
            console.log('not following id');
            reject(400);
        }
        arrays.remove(user.following, unfollowId);
        resolve(user);
    });
    return removeFollowing;
}

function removeFollower(user, unfollowId) {
    let removeFollower = new Promise((resolve, reject) => {
        User.getUserById(unfollowId)
        .then((followUser) => {
            arrays.remove(followUser.follower, user._id + '');
            resolve(followUser);
        })
        .catch((error) => {
            console.log(error);
            reject(error);
        });
    });
    return removeFollower;
}
// ---------------------------------------------------------------------------------

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
        expiresIn: 43200
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