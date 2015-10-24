'use strict';

var Config = require('../config/config.js')();
var Owners = require('../models/owners.js');

var Routes = function(app) {
  app.get('/', function(req, res) {
    res.render('index.jade', {
      title: Config.title + 'Home'
    });
  });

  require('./owners.js')(app);
  require('./workers.js')(app);
};

module.exports = Routes;
