import sequelize from '../../../../config/database.js'
import Sequelize from 'sequelize'

const User = sequelize.define('usuario', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false
	},
	avatar: {
		type: Sequelize.STRING,
		allowNull: true
	},
	active: {
		type: Sequelize.BOOLEAN,
		allowNull: false
	},
	password: {
		type: Sequelize.STRING,
		allowNull: true
	}
})

export default User
