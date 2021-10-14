import Route from '../../../crud/router/Route.js'
import FolderController from '../controller/FolderController.js'
import fs from 'fs'
const multer = require('multer');
const multerStorage = require('multer')({
  storage: multer.diskStorage({
    destination:  (req, file, cb) => {
      let dir = req.body.folderPath || process.env.uploadsFolder
      if (req.body.fileFolderPath) {
        dir = `${dir}/${req.body.fileFolderPath}`
      }
      fs.exists(dir, exist => {
        if (!exist) {
          return fs.mkdir(dir, error => cb(error, dir))
        }
        return cb(null, dir)
      })
    },
    filename: (req, file, cb) => {
      // let extension = fileConfig.supportedMimes[file.mimetype]
      let paths = file.originalname.split('.')
      let extension = file.originalname.indexOf('.') > -1 ? file.originalname.split('.')[paths.length - 1] : null
      let originalname = file.originalname.split('.')[0]
      let fileName = `${originalname}-${(new Date()).getMilliseconds()}${extension ? `.${extension}` : ''}`
      cb(null, fileName)
    }
  })
  // fileFilter: (req, file, cb) => {
  //     let extension = fileConfig.supportedMimes[file.mimetype] // validação de tipo
  //
  //     if (!extension) {
  //         return cb(null, false)
  //     } else {
  //         cb(null, true)
  //     }
  // }
});

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
    super._startRoutes()
  }

  directories () { // Criar domain
    this.app.get(`/${this.domain}/directories/all`, (req, res, next) => {
      this.controller.getDirectories(req, res, next)
    })
  }
}
