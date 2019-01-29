const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Time = require('./models/Time');
const Follower = require('./models/Follower');

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mustacheExpress = require('mustache-express');
const expressHandlebars = require('express-handlebars');
const routes = require('./routes');

// the port to listen on. choose whatever you want!
const port = process.env.PORT || 3000;

// create a new express app:
const app = express();

// set up logging on our app:
app.use(morgan('dev'));

// turn JSON in requests to something we can work with:
app.use(bodyParser.json());

// let us set and retrieve cookies for user auth:
app.use(cookieParser());

// turn forms in requests to something we can work with:
app.use(bodyParser.urlencoded({ extended: true }));

// serve everything in the public directory:
app.use(express.static('public'));

// use the mustache for rendering views:
app.engine('html', expressHandlebars());
app.set('view engine', 'handlebars');

var followMember = function() {
  console.log('poop');
};

// create all the routes
app.use(routes);

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.connection
  .on('connected', () => {
    console.log(`Mongoose connection open on ${process.env.DATABASE}`);
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });

// start the app!
app.listen(port, function() {
  console.log('Server listening on http://localhost:' + port);
});
