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

  module.exports.delete = (model, searchObject, res, next) => {
    model.remove(searchObject, err => {
        if (err) {
            next(err);
        }
        else {
            res.send(true);
        }
    });
  };
  