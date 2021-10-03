import Sequelize from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize(process.env.database, process.env.user, process.env.password, {
	dialect: 'postgres',
	host: process.env.host,
	port: process.env.portDatabase
})

export default sequelize
