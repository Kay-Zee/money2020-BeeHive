'use strict'

var Config = require('../config/config.js')();
var Workers = require('../models/workers.js')();
var UUID = require('uuid-js');
var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_MERCHANT_ID,
  privateKey: process.env.BRAINTREE_MERCHANT_ID
});

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.json({
      title: 'Workers'
    });
  });

  app.post('/login', function(req, res) {
    var worker = req.body;
    if (worker.email && worker.password) {
      Workers.validateLogin(worker.email, worker.password)
        .then(function(worker) {
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

  app.post('/create-worker', function(req, res) {
    var workerInfo = req.body;
    var subMerchantId = UUID.create().toString();
    var merchantAccountParams = {id: subMerchantId};
    if (!workerInfo.individual) {
      res.status(400).json({error:"No individual info"});
    } else if (!workerInfo.funding || !validateFundingInfo(workerInfo.funding)){
      res.status(400).json({error:"No funding info"});
    } else if (!workerInfo.password){
      res.status(400).json({error:"No login info"});
    } else {
      if (validateIndividualInfo(workerInfo.individual)) {
        merchantAccountParams.individual = body.individual
      }
      if (workerInfo.business && validateBuisnessInfo(body.business)) {
        merchantAccountParams.business = body.business;
      }
      merchantAccountParams.funding = workerInfo.funding;
      merchantAccountParams.tosAccepted = merchantAccountParams || false;
      merchantAccountParams.masterMerchantAccountId: Config.merchantId;
      // Create the merchant account
      gateway.merchantAccount.create(merchantAccountParams, function (err, result) {
        if (err || !result.success) {
          res.status(400).json({error:"could not create sub merchant account"});
          return;
        } 
        var info = workerInfo.individual;
        Workers.create({
          id: merchantAccountParams.id,
          name: info.firstName.trim()+" "+ info.lastName.trim(),
          email: info.email,
          password: info.password,
          tags: [],
          subMerchantJson: merchantAccountParams
        })
        .then(function(){
          res.status(200).json({status:'Account created successfully'})
        })
        .catch(function(err){
          res.status(400).json({error:err});
        });
      });
    }
  });
};

function validateAddress(address){
  return address.streetAddress && address.locality && address.region && address.postalCode;
}

function validateIndividualInfo(info){
  return info.firstName && info.lastName && info.email && info.dateOfBirth && info.address
    && validateAddress(info.address);
}

function validateBuisnessInfo(info){
  return info.legalName && info.taxId && info.address && validateAddress(info.address);
}

function validateFundingInfo(info){
  return (info.destination == MerchantAccount.FundingDestination.Bank && info.accountNumber && info.routingNumber) 
  || (info.destination == 'mobile' && info.mobilePhone && !info.accountNumber && !info.routingNumber) 
  || (info.destination == 'email' && info.email && !info.accountNumber && !info.routingNumber);
}