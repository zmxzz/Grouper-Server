const User = require('../models/user_model');

class DatabaseCache {}

DatabaseCache.saveUserList = [];
DatabaseCache.hasSetTimeoutForSaveUser = false;
DatabaseCache.unencryptedUserList = [];
DatabaseCache.hasSetTimeoutForEncryptUser = false;

module.exports.addSaveUser = function(user) {
    DatabaseCache.saveUserList.push(user);
};

module.exports.addUnencryptedUser = function(user) {
    DatabaseCache.unencryptedUserList.push(user);
};

module.exports.getSaveUserList = function() {
    return DatabaseCache.saveUserList;
};

module.exports.getUnencryptedUserList = function() {
    return DatabaseCache.unencryptedUserList;
};

module.exports.hasSetTimeoutForSaveUser = function() {
    return DatabaseCache.hasSetTimeoutForSaveUser;
};

module.exports.hasSetTimeoutForEncryptUser = function() {
    return DatabaseCache.hasSetTimeoutForEncryptUser;
};

module.exports.setTimeoutForSaveUserList = function(callback) {
    DatabaseCache.hasSetTimeoutForSaveUser = true;
    console.log('Saving');
    setTimeout(() => {
        DatabaseCache.hasSetTimeoutForSaveUser = false;
        callback();
    }, 10000);
};

module.exports.setTimeoutForEncryptAndSave = function(callback) {
    DatabaseCache.hasSetTimeoutForEncryptUser = true;
    console.log('Encrypting');
    setTimeout(() => {
        console.log('Start Encrypting');
        DatabaseCache.hasSetTimeoutForEncryptUser = false;
        callback();
    }, 1000);
};

module.exports.resetSaveUserList = function() {
    DatabaseCache.saveUserList = [];
};

module.exports.resetUnencryptedUserList = function() {
    DatabaseCache.unencryptedUserList = [];
};