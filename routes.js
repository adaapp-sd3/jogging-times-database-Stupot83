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
  var searchObject = {
    _id: req.cookies.userId
  };

  DataAccess.findOne(User, searchObject, res, next, (loggedInUser) => {
    var searchObject = {
      timeId: req.params.timeId,
    };

    DataAccess.find(Time, searchObject, res, next, (times) => {
      console.log({
        loggedInUser,
        times
      });
      res.render('list-times.html', {
        user: loggedInUser,
        times: times
      });
    });
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

  var searchObject = {
    _id: req.cookies.userId
  };

  DataAccess.findOne(User, searchObject, res, next, (loggedInUser) => {
    userId = loggedInUser._id;

    var time = new Time();
    time.startTime = form.startTime;
    time.distance = form.distance;
    time.duration = form.duration;
    time.userId = userId;

    DataAccess.insertNew(time, res, next, (data) => {
      res.cookie('timeId', data.id);
      res.redirect('/times');
    });
  });
});

// show the edit time form for a specific time
routes.get('/times/:id', (req, res, next) => {

  var searchObject = {
    _id: req.cookies.userId
  };

  DataAccess.findOne(User, searchObject, res, next, (loggedInUser) => {

    var searchObject = {
      timeId: req.params.timeId
    };

    DataAccess.findOne(Time, searchObject, res, next, (times) => {

      res.render('edit-time.html', {
        user: loggedInUser,
        times: times
      });
    });
  });
});

// handle the edit time form
routes.post('/times/_id', (req, res, next) => {
  var form = req.body;

  var searchObject = {
    timeId: req.params.timeId
  };

  DataAccess.findOneAndModify(Time, searchObject, res, next, (times) => {

    res.redirect('/times');
  });
});

routes.get('/times/_id/delete', (req, res) => {

  var searchObject = {
    timeId: req.params.timeId
  };

  DataAccess.delete(Time, searchObject, res, next, (times) => {

  });

  res.redirect('/times');
});

module.exports = routes;