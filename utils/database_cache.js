const User = require('../models/user_model');

module.exports.DatabaseCache = class DatabaseCache {
    constructor() {
        this.userList = [];
        this.hasSetTimeout = false;
    }

    saveUser(user) {
        this.userList.push(user);
        if (!this.hasSetTimeout) {
            this.hasSetTimeout = true;
            setTimeout(() => {
                this.hasSetTimeout = false;
                User.saveAll([...this.userList]);
                this.userList = [];
            }, 10000);
        }
    }
}
