const mongoose = require('mongoose');

module.exports.insertNew = (model, res, next, responseCallback, errorCallback) => {
    const callback = err => {
        if (err) {
            errorCallback(err);
        } else {
            responseCallback(model);
        }
    };
    model.save(callback);
};

module.exports.find = (model, searchObject, res, next, callback) => {
    model.find(searchObject, (err, data) => {
        if (err) {
            next(err);
        } else {
            callback(data);
        }
    });
};

module.exports.findOne = (model, searchObject, res, next, callback) => {
    model.findOne(searchObject, (err, data) => {
        if (err) {
            next(err);
        } else {
            callback(data);
        }
    });
};

module.exports.findOneAndModify = (model, searchObject, res, next, callback) => {
    model.findOne(searchObject, (err, data) => {
        if (err) {
            next(err);
        } else {
            callback(data);
        }
    });
};

module.exports.updateExisting = (mongooseObject, model, res, next, updateCallback, errorCallback) => {
    const callback = err => {
        if (err) {
            errorCallback(err);
        } else {
            updateCallback();
        }
    };
    mongooseObject.findByIdAndUpdate(model._id, model, callback);
};

module.exports.deleteOne = (model, searchObject, res, next, callback) => {
    model.deleteOne(searchObject, err => {
        if (err) {
            next(err);
        } else {
            callback();
        }
    });
};

module.exports.deleteMany = (model, searchObject, res, next, callback) => {
    model.deleteMany(searchObject, err => {
        if (err) {
            next(err);
        } else {
            callback();
        }
    });
};