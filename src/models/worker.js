'use strict';

var db = require('./db');

module.exports = {
  get: function(id) {
    return db.getClient()
      .query('SELECT * FROM workers WHERE id = $1', [id])
      .then(function(results) {
        return results.rows[0];
      });
  },
  create: function(worker) {
    return db.getClient()
      .query('INSERT INTO workers (braintree_id, name, email, password, tags, sub_merchant_json) '+
        'VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [worker.braintreeId, worker.name, worker.email, worker.password, worker.tags, worker.subMerchantJson])
      .then(function(results) {
        return results.rows[0];
      });

  },
  update: function(worker) {
    return db.getClient()
      .query('UPDATE workers SET name = $1, email = $2, password = $3 tags = $4 '+
        'RETURNING *',[worker.name, worker.email, worker.password, worker.tags])
      .then(function(results) {
        return results.rows[0];
      });

  },
  delete: function(id) {
    return db.getClient()
      .query('DELETE FROM workers WHERE id = $1' [id]);
  },
  validateLogin: function(email, password) {
    return db.getClient()
      .query('SELECT * FROM workers WHERE email = $1' [email])
      .then(function(results) {
        if (results.length === 0) {
          throw 'No such email';
        } else if (results.rows[0].password !== password){
          throw 'Incorrect password';
        } else {
          return results.rows[0];
        }
      });
  }
};