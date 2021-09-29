const Sequelize = require('sequelize');
const database = require('../data/sequelize');

const File = database.define('file', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  encodedName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  path: {
    type: Sequelize.STRING,
    allowNull: false
  },
  mimetype: {
    type: Sequelize.STRING
  },
  size: {
    type: Sequelize.BIGINT
  },
  folder: {
    type: Sequelize.BOOLEAN
  }
})

module.exports = File;
