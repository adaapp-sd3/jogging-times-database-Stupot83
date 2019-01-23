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
  
  // class User {
  //   static insert(name, email, passwordHash) {
  //     // run the insert query
  //     var info = insertUser.run(name, email, passwordHash);
  
  //     // check what the newly inserted row id is
  //     var userId = info.lastInsertRowid;
  
  //     return userId;
  //   }
  
  //   static findById(id) {
  //     var row = selectUserById.get(id);
  
  //     if (row) {
  //       return new User(row);
  //     } else {
  //       return null;
  //     }
  //   }
  
  //   static findByEmail(email) {
  //     var row = selectUserByEmail.get(email);
  
  //     if (row) {
  //       return new User(row);
  //     } else {
  //       return null;
  //     }
  //   }
  
  //   static delete(id) {
  //     deleteUserById.run(id);
  //   }
  // }
  
  // // get the queries ready - note the ? placeholders
  // var insertUser = db.prepare(
  //   'INSERT INTO user (name, email, password_hash) VALUES (?, ?, ?)'
  // );
  
  // var selectUserById = db.prepare('SELECT * FROM user WHERE id = ?');
  // var deleteUserById = db.prepare('DELETE FROM user WHERE id = ?')
  
  // var selectUserByEmail = db.prepare('SELECT * FROM user WHERE email = ?');
  