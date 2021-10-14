import Controller from '../../../crud/controller/Controller.js'
import FileRepository from '../repository/FileRepository.js'
import path from 'path'
import fs, { readdirSync } from 'fs'
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

  getFilesByDirectory (req, res, next) {
    let path = req.query.path || process.env.uploadsFolder
    this.repository.findAll({
      where: {
        path
      }
    })
      .then((files) => {
        files = files.filter((file) => {
          if (file.folder) {
            let paths = path.split('/')
            return file.name !== paths[paths.length - 1]
          }
          return file.path.indexOf(path) > -1
        })
        res.send(files);
      })
      .catch(() => {
        return res.status(404).end();
      })
  }

  getTotalOfFiles (req, res, next) {
    this.repository.findAll({
      where: {
        folder: false
      }
    })
      .then((files) => {
        let total = files.length ? files.map((file) => Number(file.size)).reduce((acc, next) => acc + next) : 0
        res.send({ total });
      })
      .catch(() => {
        return res.status(404).end();
      })
  }

  renameFile (req, res, next) {
    let oldName = `${req.body.file.path}/${req.body.file.name}`
    let newName = `${req.body.file.path}/${req.body.newName}`
    this.repository.update({ ...req.body.file, name: `${req.body.newName}` })
      .then((response) => {
        fs.rename(oldName, newName, function (err) {
          if (err) throw err;
          console.log('File Renamed.');
          res.send({ code: 200 })

        });
      })
      .catch((e) => {
        console.log('~> ', e)
        res.status(400).end();
      })
  }

  uploadFiles (req, res, next) {
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
                    .then(() => {
                      res.send({ code: 200 })
                    })
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

  downloadFile (req, res, next) {
    this.repository.findOne({ where: { name: req.params.name } })
      .then((file) => {
        if (!file) {
          this.repository.findOne({ where: { encodedName: req.params.name } })
            .then((file) => {
              if (!file) {
                res.status(404).end();
              }
              // let fileLocation = path.join(__dirname, '..', 'uploads', file.name)
              let fileLocation = path.join(file.path, file.name)

              res.download(fileLocation, (err) => {
                if (err) {
                  res.status(400).end();
                }
              })
            })
            .catch((e) => {
              res.status(400).end();
            })
          return
        }
        let fileLocation = path.join(file.path, file.name)
        res.download(fileLocation, (err) => {
          if (err) {
            res.status(400).end();
          }
        })
      })
      .catch((e) => {
        res.status(400).end();
      })
  }

  deleteFile (req, res, next) {
    this.repository.findOne({ where: {id: req.params.id} })
      .then((file) => {
        // let fileLocation = path.join(__dirname, '..', 'uploads', file.name)
        let fileLocation = path.join(req.query.folderPath || process.env.uploadsFolder, file.name)
        fs.unlink(fileLocation, () => {
          this.repository.destroy({ where: {id: req.params.id} })
            .then((response) => res.send({ code: 200 }))
            .catch((e) => {
              res.status(400).end();
            })
        })
      })
      .catch((e) => {
        res.status(400).end();
      })
  }
}
