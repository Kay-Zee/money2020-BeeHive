'use strict'

var db = require('./db');

module.exports = {
  get: function(id) {
    return db.getClient()
      .query('SELECT FROM job WHERE id = $1' [id])
      .then(function(results) {
        return results.rows[0];
      });
  },
  create: function(job) {
    return db.getClient()
      .query('INSERT INTO job (project_id, title, cost, tags) VALUES ($1, $2, $3, $4) RETURNING *',[job.projectId, job.title, job.cost, job.tags])
      .then(function(results) {
        return results.rows[0]
      });

  },
  update: function(job) {
    return db.getClient()
      .query('UPDATE job SET project_id = $1, title = $2, tags = $3 RETURNING *',[job.projectId, job.title, job.tags])
      .then(function(results) {
        return results.rows[0]
      });

  },
  delete: function(id) {
    return db.getClient()
      .query('DELETE FROM job WHERE id = $1' [id]);
  }
};