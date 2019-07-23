const Review = require('../models/review_model');
const responseUtil = require('../utils/response');
// Post a review
module.exports.postReview = function(request, response) {
    // Post a new review
    let review = new Review(getInfo(request));
    Review.save(review)
    .then((result) => {
        responseUtil.contentCreated(response, result);
    })
    .catch((error) => {
        responseUtil.badRequest(response, error);
    });
}


// Collect information to create a review
function getInfo(request) {
    let userId = decode(request.headers['authorization'])._id;
    let review = {
        userId: userId,
        activityId: request.body.activityId,
        images: request.body.images,
        content: request.body.content
    };
    return review;
}

// decode token with jwt
function decode(token) {
    return jwt.verify(token.substring(4), config.secret);
}