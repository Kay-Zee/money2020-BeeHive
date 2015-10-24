'use strict'

var db = require('./db');

module.exports = {
  get: function(id) {
    return db.getClient()
      .query('SELECT FROM project WHERE id = $1' [id])
      .then(function(results) {
        return results.rows[0];
      });
  },
  create: function(project) {
    return db.getClient()
      .query('INSERT INTO project (owner_id, title, description, tags) VALUES ($1, $2, $3, $4) RETURNING *',[project.ownerId, project.title, proejct.description, project.tags])
      .then(function(results) {
        return results.rows[0]
      });

  },
  update: function(project) {
    return db.getClient()
      .query('UPDATE job SET owner_id = $1, title = $2, description = $3, tags = $4 RETURNING *',[project.ownerId, project.title, proejct.description, project.tags])
      .then(function(results) {
        return results.rows[0]
      });

  },
  delete: function(id) {
    return db.getClient()
      .query('DELETE FROM project WHERE id = $1' [id]);
  }
};