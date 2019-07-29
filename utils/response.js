const createdResponse = require('../interface/response');
module.exports.contentFound = function(response, result) {
    if (typeof(result) !== 'object') {
        response.status(200).send(result);
    }
    else {
        response.status(200).json(result);
    }
};

module.exports.contentCreated = function(response, result) {
    return response.status(201).send(result);
};

module.exports.requestAccepted = function(response, result) {
    return response.status(202).send(result);
};

module.exports.noContent = function(response) {
    return response.status(204).end();
};

module.exports.forbidden = function(response, error) {
    return response.status(403).send(error);
}

module.exports.contentNotFound = function(response, error) {
    return response.status(404).send(error);
};

module.exports.badRequest = function(response, error) {
    return response.status(400).send(error);
};

module.exports.internalServerError = function(response, error) {
    return response.status(500).send(error);
};