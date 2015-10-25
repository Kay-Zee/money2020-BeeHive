/* jshint quotmark:double */
"use strict";
var braintree = require('braintree');

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

module.exports = function() {
  var envs = {
    "development": {
      "env": "development",
      "title": "Development - ",
      "servicePercentage":3,
      "merchantId": process.env.BRAINTREE_MERCHANT_ID,
      "masterMerchantId": process.env.BRAINTREE_MASTER_MERCHANT_ID,
      "braintree": gateway
    },
    "staging": {
      "env": "staging",
      "title": "Staging - ",
      "servicePercentage":3,
      "merchantId": process.env.BRAINTREE_MERCHANT_ID,
      "masterMerchantId": process.env.BRAINTREE_MASTER_MERCHANT_ID,
      "braintree": gateway
    },
    "production": {
      "env": "production",
      "title": "Bee Hive ",
      "servicePercentage":3,
      "merchantId": process.env.BRAINTREE_MERCHANT_ID,
      "masterMerchantId": process.env.BRAINTREE_MASTER_MERCHANT_ID,
      "braintree": gateway
    }
  };

  return envs[process.env.NODE_ENV];
};
