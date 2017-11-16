var express = require('express');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var models = require('./models');
var routes = require('./routes');

const app = express();

app.engine('html', nunjucks.render);
app.set('view engine', 'html');
// nunjucks.configure('views', {noCache: true});

// Markdown section's nunjucks AutoEscapeExtension:
// if you're not already, make sure to capture the return value of nunjucks.configure:
var env = nunjucks.configure('views', {noCache: true});
// and then include these two lines of code to add the extension:
var AutoEscapeExtension = require("nunjucks-autoescape")(nunjucks);
env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '/public'))); // always use b/c parses path but requires path module
// is the same as, since path has been required:
app.use(express.static(__dirname + '/node_modules'));

app.use('/', routes);

models.db.sync({force: true})
.then(function() {
  app.listen(1337, function() {
    console.log('The collective is listening on port 1337:');
  });
})
.catch(console.error); // Should it be .catch(console.error); instead of CB?

app.use(function (err, req, res, next) {
  //if there is no error.status already set, we are defaulting to 500
  err.status = err.status || 500;
  err.message = err.message || 'Internal Error';
  res.render('error', {err});
});

