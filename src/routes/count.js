'use strict';

var Config = require('../config/config.js')();
var Count = require('../models/count.js');

module.exports = function(app) {
  app.post('/count/increment', function(req, res) {
    res.json({
      newCount: Count.increment()
    });
  });
};
