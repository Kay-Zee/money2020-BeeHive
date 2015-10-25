'use strict';

var Config = require('../config/config.js')();
var Owners = require('../models/owner.js');

var Routes = function(app) {
  app.get('/', function(req, res) {
    res.render('index.jade', {
      title: Config.title + 'Home'
    });
  });

  app.get('/logout', function(req, res) {
    req.session.destroy(function(err){
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  });

  require('./owners.js')(app);
  require('./workers.js')(app);
};

module.exports = Routes;
