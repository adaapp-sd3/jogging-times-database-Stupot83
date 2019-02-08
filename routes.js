const express = require('express');
const bcrypt = require('bcryptjs');
const routes = new express.Router();
const saltRounds = 10;
const User = require('./models/User');
const Time = require('./models/Time');
const Following = require('./models/Following');
const DataAccess = require('./dataAccess/dataAccess');

function formatDateForHTML(date) {
  return new Date(date).toISOString().slice(0, -8);
}

routes.get('/', (req, res) => {
  if (req.cookies.userId) {
    res.redirect('/user');
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

  if (form.password !== form.passwordConfirm) {
    res.render('create-account.html', {
      name: user.name,
      email: user.email,
      errorMessage: 'Password does not match'
    });
  } else {

    DataAccess.insertNew(user, res, next, (data) => {
      res.cookie('userId', data.id);
      res.redirect('/user');
    }, err => {
      res.render('create-account.html', {
        errorMessage: 'User already exists'
      });
    });
  }
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
        res.redirect('/user');
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

// user profile
routes.get('/user', (req, res, next) => {
  var userSearchObject = {
    _id: req.cookies.userId
  };

  DataAccess.findOne(User, userSearchObject, res, next, (loggedInUser) => {

    res.render('user-profile.html', {
      user: loggedInUser,
    });
  });
});

// list of jog times
routes.get('/times', (req, res, next) => {
  var userSearchObject = {
    _id: req.cookies.userId
  };

  DataAccess.findOne(User, userSearchObject, res, next, (loggedInUser) => {
    var timeSearchObject = {
      userId: req.cookies.userId
    };

    DataAccess.find(Time, timeSearchObject, res, next, (times) => {

      var totalDistance = times.reduce((previous, current) => previous + current.distance, 0);
      var totalTime = times.reduce((previous, current) => previous + current.duration, 0);
      var avgSpeed = totalDistance / totalTime;
      avgSpeed = avgSpeed || 0;

      res.render('times.html', {
        user: loggedInUser,
        stats: {
          totalDistance: parseFloat(totalDistance).toFixed(2),
          totalTime: parseFloat(totalTime).toFixed(2),
          avgSpeed: parseFloat(avgSpeed).toFixed(2)
        },
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
    time.distance = parseFloat(form.distance).toFixed(2);
    time.duration = parseFloat(form.duration).toFixed(2);
    time.userId = userId;

    DataAccess.insertNew(time, res, next, () => {
      res.redirect('/times');
    }, err => {
      res.render('create-time.html', {
        user: loggedInUser,
        errorMessage: 'A jog already exists with that startTime'
      });
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

  var userSearchObject = {
    _id: req.cookies.userId
  };

  DataAccess.findOne(User, userSearchObject, res, next, (loggedInUser) => {

    var searchObject = {
      _id: req.params.id
    };

    DataAccess.findOneAndModify(Time, searchObject, res, next, (time) => {

      var formattedStartTime = formatDateForHTML(time.startTime);

      time.startTime = form.startTime;
      time.distance = parseFloat(form.distance).toFixed(2);
      time.duration = parseFloat(form.duration).toFixed(2);

      DataAccess.updateExisting(Time, time, res, next, () => {
        res.redirect('/times');
      }, err => {
        res.render('edit-time.html', {
          user: loggedInUser,
          time: time,
          formattedStartTime: formattedStartTime,
          errorMessage: 'A jog already exists with that startTime'
        });
      });
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

routes.get('/edit-account', (req, res, next) => {
  var userSearchObject = {
    _id: req.cookies.userId
  };

  DataAccess.findOne(User, userSearchObject, res, next, (loggedInUser) => {

    res.render('edit-account.html', {
      user: loggedInUser,
    });
  });
});

routes.post('/edit-account', (req, res, next) => {

  var userSearchObject = {
    _id: req.cookies.userId
  };

  DataAccess.findOne(User, userSearchObject, res, next, (loggedInUser) => {

    var searchObject = {
      _id: req.cookies.userId
    };

    DataAccess.findOneAndModify(User, searchObject, res, next, (user) => {

      var form = req.body;
      var passwordHash = bcrypt.hashSync(form.password, saltRounds);

      user.name = form.name;
      user.email = form.email;
      user.password_hash = passwordHash;

      if (form.password !== form.passwordConfirm) {
        res.render('edit-account.html', {
          user: loggedInUser,
          name: user.name,
          email: user.email,
          errorMessage: 'Password does not match'
        });
      } else {

        DataAccess.updateExisting(User, user, res, next, () => {
          res.cookie('userId', user.id);
          res.redirect('/user');
        }, err => {
          res.render('edit-account.html', {
            user: loggedInUser,
            errorMessage: 'A user already exists with those details'
          });
        });
      }
    });
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
      res.clearCookie('userId');
      res.redirect('/sign-in');
    });
  });
});

routes.get('/members', (req, res, next) => {

  var userSearchObject = {
    _id: req.cookies.userId
  };

  DataAccess.findOne(User, userSearchObject, res, next, (loggedInUser) => {

    var followingSearchObject = {
      followerId: req.cookies.userId
    };

    DataAccess.find(Following, followingSearchObject, res, next, (peopleUserIsFollowing) => {

      var userIdsToFind = [];

      peopleUserIsFollowing.forEach((person) => {
        userIdsToFind.push(person.followingId);
      });

      var usersFollowingSearchObject = {
        _id: {
          $ne: req.cookies.userId,
          $nin: userIdsToFind
        }
      };

      DataAccess.find(User, usersFollowingSearchObject, res, next, (members) => {

        var followedAlreadySearchObject = {
          _id: {
            $in: userIdsToFind
          }
        };

        DataAccess.find(User, followedAlreadySearchObject, res, next, (following) => {
          res.render('members.html', {
            user: loggedInUser,
            members: members,
            following: following
          });
        });
      });
    });
  });
});

routes.get('/members/:id/follow', (req, res, next) => {

  var following = new Following();
  following.followingId = req.params.id;
  following.followerId = req.cookies.userId;


  DataAccess.insertNew(following, res, next, () => {
    res.redirect('/members');
  });
});

routes.get('/members/:id/unfollow', (req, res, next) => {

  var searchObject = {
    _id: req.params.id
  };

  DataAccess.findOne(User, searchObject, res, next, (userFollowed) => {

    var unfollowSearchObject = {
      followingId: userFollowed.id,
      followerId: req.cookies.userId
    };

    DataAccess.deleteOne(Following, unfollowSearchObject, res, next, () => {
      res.redirect('/members');
    });
  });
});

routes.get('/friends', (req, res, next) => {

  var userSearchObject = {
    _id: req.cookies.userId
  };

  DataAccess.findOne(User, userSearchObject, res, next, (loggedInUser) => {

    var followingSearchObject = {
      followerId: req.cookies.userId
    };

    DataAccess.find(Following, followingSearchObject, res, next, (peopleUserIsFollowing) => {

      var userIdsToFind = [];

      peopleUserIsFollowing.forEach((person) => {
        userIdsToFind.push(person.followingId);
      });

      var usersFollowingSearchObject = {
        _id: {
          $in: userIdsToFind
        }
      };

      DataAccess.find(User, usersFollowingSearchObject, res, next, (following) => {

        var followedSearchObject = {
          followingId: req.cookies.userId
        };

        DataAccess.find(Following, followedSearchObject, res, next, (peopleFollowingUser) => {

          var followIdsToFind = [];

          peopleFollowingUser.forEach((follow) => {
            followIdsToFind.push(follow.followerId);
          });

          var followedUserSearchObject = {
            _id: {
              $in: followIdsToFind
            }
          };

          DataAccess.find(User, followedUserSearchObject, res, next, (followed) => {

            res.render('friends.html', {
              user: loggedInUser,
              following: following,
              followed: followed
            });
          });
        });
      });
    });
  });
});

routes.get('/friends/:id/unfollow', (req, res, next) => {

  var searchObject = {
    _id: req.params.id
  };

  DataAccess.findOne(User, searchObject, res, next, (userFollowed) => {

    var unfollowSearchObject = {
      followingId: userFollowed.id,
      followerId: req.cookies.userId
    };

    DataAccess.deleteOne(Following, unfollowSearchObject, res, next, () => {
      res.redirect('/friends');
    });
  });
});

routes.get('/timeline', (req, res, next) => {

  var userSearchObject = {
    _id: req.cookies.userId
  };

  DataAccess.findOne(User, userSearchObject, res, next, (loggedInUser) => {

    var followingSearchObject = {
      followerId: req.cookies.userId
    };

    DataAccess.find(Following, followingSearchObject, res, next, (peopleUserIsFollowing) => {

      var userIdsToFind = [];

      peopleUserIsFollowing.forEach((person) => {
        userIdsToFind.push(person.followingId);
      });

      var usersFollowingSearchObject = {
        _id: {
          $in: userIdsToFind
        }
      };

      DataAccess.find(User, usersFollowingSearchObject, res, next, (followedUsers) => {

        var usersWithTimes = [];

        followedUsers.forEach((followedUser) => {
          var userWithTimes = {
            name: followedUser.name,
            times: [],
            userId: followedUser._id
          };

          var usersFollowingTimesSearchObject = {
            userId: followedUser._id
          };

          DataAccess.find(Time, usersFollowingTimesSearchObject, res, next, (userTimes) => {

            userTimes.forEach((userTime) => {
              userWithTimes.times.push(userTime);
            });

            usersWithTimes.push(userWithTimes);

            if (userWithTimes.times.length === userTimes.length &&
              usersWithTimes.length === followedUsers.length) {
              res.render('timeline.html', {
                user: loggedInUser,
                usersWithTimes: usersWithTimes
              });
            }
          });
        });
      });
    });
  });
});

routes.get('/ranking', (req, res, next) => {

  var userSearchObject = {
    _id: req.cookies.userId
  };

  DataAccess.findOne(User, userSearchObject, res, next, (loggedInUser) => {

    var followingSearchObject = {
      followerId: req.cookies.userId
    };

    DataAccess.find(Following, followingSearchObject, res, next, (peopleUserIsFollowing) => {

      var userIdsToFind = [];

      peopleUserIsFollowing.forEach((person) => {
        userIdsToFind.push(person.followingId);
      });

      var usersFollowingSearchObject = {
        _id: {
          $in: userIdsToFind
        }
      };

      DataAccess.find(User, usersFollowingSearchObject, res, next, (followedUsers) => {

        var usersWithTimes = [];

        followedUsers.forEach((followedUser) => {
          var userWithTimes = {
            name: followedUser.name,
            stats: {},
            userId: followedUser._id
          };

          var usersFollowingTimesSearchObject = {
            userId: followedUser._id
          };

          DataAccess.find(Time, usersFollowingTimesSearchObject, res, next, (userTimes) => {

            var totalDistance = userTimes.reduce((previous, current) => previous + current.distance, 0);
            var totalTime = userTimes.reduce((previous, current) => previous + current.duration, 0);
            var avgSpeed = totalDistance / totalTime;
            avgSpeed = avgSpeed || 0;

            userWithTimes.stats.totalDistance = parseFloat(totalDistance).toFixed(2);
            userWithTimes.stats.totalTime = parseFloat(totalTime).toFixed(2);
            userWithTimes.stats.avgSpeed = parseFloat(avgSpeed).toFixed(2);

            usersWithTimes.push(userWithTimes);

            var sortedByDistance = usersWithTimes.slice().sort((distanceA, distanceB) =>
              distanceB.stats.totalDistance - distanceA.stats.totalDistance);

            var sortedByTime = usersWithTimes.slice().sort((timeA, timeB) =>
              timeB.stats.totalTime - timeA.stats.totalTime);

            var sortedByAverage = usersWithTimes.slice().sort((avgSpeedA, avgSpeedB) =>
              avgSpeedB.stats.avgSpeed - avgSpeedA.stats.avgSpeed);

            if (usersWithTimes.length === followedUsers.length) {
              res.render('ranking.html', {
                user: loggedInUser,
                sortedByDistance: sortedByDistance,
                sortedByTime: sortedByTime,
                sortedByAverage: sortedByAverage,
              });
            }
          });
        });
      });
    });
  });
});

module.exports = routes;