'use strict';

var pg = require('pg-then');
var pgURI = process.env.PG_URI || 'postgres://postgres@localhost:5432/beehive';
var pool = pg.Pool(pgURI);

module.exports = {
  getClient: function() {
    // if (process.env.NODE_ENV === 'test') {
    //   if (!endsWith(pgURI, 'test-db') && !endsWith(pgURI,'/')){
    //     pgURI = pgURI + '-test-db';
    //     pool = pg.Pool(pgURI);
    //   }
    // }
    return pool;
  }
};
