'use strict'

var db = require('./db');

module.exports = {
  get: function(id) {
    return db.getClient()
      .query('SELECT FROM worker WHERE id = $1' [id])
      .then(function(results) {
        return results.rows[0];
      });
  },
  create: function(worker) {
    return db.getClient()
      .query('INSERT INTO worker (name, email, password, tags) VALUES ($1, $2, $3) RETURNING *',[worker.name, worker.email, worker.password, worker.tags])
      .then(function(results) {
        return results.rows[0]
      });

  },
  update: function(worker) {
    return db.getClient()
      .query('UPDATE worker SET name = $1, email = $2, password = $3 tags = $4 RETURNING *',[worker.name, worker.email, worker.password, worker.tags])
      .then(function(results) {
        return results.rows[0]
      });

  },
  delete: function(id) {
    return db.getClient()
      .query('DELETE FROM worker WHERE id = $1' [id]);
  }
};