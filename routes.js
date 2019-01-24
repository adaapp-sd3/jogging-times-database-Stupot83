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

// handle signing out
routes.get('/sign-out', (req, res) => {
  // clear the user id cookie
  res.clearCookie('userId');

  // redirect to the login screen
  res.redirect('/sign-in');
});

// list all job times
routes.get('/times', (req, res, next) => {

  var searchObject = {
    _id: req.cookies.userId
  };

  DataAccess.findOne(User, searchObject, res, next, (loggedInUser) => {

    res.render('list-times.html', {
      user: loggedInUser,
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

  var time = new Time();
  time.startTime = form.startTime;
  time.distance = form.distance;
  time.duration = form.duration;

  DataAccess.insertNew(time, res, next, (data) => {
    res.cookie('userId', data.id);
    res.redirect('/times');
  });
  // TODO: save the new time
});

// show the edit time form for a specific time
routes.get('/times/_id', (req, res, next) => {

  var searchObject = {
    _id: req.cookies.timeId
  };

  DataAccess.findOne(Time, searchObject, res, next, (loggedInUser) => {

  // var timeId = req.params.id;
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
});

// handle the edit time form
routes.post('/times/_id', (req, res, next) => {

  var form = req.body;

  var searchObject = {
    _id: req.cookies.timeId
  };

  DataAccess.findOne(Time, searchObject, res, next, (loggedInUser) => {

  console.log('edit time', {
    timeId: timeId,
    form: form
  });

  // TODO: edit the time in the db

  res.redirect('/times');
});
});

// handle deleteing the time
routes.get('/times/_id/delete', (req, res) => {

  var searchObject = {
    _id: req.cookies.timeId
  };

  DataAccess.delete(time, searchObject, res, next, (data) => {

  });

  // var timeId = req.params.id;
  console.log('delete time', timeId);

  // TODO: delete the time

  res.redirect('/times');
});

module.exports = routes;