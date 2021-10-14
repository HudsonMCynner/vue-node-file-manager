import Route from '../../../crud/router/Route'
import FolderController from '../controller/FolderController'

/**
 * @typedef {UsuarioRouter}
 */
export default class FolderRouter extends Route {
  /**
   * @type {string}
   */
  domain = 'folders'

  /**
   * @type {FileController}
   */
  controller = FolderController.instance()

  _startRoutes () {
    this.directories()
    this.create()
    super._startRoutes()
  }

  create () { // Criar domain
    this.app.get(`/${this.domain}/create`, (req, res, next) => {
      this.controller.createDirectory(req, res, next)
    })
  }

  directories () { // Criar domain
    this.app.get(`/${this.domain}/all`, (req, res, next) => {
      this.controller.getDirectories(req, res, next)
    })
  }
}
