const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    friendRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }],
    bio: {
        type: String
    },
    location: {
        type: String
    },
    website: {
        type: String
    },
    birthDay: {
        type: Date
    }
});

// Export User model
const User = module.exports = mongoose.model('User', UserSchema);

// Register user to database
module.exports.register = function(user) {
    let register = new Promise((resolve, reject) => {
        user.save((error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        })
    });
    return register;
}

// save user to database
module.exports.save = function(user) {
    let save = new Promise((resolve, reject) => {
        user.save((error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        })
    });
    return save;
};

// Find user by username
module.exports.getUserByUsername = function(username) {
    const query = { username: username };
    let find = new Promise((resolve, reject) => {
        User.findOne(query, (error, result) => {
            if (error) {
                reject(error);
            }
            else if (result === null) {
                reject('User not found');
            }
            else {
                resolve(result);
            }
        });
    });
    return find;
}

// Find user by id
module.exports.getUserById = function(id) {
    const query = { _id: id };
    let find = new Promise((resolve, reject) => {
        User.findOne(query, (error, result) => {
            if (error) {
                reject(error);
            }
            else if (result === null) {
                reject('User not found');
            }
            else {
                resolve(result);
            }
        });
    });
    return find;
};

// Add all the users into database
module.exports.saveAll = function(userList) {
    let saveAll = new Promise((resolve, reject) => {
        User.insertMany(userList, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
    return saveAll;
}