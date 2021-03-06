var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var csrf = require('csurf');
const MongoStore = require('connect-mongo')(session);


var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var apiRouter = require('./api/api');

var Category = require('./models/category');

var app = express();

mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true } );
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');


app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({secret: 'mysecretsession', resave: false, saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie:{maxAge:120 * 60 * 100}
}));
app.use(csrf());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//Adding a middleware that will be executed in all request
app.use(function(req, res, next){
  res.locals.userRegistered = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals._token = req.csrfToken(); // https://stackoverflow.com/questions/20484649/csrf-token-not-working-when-submitting-form-in-express
  next();
});

//Adding a Category middleware
app.use(function (req, res, next) {
  Category.find({}, function(err, categories){
  if(err) return next(err);
  res.locals.categories = categories;
  next();
  });
});

app.use('/user', userRouter);
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/api', apiRouter);


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
