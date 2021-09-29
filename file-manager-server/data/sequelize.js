const Sequelize = require('sequelize');
const { dbConnection } = require('../config/file.config')

const sequelize = new Sequelize(dbConnection);

module.exports = sequelize
