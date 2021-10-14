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
    this.delete()
    super._startRoutes()
  }

  create () { // Criar domain
    this.app.post(`/${this.domain}/create`, (req, res, next) => {
      this.controller.createDirectory(req, res, next)
    })
  }

  directories () {
    this.app.get(`/${this.domain}/all`, (req, res, next) => {
      this.controller.getDirectories(req, res, next)
    })
  }

  delete () {
    this.app.post(`/${this.domain}/delete`, (req, res, next) => {
      this.controller.deleteDirectory(req, res, next)
    })
  }
}
