import Controller from '../../../crud/controller/Controller.js'
import FileRepository from '../repository/FileRepository.js'
const async = require('async')
const btoa = require('btoa')

/**
 * @typedef {UsuarioController}
 */
export default class FileController extends Controller {
  /**
   * @type {UsuarioRepository}
   */
  repository = FileRepository.instance()

  upload (req, res, next) {
    let savedModels = []
    let $this = this
    async.each(req.files, (file, callback) => {
      $this.repository.insert({
        name: file.filename,
        size: file.size,
        mimetype:file.mimetype,
        encodedName: btoa(file.filename),
        path: req.body.fileFolderPath ? `${req.body.folderPath || process.env.uploadsFolder}/${req.body.fileFolderPath}` : req.body.folderPath || process.env.uploadsFolder
      })
        .then((response) => {
          savedModels.push(response)
          callback()
          console.log('File created successfully');

          if (req.body.fileFolderPath) {
            let folderPath = `${req.body.folderPath || process.env.uploadsFolder}/${req.body.fileFolderPath}`
            $this.repository.findOne({ where: { path: folderPath, folder: true } })
              .then((folder) => {
                if (!folder) {
                  let paths = req.body.fileFolderPath.split('/')
                  $this.repository.insert({
                    name: paths[paths.length - 1],
                    path: folderPath,
                    folder: true
                  })
                    .then(() => {})
                    .catch(() => {
                      return next('Error creating new folder', err);
                    })
                }
              })
          }

        })
        .catch((e) => {
          console.log('~> ', e)
          return res.status(400);
        })
    }, (err) => {
      if (err) {
        return res.status(400).end('Erro');
      }
      return res.send(savedModels)
    })
  }
}
