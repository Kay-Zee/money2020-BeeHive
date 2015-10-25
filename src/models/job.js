'use strict';

var db = require('./db');

module.exports = {
  get: function(id) {
    return db.getClient()
      .query('SELECT * FROM jobs WHERE id = $1', [id])
      .then(function(results) {
        return results.rows[0];
      });
  },
  create: function(job) {
    return db.getClient()
      .query('INSERT INTO jobs (project_id, title, cost, tags) '+
        'VALUES ($1, $2, $3, $4) RETURNING *',
        [job.projectId, job.title, job.cost, job.tags])
      .then(function(results) {
        return results.rows[0];
      });

  },
  update: function(job) {
    return db.getClient()
      .query('UPDATE jobs SET project_id = $1, title = $2, tags = $3 RETURNING *',
        [job.projectId, job.title, job.tags])
      .then(function(results) {
        return results.rows[0];
      });

  },
  delete: function(id) {
    return db.getClient()
      .query('DELETE FROM jobs WHERE id = $1' [id]);
  },
  acceptWork: function(accpet) {
    return db.getClient()
      .query('UPDATE jobs SET accepted_worker_id = $1 WHERE id = $2 RETURNING *',
        [accpet.workerId, accpet.jobId])
      .then(function(results) {
        return results.rows[0];
      });
  }
};