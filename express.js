// require dependencies and initialise express

const express = require('express');
const path    = require('path');
const favicon = require('serve-favicon');
const config  = require('./config/index.js');
const app     = express();

// serve static files and favicon
  
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.render('index')
});

app.listen(config.port, function () {
	console.log('  gulp framework running in ' + config.name + ' mode and listening on port: ' + config.port + '\n')
});

module.exports = app;