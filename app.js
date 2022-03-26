var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


// mongoose
const mongoose = require("mongoose");
// 1. set up connection to mongoDB
mongoose.connect("mongodb://localhost:27017/homeworkDB");
const User = require("./models/users-model");
const Group = require("./models/groups-model");
const Message = require("./models/messages-model");
const Event = require("./models/events-model");

// importing the routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var groupsRouter = require('./routes/groups');
var participantsRouter = require("./routes/participants");
var messagesRouter = require("./routes/messages");
var eventsRouter = require("./routes/events");


var app = express();

// timestamp
const time = require("express-timestamp");
app.use(time.init);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// using the routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/groups', groupsRouter);
app.use('/participants', participantsRouter);
app.use('/messages', messagesRouter);
app.use("/events", eventsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
