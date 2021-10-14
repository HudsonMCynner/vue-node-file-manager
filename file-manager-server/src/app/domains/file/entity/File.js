import sequelize from '../../../../config/database.js'
import Sequelize from 'sequelize'

const File = sequelize.define('file', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  encodedName: {
    type: Sequelize.STRING
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
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
})

module.exports = File;
