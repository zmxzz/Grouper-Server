const User = require('../models/user_model');
const Tweet = require('../models/tweet_model');

// Post a new twitter
module.exports.initTweet = function(body) {
    let info = getInfo(body);
    let tweet = new Tweet(info);
    return tweet;
}

function getInfo(body) {
    return  {
        "content": body.content,
        ""
    }   
}