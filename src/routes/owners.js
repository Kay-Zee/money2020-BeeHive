'use strict'

var Config = require('../config/config.js')();
var Workers = require('../models/workers.js')();
var Jobs = require('../models/jobs.js')();
var Owners = require('../models/owners.js')();
var Projects = require('../models/projects.js')();

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.json({
      title: 'Owners'
    });
  });

  app.post('/signup', function(req, res) {
    var owner = req.body;
    if (owner.name && owner.email && owner.password) {
      Owners.create(owner)
        .then(function(owner) {
          res.status(200).json({
            status:"success"
          })
        })
        .catch(function(){
          res.status(400).json({
            error:err
          });
        });
    }
  });


  app.post('/login', function(req, res) {
    var owner = req.body;
    if (owner.email && owner.password) {
      Owners.validateLogin(owner.email, owner.password)
        .then(function(owner) {
          res.status(200).json({
            status:"success"
          })
        })
        .catch(function(){
          res.status(400).json({
            error:err
          });
        });
    } else {
      res.status(400).json({
        error: "Missing Credentials"
      })
    }
  });

  app.get('/projects', function(req, res) {
    var project = req.body;
    // TODO: Validate owner id
    project.ownerId = req.user.id;
    Projects.create(project)
      .then(function(project) {
        res.status(200).json(project);
      })
      .catch(function(err) {
        console.log(err)
        res.status(400).json({
          error:"Could not create project"
        })
      });
  });

  app.post('/projects', function(req, res) {
    var project = req.body;
    // TODO: Validate owner id
    project.ownerId = req.user.id;
    Projects.create(project)
      .then(function(project) {
        res.status(200).json(project);
      })
      .catch(function(err) {
        console.log(err)
        res.status(400).json({
          error:"Could not create project"
        })
      });
  });

  app.post('/projects/:project_id/jobs', function(req, res) {
    var job = req.body;
    // TODO: Validate project id
    job.projectId = req.params.project_id;
    Jobs.create(job)
      .then(function(job) {
        res.status(200).json(job);
      })
      .catch(function(err) {
        console.log(err)
        res.status(400).json({
          error:"Could not create job"
        })
      });
  });

  app.post('/pay-job/:job_id', function(req, res) {
    var id = req.params.job_id;
    Jobs.get(id)
      .then(function(job){
        if (job.accepted_worker_id) {
          Workers.get(job.accepted_worker_id)
            .then(function(worker){
              gateway.transaction.sale({
                  merchantAccountId: worker.id,
                  amount: ""+job.cost/100+"."+job.cost%100,
                  paymentMethodNonce: nonceFromTheClient,
                  serviceFeeAmount: ""+job.cost*3/100/100+"."+(job.cost*3/100)%100
                }, 
                function (err, result) {
                  if (err || !results.success) {
                    res.status(400).json({error:'Could not complete pay-job transaction'});
                  } else {
                    res.status(200).json({status:'Success'});
                  }
                });
            })
            .catch(function{
              res.status(400).json({error:'Could not retrieve accepted worker'});
            });
        } else {
          res.status(400).json({error:'Job not assigned an accepted worker'});
          return;
        }
      })
  });
};