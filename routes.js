const express = require('express');
const bcrypt = require('bcryptjs');
const routes = new express.Router();
const saltRounds = 10;
const mongoose = require('mongoose');
const User = require('./models/User');
const DataAccess = require('./models/dataAccess');

function formatDateForHTML(date) {
  return new Date(date).toISOString().slice(0, -8);
}

routes.get('/', function (req, res) {
  if (req.cookies.userId) {
    res.redirect('/times');
  } else {
    res.redirect('/sign-in');
  }
});

routes.get('/create-account', function (req, res) {
  res.render('create-account.html');
});

routes.post('/create-account', function (req, res, next) {
  var form = req.body;
  // TODO: add some validation in here to check
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

routes.get('/sign-in', function (req, res) {
  res.render('sign-in.html');
});

routes.post('/sign-in', function (req, res, next) {
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

// handle signing out
routes.get('/sign-out', function (req, res) {
  // clear the user id cookie
  res.clearCookie('userId');

  // redirect to the login screen
  res.redirect('/sign-in');
});

// list all job times
routes.get('/times', function (req, res, next) {

  var searchObject = {
    _id: req.cookies.userId
  };

  DataAccess.findOne(User, searchObject, res, next, (loggedInUser) => {
    var totalDistance = 13.45;
    var avgSpeed = 5.42;
    var totalTime = 8.12322;

    res.render('list-times.html', {
      user: loggedInUser,
      stats: {
        totalDistance: totalDistance.toFixed(2),
        totalTime: totalTime.toFixed(2),
        avgSpeed: avgSpeed.toFixed(2)
      },

      // fake times: TODO: get the real jog times from the db
      times: [{
          id: 1,
          startTime: '4:36pm 1/11/18',
          duration: 12.23,
          distance: 65.43,
          avgSpeed: 5.34
        },
        {
          id: 2,
          startTime: '2:10pm 3/11/18',
          duration: 67.4,
          distance: 44.43,
          avgSpeed: 0.66
        },
        {
          id: 3,
          startTime: '3:10pm 4/11/18',
          duration: 67.4,
          distance: 44.43,
          avgSpeed: 0.66
        }
      ]
    });
  });
});

// show the create time form
routes.get('/times/new', function (req, res) {
  // this is hugely insecure. why?
  var loggedInUser = User.findById(req.cookies.userId);

  res.render('create-time.html', {
    user: loggedInUser
  });
});

// handle the create time form
routes.post('/times/new', function (req, res) {
  var form = req.body;

  console.log('create time', form);

  // TODO: save the new time

  res.redirect('/times');
});

// show the edit time form for a specific time
routes.get('/times/:id', function (req, res) {
  var timeId = req.params.id;
  console.log('get time', timeId);

  // TODO: get the real time for this id from the db
  var jogTime = {
    id: timeId,
    startTime: formatDateForHTML('2018-11-4 15:17'),
    duration: 67.4,
    distance: 44.43
  };

  res.render('edit-time.html', {
    time: jogTime
  });
});

// handle the edit time form
routes.post('/times/:id', function (req, res) {
  var timeId = req.params.id;
  var form = req.body;

  console.log('edit time', {
    timeId: timeId,
    form: form
  });

  // TODO: edit the time in the db

  res.redirect('/times');
});

// handle deleteing the time
routes.get('/times/:id/delete', function (req, res) {
  var timeId = req.params.id;
  console.log('delete time', timeId);

  // TODO: delete the time

  res.redirect('/times');
});

module.exports = routes;