const createdResponse = require('../interface/response');
module.exports.contentFound = function(response, result) {
    return response.status(200).json(createdResponse.createResult(true, result));
};

module.exports.contentCreated = function(response, result) {
    return response.status(201).json(createdResponse.createResult(true, result));
};

module.exports.requestAccepted = function(response, result) {
    return response.status(202).json(createdResponse.createResult(true, result));
};

module.exports.noContent = function(response) {
    return response.status(204).end();
};

module.exports.forbidden = function(response, error) {
    return response.status(403).json(createdResponse.createError(false, error));
}

module.exports.contentNotFound = function(response, error) {
    return response.status(404).json(createdResponse.createError(false, error));
};

module.exports.badRequest = function(response, error) {
    return response.status(400).json(createdResponse.createError(false, error));
};

module.exports.internalServerError = function(response, error) {
    return response.status(500).json(createdResponse.createError(false, error));
};