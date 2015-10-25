'use strict';

var Config = require('../config/config.js')();
var Workers = require('../models/worker.js');
var Jobs = require('../models/job.js');
var Owners = require('../models/owner.js');
var Projects = require('../models/project.js');


module.exports = function(app) {


  app.get('/', function(req, res) {
    res.json({
      title: 'Owners'
    });
  });
  app.get('/owners', function(req, res) {
    console.log(req.session);
    if (!req.session.isOwner) {
      res.status(400).json({error: 'Not an owner'});
    }
    res.json({
      isLoggedIn: req.session.user !== undefined
    });
  });

  app.post('/owners/signup', function(req, res) {
    var owner = req.body;
    if (owner.name && owner.email && owner.password) {
      Owners.create(owner)
        .then(function(newOwner) {
          req.session.user = newOwner;
          req.session.isOwner = true;
          res.status(200).json({
            status: 'success'
          });
        })
        .catch(function(err){
          res.status(400).json({
            error: err
          });
        });
    }
  });


  app.post('/owners/login', function(req, res) {
    var owner = req.body;
    console.log(owner);
    if (owner.email && owner.password) {
      Owners.validateLogin(owner.email, owner.password)
        .then(function(newOwner) {
          console.log(newOwner);
          req.session.user = newOwner;
          req.session.isOwner = true;
          res.status(200).json({
            status: 'success'
          });
        })
        .catch(function(err){
          console.log(err);
          res.status(400).json({
            error: err
          });
        });
    } else {
      res.status(400).json({
        error: 'Missing Credentials'
      });
    }
  });

  app.get('/owners/projects', loggedInAsOwner, function(req, res) {
    var project = req.body;
    // TODO: Validate owner id
    project.ownerId = req.session.user.id;
    Projects.create(project)
      .then(function(project) {
        res.status(200).json(project);
      })
      .catch(function(err) {
        console.log(err);
        res.status(400).json({
          error: 'Could not create project'
        });
      });
  });

  app.post('/owners/projects', loggedInAsOwner, function(req, res) {
    var project = req.body;
    // TODO: Validate owner id
    project.ownerId = req.session.user.id;
    Projects.create(project)
      .then(function(project) {
        res.status(200).json(project);
      })
      .catch(function(err) {
        console.log(err);
        res.status(400).json({
          error: 'Could not create project'
        });
      });
  });

  app.post('/owners/projects/:project_id/jobs', loggedInAsOwner, function(req, res) {
    var job = req.body;
    // TODO: Validate project id
    job.projectId = req.params.project_id;
    console.log(job);
    Jobs.create(job)
      .then(function(job) {
        res.status(200).json(job);
      })
      .catch(function(err) {
        console.log(err);
        res.status(400).json({
          error: 'Could not create job'
        });
      });
  });

  app.post('/owners/jobs/:job_id/accept', loggedInAsOwner, function(req, res) {

    var accept = {
      workerId: req.body.workerId,
      jobId: req.params.job_id
    };
    console.log(accept);
    Jobs.acceptWork(accept)
      .then(function(job) {
        res.status(200).json(job);
      })
      .catch(function(err) {
        console.log(err);
        res.status(400).json({
          error: 'Could not accept work'
        });
      });
  });

  app.post('/owners/jobs/:job_id/pay', loggedInAsOwner, function(req, res) {
    var id = req.params.job_id;
    console.log(id);
    Jobs.get(id)
      .then(function(job){
        if (job.accepted_worker_id) {
          Workers.get(job.accepted_worker_id)
            .then(function(worker){
              var serviceFee = '0.03';
              if (job.cost > 100) {
                serviceFee = ''+job.cost*3/100/100+'.'+(job.cost*3/100)%100;
              }
              Config.braintree.transaction.sale({
                  merchantAccountId: worker.braintree_id,
                  amount: ''+job.cost/100+'.'+job.cost%100,
                  paymentMethodNonce: 'fake-valid-nonce',
                  serviceFeeAmount: serviceFee,
                  options: {
                    submitForSettlement: true
                  }
                }, 
                function (err, result) {
                  console.log(result);
                  if (err || !result.success) {
                    console.log(err);
                    res.status(400).json({
                      error: 'Could not complete pay-job transaction'
                    });
                  } else {
                    res.status(200).json({status: 'Success'});
                  }
                });
            })
            .catch(function(err){
              res.status(400).json({error:'Could not retrieve accepted worker'});
            });
        } else {
          res.status(400).json({error:'Job not assigned an accepted worker'});
          return;
        }
      })
      .catch(function(err) {
        console.log(err);
        res.status(400).json({error:'Could not find job by id'});
        return;
      });
  });
};

function loggedInAsOwner(req, res, next) {
  if (req.session.isOwner && req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
}
