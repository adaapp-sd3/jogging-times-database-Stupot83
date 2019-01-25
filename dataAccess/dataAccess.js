const mongoose = require('mongoose');

module.exports.insertNew = (model, res, next, responseCallback) => {
    const callback = err => {
      if (err) {
        console.log({err});
          next(err);
      }
      else {
          responseCallback(model);
      }
  };
  model.save(callback);
  };

  module.exports.find = (model, searchObject, res, next, callback) => {
    model.find(searchObject, (err, data) => {
        if (err) {
            next(err);
        }
        else {
            callback(data);
        }
    });
};

module.exports.findOne = (model, searchObject, res, next, callback) => {
    model.findOne(searchObject, (err, data) => {
        if (err) {
            next(err);
        }
        else {
            callback(data);
        }
    });
  };

  module.exports.findOneAndModify = (model, searchObject, res, next, callback) => {
    model.findOne(searchObject, (err, data) => {
        if (err) {
            next(err);
        }
        else {
           callback(data);
        }
    });
};

module.exports.updateExisting = (mongooseObject, model, res, next, updateCallback) => {
    const callback = err => {
        if (err) {
            next(err);
        }
        else {
            updateCallback();
        }
    };
    mongooseObject.findByIdAndUpdate(model._id, model, callback);
};

  module.exports.delete = (model, searchObject, res, next, callback) => {
    model.remove(searchObject, err => {
        if (err) {
            next(err);
        }
        else {
            callback(data);
        }
    });
  };
  