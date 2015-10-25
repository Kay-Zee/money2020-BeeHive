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

  app.get('/list', function(req, res) {
    res.render('list.jade', {
      title: Config.title + 'List'
    });
  });

  app.get('/single-job', function(req, res) {
    res.render('single-job.jade', {
      title: Config.title + 'single-job'
    });
  });

  app.get('/employer', function(req, res) {
    res.render('employer.jade', {
      title: Config.title + 'employer'
    });
  });
  app.get('/payment', function(req, res) {
    res.render('payment.jade', {
      title: Config.title + 'payment'
    });
  });

  require('./owners.js')(app);
  require('./workers.js')(app);
};

module.exports = Routes;
