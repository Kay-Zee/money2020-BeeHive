/* jshint quotmark:double */
"use strict";

module.exports = function() {
  var envs = {
    "development": {
      "env": "development",
      "title": "Development - ",
      "servicePercentage":3,
      "merchantId": process.env.BRAINTREE_MERCHANT_ID
    },
    "staging": {
      "env": "staging",
      "title": "Staging - ",
      "servicePercentage":3,
      "merchantId": process.env.BRAINTREE_MERCHANT_ID
    },
    "production": {
      "env": "production",
      "title": "Bee Hive ",
      "servicePercentage":3,
      "merchantId": process.env.BRAINTREE_MERCHANT_ID
    }
  };

  return envs[process.env.NODE_ENV];
};
