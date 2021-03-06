var express = require('express'), mongoose = require('mongoose');
mongoose.Promise = require('bluebird');  mongoose.plugin(schema => { schema.options.usePushEach = true });
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'),  Trilho = require('./models/trilho'), Canal = require('./models/CanalModel');
var Feed = require('./models/FeedModel');

var index = require('./routes/index');
var users = require('./routes/api/users'), trilhos = require('./routes/api/trilhos'), canais = require('./routes/api/canais')
,  feeds = require('./routes/api/feeds'),  auth = require('./routes/api/auth');
var trilhoRoutes = require("./routes/trilhos");

var app = express();
mongoose.Promise = global.Promise;
//var url =  process.env.DATABASEURL || "mongodb://localhost/Trails4Health"
//var url =  process.env.DATABASEURL || "mongodb://sa:user@ds159509.mlab.com:59509/trails4health"
var url =  process.env.DATABASEURL || "mongodb://sa:user@ds115740.mlab.com:15740/trails4health_dev"
mongoose.connect(url); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/api/users', users);
app.use('/api/canais', canais);
app.use('/api/feeds', feeds);
app.use('/api/trilhos',trilhos);
app.use('/api/auth', auth);



//var routes = require('./routes/pontosMonitorizados'); //importing route
//routes(app); //register the route
/* app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
}); */

app.use("/trilhos", trilhoRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('partials/footer');
});

module.exports = app;
