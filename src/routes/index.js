'use strict';

var Config = require('../config/config.js')();
var Count = require('../models/count.js');

var Routes = function(app) {
  app.get('/', function(req, res) {
    res.render('index.jade', {
      title: Config.title + 'Home',
      count: Count.get()
    });
  });

  require('./count.js')(app);
};

module.exports = Routes;
