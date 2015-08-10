var express = require('express'),
    routes = require('./routes'),
    mongoose = require('mongoose'), 
    bodyParser = require('body-parser'), 
    methodOverride = require('method-override'), 
    serveStatic = require('serve-static'), 
    firebase = require('firebase'),
    errorHandler = require('errorhandler');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://dev-user:napster@ds049631.mongolab.com:49631/heroku_app34474901');

var app = express();

// Configuration

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '100mb'}));
app.use(serveStatic(__dirname + '/public'));

// Routes

app.post('/data', routes.data);


// load errorHandler after routes

if (process.env.NODE_ENV !== "production") {
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
} else {
  app.use(errorHandler());
}


var port = process.env.PORT || 3005;

app.listen(port, function() {
  console.log('Express server listening on port %d in %s mode', port, app.settings.env);
});
