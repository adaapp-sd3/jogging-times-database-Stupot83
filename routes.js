const express = require('express');
const bcrypt = require('bcryptjs');
const routes = new express.Router();
const saltRounds = 10;
const mongoose = require('mongoose');
const User = require('./models/User');
const Time = require('./models/Time');
const DataAccess = require('./dataAccess/dataAccess');

function formatDateForHTML(date) {
  return new Date(date).toISOString().slice(0, -8);
}

routes.get('/', (req, res) => {
  if (req.cookies.userId) {
    res.redirect('/times');
  } else {
    res.redirect('/sign-in');
  }
});

routes.get('/create-account', (req, res) => {
  res.render('create-account.html');
});

routes.post('/create-account', (req, res, next) => {
  var form = req.body;
  console.log({form});
  var passwordHash = bcrypt.hashSync(form.password, saltRounds);

  var user = new User();
  user.name = form.name;
  user.email = form.email;
  user.password_hash = passwordHash;

  DataAccess.insertNew(user, res, next, (data) => {
    res.cookie('userId', data.id);
    res.redirect('/times');
  });
});

routes.get('/sign-in', (req, res) => {
  res.render('sign-in.html');
});

routes.post('/sign-in', (req, res, next) => {
  var form = req.body;

  var searchObject = {
    email: form.email
  };

  DataAccess.findOne(User, searchObject, res, next, (user) => {
    if (user) {
      console.log({
        form,
        user
      });
      if (bcrypt.compareSync(form.password, user.password_hash)) {
        res.cookie('userId', user.id);
        res.redirect('/times');
      } else {
        res.render('sign-in.html', {
          errorMessage: 'Email address and password do not match'
        });
      }
    } else {
      res.render('sign-in.html', {
        errorMessage: 'No user with that email exists'
      });
    }
  });
});

routes.get('/sign-out', (req, res) => {
  res.clearCookie('userId');
  res.redirect('/sign-in');
});

// list all job times
routes.get('/times', (req, res, next) => {
  var userSearchObject = {
    _id: req.cookies.userId
  };

  DataAccess.findOne(User, userSearchObject, res, next, (loggedInUser) => {
    var timeSearchObject = {
      userId: req.cookies.userId
    };

    DataAccess.find(Time, timeSearchObject, res, next, (times) => {

      res.render('list-times.html', {
        user: loggedInUser,
        times: times
      });
    });
  });
});

routes.get('/user', (req, res, next) => {
var form = req.body;
console.log({form});

  var userSearchObject = {
    email: form.email
  };

  DataAccess.findOne(User, userSearchObject, res, next, (loggedInUser) => {
    console.log({loggedInUser});
    res.send(loggedInUser);
      });
    });

// show the create time form
routes.get('/times/new', (req, res, next) => {
  var searchObject = {
    _id: req.cookies.userId
  };

  DataAccess.findOne(User, searchObject, res, next, (loggedInUser) => {

    res.render('create-time.html', {
      user: loggedInUser
    });
  });
});

// handle the create time form
routes.post('/times/new', (req, res, next) => {
  var form = req.body;
  var userId;

  console.log({form});

  var searchObject = {
    _id: req.cookies.userId
  };

  console.log({req});

  DataAccess.findOne(User, searchObject, res, next, (loggedInUser) => {
    userId = loggedInUser._id;

    var time = new Time();
    time.startTime = form.startTime;
    time.distance = form.distance;
    time.duration = form.duration;
    time.userId = userId;

    DataAccess.insertNew(time, res, next, () => {
      res.redirect('/times');
    });
  });
});

// show the edit time form for a specific time
routes.get('/times/:id', (req, res, next) => {

  var userSearchObject = {
    _id: req.cookies.userId
  };

  DataAccess.findOne(User, userSearchObject, res, next, (loggedInUser) => {

    var timeSearchObject = {
      _id: req.params.id
    };

    DataAccess.findOne(Time, timeSearchObject, res, next, (time) => {

      var formattedStartTime = formatDateForHTML(time.startTime);

      res.render('edit-time.html', {
        user: loggedInUser,
        time: time,
        formattedStartTime: formattedStartTime
      });
    });
  });
});

// handle the edit time form
routes.post('/times/:id', (req, res, next) => {
  var form = req.body;

  var searchObject = {
    _id: req.params.id
  };

  DataAccess.findOneAndModify(Time, searchObject, res, next, (time) => {
    time.startTime = form.startTime;
    time.distance = form.distance;
    time.duration = form.duration;

    DataAccess.updateExisting(Time, time, res, next, () => {
      res.redirect('/times');
    });
  });
});

routes.get('/times/:id/delete', (req, res, next) => {

  var searchObject = {
    _id: req.params.id
  };

  DataAccess.deleteOne(Time, searchObject, res, next, () => {
    res.redirect('/times');
  });
});

routes.get('/delete-account', (req, res, next) => {

  var userSearchObject = {
    _id: req.cookies.userId
  };

  DataAccess.deleteOne(User, userSearchObject, res, next, () => {

    var timeSearchObject = {
      userId: req.cookies.userId
    };

    DataAccess.deleteMany(Time, timeSearchObject, res, next, () => {
      res.redirect('/sign-in');
    });
  });
});

module.exports = routes;