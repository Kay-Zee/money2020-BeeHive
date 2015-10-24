'use strict'

var db = require('./db');

module.exports = {
  get: function(id) {
    return db.getClient()
      .query('SELECT FROM owner WHERE id = $1' [id])
      .then(function(results) {
        return results.rows[0];
      });
  },
  create: function(owner) {
    return db.getClient()
      .query('INSERT INTO owner (name, email, password) VALUES ($1, $2, $3) RETURNING *',[owner.name, owner.email, owner.password])
      .then(function(results) {
        return results.rows[0]
      });

  },
  update: function(owner) {
    return db.getClient()
      .query('UPDATE owner SET name = $1, email = $2, password = $3 RETURNING *',[owner.name, owner.email, owner.password])
      .then(function(results) {
        return results.rows[0]
      });

  },
  delete: function(id) {
    return db.getClient()
      .query('DELETE FROM owner WHERE id = $1' [id]);
  }
};