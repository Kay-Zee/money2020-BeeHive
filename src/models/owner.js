'use strict';

var db = require('./db');

module.exports = {
  get: function(id) {
    return db.getClient()
      .query('SELECT * FROM owners WHERE id = $1', [id])
      .then(function(results) {
        return results.rows[0];
      });
  },
  create: function(owner) {
    return db.getClient()
      .query('INSERT INTO owners (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [owner.name, owner.email, owner.password])
      .then(function(results) {
        return results.rows[0];
      });

  },
  update: function(owner) {
    return db.getClient()
      .query('UPDATE owners SET name = $1, email = $2, password = $3 RETURNING *',
        [owner.name, owner.email, owner.password])
      .then(function(results) {
        return results.rows[0];
      });

  },
  delete: function(id) {
    return db.getClient()
      .query('DELETE FROM owners WHERE id = $1' [id]);
  },
  validateLogin: function(email, password) {
    return db.getClient()
      .query('SELECT * FROM owners WHERE email = $1', [email])
      .then(function(results) {
        console.log(results);
        if (results.rows.length === 0) {
          throw 'No such email';
        } else if (results.rows[0].password !== password){
          console.log(results.rows);
          throw 'Incorrect password';
        } else {
          return results.rows[0];
        }
      });
  }
};