'use strict';

var Config = require('../config/config.js')();
var Owners = require('../models/owner.js');
var Projects = require('../models/project.js');
var Jobs = require('../models/job.js');

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

  app.get("/client_token", function (req, res) {
    Config.braintree.clientToken.generate({}, function (err, response) {
      res.send(response.clientToken);
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
        res.status(404);
      });

  });

  app.get('/employer', function(req, res) {
    Owners.getProjectsWithJobs(req.session.user.id)
      .then(function(project) {
        res.render('employer.jade', {
          title: Config.title + 'employer',
          user: req.session.user,
          project: project
        });
      })
      .catch(function(err) {
        res.status(404);
      });
  });
  app.get('/job/:job_id/payment', function(req, res) {
    Jobs.getJobWithWorker(req.params.job_id)
      .then(function(job) {
        return Projects.get(job.project_id)
          .then(function(project){
            res.render('payment.jade', {
              title: Config.title + 'payment',
              user: req.session.user,
              project: project,
              job: job
            });
          });
      })
      .catch(function(err) {
        console.log(err);
        res.status(404);
      });

  });
  app.get('/signup', function(req, res) {
    res.render('signup.jade', {
      title: Config.title + 'signup'
    });
  });
  require('./owners.js')(app);
  require('./workers.js')(app);
};

module.exports = Routes;
