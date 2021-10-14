import Express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from '../app/domains'

/**
 * @typedef {Server}
 */
export default class Server {
  /**
   * @type {app}
   */
  app = Express()


  /**
   */
  startServer () {
    dotenv.config()
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", '*');
      res.header("Access-Control-Allow-Headers", '*');
      this.app.use(cors());
      next();
    });
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json())
    Object.keys(routes).forEach((route) => {
      const entityRoute = routes[route].instance(this.app)
      this.app = entityRoute.getRouter()
    })

    this.app.listen(process.env.PORT, () => console.log(`servidor ouvindo na porta ${process.env.PORT}!`))
  }

  /**
   * @returns {Server.app}
   */
  getApp () {
    return this.app
  }
}
