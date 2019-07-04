module.exports.createResult = function(success, result) {
    return {
        success: success,
        result: result
    };
};

module.exports.createError = function(success, error) {
    return error;
};