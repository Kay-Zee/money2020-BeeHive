'use strict';

var Config = require('../config/config.js')();
var Owners = require('../models/owner.js');
var Projects = require('../models/project.js');

var Routes = function(app) {
  app.get('/', function(req, res) {
    res.render('index.jade', {
      title: Config.title + 'Home',
      user: req.session.user 
    });
  });

  app.get('/logout', function(req, res) {
    req.session.user == null;
    req.session.destroy(function(err){
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  });

  app.get('/list', function(req, res) {
    Projects.getAllProjects()
      .then(function(projects){
        console.log(projects);
        res.render('list.jade', {
          title: Config.title + 'List',
          user: req.session.user, 
          projects: projects
        });
      })
      .catch(function(err){
        console.log(err);
        res.render('list.jade', {
          title: Config.title + 'List',
          user: req.session.user 
        });
      });
  });

  app.get('/project/:project_id', function(req, res) {
    Projects.getWithJobs(req.params.project_id)
      .then(function(project) {
        res.render('single-job.jade', {
          title: Config.title + 'single-job',
          user: req.session.user ,
          project: project
        });
      })
      .catch(function(err) {

      });

  });



  require('./owners.js')(app);
  require('./workers.js')(app);
};

module.exports = Routes;
