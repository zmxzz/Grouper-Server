const User = require('../models/user_model');

module.exports.DatabaseCache = class DatabaseCache {
    constructor() {
        this.userList = [];
    }

    saveUser(user) {
        this.userList.push(user);
        if (this.userList.length === 1000) {
            User.saveAll(this.userList)
            .catch((error) => { console.log(error); });
        }
    }
}