
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , jsPipelineConf = require('./assets/javascripts/pipeline.json')
  , cssPipelineConf = require('./assets/stylesheets/pipeline.json');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('root', __dirname);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// helpers
app.locals.javascripts = function() {
  var toReturn = "";
  for (var key in jsPipelineConf) {
    for (var i = 0; i < jsPipelineConf[key].length; i++) {
      if (i !== 0) { toReturn += '\n    '; }
      toReturn += '<script src="/assets/' + jsPipelineConf[key][i] + '"></script>';
    }
  }
  return toReturn;
};

app.locals.stylesheets = function() {
  var toReturn = "";
  for (var key in cssPipelineConf) {
    for (var i = 0; i < cssPipelineConf[key].length; i++) {
      if (i !== 0) { toReturn += '\n    '; }
      toReturn += '<link rel="stylesheet" href="/assets/' + cssPipelineConf[key][i] + '">';
    }
  }
  return toReturn;
};

// controllers
var assets = require('./routes/assets')(app);

// routes
app.get('/', routes.index);
app.get('/users', user.list);
app.get(/^\/assets\/(.+)/, assets);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
