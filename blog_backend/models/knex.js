const { Model } = require('objection');
const knexFile = require('../knexfile.js');
const environment = process.env.NODE_ENV || 'development';
const config = knexFile[environment];
const knex = require('knex')(config);

Model.knex(knex);

module.exports = knex;