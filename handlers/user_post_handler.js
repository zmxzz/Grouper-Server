const bcrypt = require('bcryptjs');
const User = require('../models/user_model');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const arrays = require('../utils/array');

// Initialize new user
module.exports.initUser = function(body) {
    let info = getInfo(body);
    let user = new User(info);
    return user;
}

// Add new user to database
module.exports.register = function(user, res) {
    // Encrypt password -> Register
    encryptPassword(user.password)
    .then((hash) => {
        user.password = hash;
        return User.register(user);
    })
    .then(resolveWithSuccessStatus(res))
    .catch(rejectWithFailStatus(res));
}

// Authenticate user with given username and password
module.exports.authenticate = function(user, res) {
    let username = user.username;
    let password = user.password;
    User.getUserByUsername(username)
    .then(comparePassword(password))
    .then((user) => sendToken(res, user))
    .catch((err) => {
        rejectWithFailStatus(res)(err);
    })
}

// Follow the given userId
module.exports.follow = function(request, response) {
    let username = decode(request.headers['authorization']).username;
    let followId = request.body.followId + '';
    User.getUserByUsername(username)
    .then((user) => {
        return addFollowing(user, followId);
    })
    .then(User.save)
    .then((user) => {
        return addFollower(user, followId);
    })
    .then(User.save)
    .then((result) => { resolveWithSuccessStatus(response)(result); })
    .catch((error) => { 
         if (error === 400) {
            rejectWithFailStatus(response)('User Already Followed');
         }
         else {
            rejectWithNotFoundStatus(response)('User Not Found');
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
           rejectWithFailStatus(response)('Bad Request');
        }
        else {
           rejectWithNotFoundStatus(response)('User Not Found');
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

// general resolve and reject function
function generalResolve(res) {
    console.log(res);
}


function generalReject(err) {
    console.log(err);
    throw err;
}

// return resolve function handling http status code
function resolveWithSuccessStatus(response) {
    return function(result) {
        return response.status(200).json({
            success: true,
            result: result
        });
    }
}

// return rejct function handling http status code
function rejectWithFailStatus(response) {
    return function(error) {
        return response.status(400).json({
            success: false,
            error: error
        });
    }
}

// return reject function handling not found code
function rejectWithNotFoundStatus(response) {
    return function(error) {
        return response.status(404).json({
            success: false,
            error: error
        });
    }
}

// generate encrypted password with salt
// asynchronous function after creating user
function encryptPassword(password) {
    let encrypt = new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
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
function sendToken(res, user) {
    let token = jwt.sign(user.toJSON(), config.secret, {
        expiresIn: 43200
    });
    res.status(200).json({
        success: true,
        token: 'JWT ' + token
    });
}

// Compare password with encrypted password
function comparePassword(password) {
    let compareFunction = (user) => {
        let compare = new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.log(err);
                    reject(err);
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