import Route from '../../../crud/router/Route.js'
import FileController from '../controller/FileController.js'
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
export default class FileRouter extends Route {
  /**
   * @type {string}
   */
  domain = 'files'

  /**
   * @type {FileController}
   */
  controller = FileController.instance()

  _startRoutes () {
    this.uploadFile()
    this.downloadFile()
    this.totalFileSize()
    this.getFilesByDirectory()
    this.deleteFile()
    this.renameFile()
    super._startRoutes()
  }

  deleteFile () {
    this.app.get(`/${this.domain}/:id`, (req, res, next) => {
      this.controller.deleteFile(req, res, next)
    })
  }

  getFilesByDirectory () {
    this.app.get(`/${this.domain}/directories`, (req, res, next) => {
      this.controller.getFilesByDirectory(req, res, next)
    })
  }

  totalFileSize () {
    this.app.get(`/${this.domain}/total`, (req, res, next) => {
      this.controller.getTotalOfFiles(req, res, next)
    })
  }

  downloadFile () {
    this.app.get(`/${this.domain}/download/:name`, (req, res, next) => {
      this.controller.downloadFile(req, res, next)
    })
  }

  uploadFile () {
    // '/upload', multer.any(), fileService.uploadFile);
    this.app.post(`/${this.domain}/upload`, multerStorage.any(), (req, res, next) => {
      this.controller.uploadFiles(req, res, next)
    })
  }

  renameFile () {
    this.app.put(`/${this.domain}/rename`, (req, res, next) => {
      this.controller.renameFile(req, res, next)
    })
  }
}
