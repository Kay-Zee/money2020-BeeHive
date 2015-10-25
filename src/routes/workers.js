'use strict';

var Config = require('../config/config.js')();
var Workers = require('../models/worker.js');
var UUID = require('uuid-js');


module.exports = function(app) {
  app.get('/', function(req, res) {
    res.json({
      title: 'Workers'
    });
  });

  app.post('/workers/login', function(req, res) {
    var worker = req.body;
    if (worker.email && worker.password) {
      Workers.validateLogin(worker.email, worker.password)
        .then(function(worker) {
          res.status(200).json({
            status: 'success'
          });
        })
        .catch(function(err){
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

  app.post('/workers/signup', function(req, res) {
    var workerInfo = req.body;
    var subMerchantId = UUID.create().toString();
    var merchantAccountParams = {};
    if (!workerInfo.individual) {
      res.status(400).json({error: 'No individual info'});
    } else if (!workerInfo.funding || !validateFundingInfo(workerInfo.funding)){
      res.status(400).json({error: 'No funding info'});
    } else if (!workerInfo.password){
      res.status(400).json({error: 'No login info'});
    } else {
      if (validateIndividualInfo(workerInfo.individual)) {
        merchantAccountParams.individual = workerInfo.individual;
      }
      if (workerInfo.business && validateBuisnessInfo(workerInfo.business)) {
        merchantAccountParams.business = workerInfo.business;
      }
      merchantAccountParams.funding = workerInfo.funding;
      merchantAccountParams.tosAccepted = workerInfo.tosAccepted || false;
      merchantAccountParams.masterMerchantAccountId = Config.masterMerchantId;
      console.log(merchantAccountParams);
      // Create the merchant account
      Config.braintree.merchantAccount.create(merchantAccountParams, function (err, result) {
        console.log(result);
        if (err || !result.success) {
          console.log(err);
          res.status(400).json({error: 'Could not create sub merchant account'});
          return;
        } 
        var info = workerInfo.individual;
        Workers.create({
          braintreeId: result.merchantAccount.id,
          name: info.firstName.trim()+' '+ info.lastName.trim(),
          email: info.email,
          password: info.password,
          tags: [],
          subMerchantJson: merchantAccountParams
        })
        .then(function(result) {
          res.status(200).json({status:'Account created successfully'});
        })
        .catch(function(err){
          res.status(400).json({error:err});
        });
      });
    }
  });
};

function validateAddress(address){
  return address.streetAddress && address.locality && address.region && 
    address.postalCode;
}

function validateIndividualInfo(info){
  return info.firstName && info.lastName && info.email && info.dateOfBirth && 
    info.address && validateAddress(info.address);
}

function validateBuisnessInfo(info){
  return info.legalName && info.taxId && info.address && 
    validateAddress(info.address);
}

function validateFundingInfo(info){
  return (info.destination === 'bank' && 
    info.accountNumber && info.routingNumber) || 
  (info.destination === 'mobile' && info.mobilePhone && !info.accountNumber && 
    !info.routingNumber) || 
  (info.destination === 'email' && info.email && !info.accountNumber && 
    !info.routingNumber);
}