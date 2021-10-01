const File = require('../models/file');
const multer = require('multer');
const async = require('async')
const fs = require('fs')
const path = require('path')
const btoa = require('btoa')
const { readdirSync } = require('fs')

const fileConfig = require('../config/file.config')

File.sync();

module.exports = {
    createDirectory: (req, res, next) => {
        const mkdir = (dir) => {
            fs.exists(dir, exist => {
                if (!exist) {
                    return fs.mkdir(dir, error => {
                        if (error) {
                            return res.status(500).end()
                        }
                        return res.send({ dir })
                    })
                }
                return dir
            })
        }
        mkdir(`${req.body.base.base || fileConfig.uploadsFolder}/${req.body.base.children}`)
    },
    deleteDirectory: (req, res, next) => {
        const path = req.body.folderPath
        fs.rm(path, { recursive: true }, () => {
            File.destroy(
              { where: { path } }
            )
              .then(() => {
                  res.send({ code: 200, message: 'Arquivos removidos com sucesso!' });
              })
              .catch((e) => {
                  return res.status(404).end();
              })
        });
    },
    getDir: (req, res, next) => {
        const getDirectories = (source) => {
            return readdirSync(source, { withFileTypes: true })
              .filter(dirent => dirent.isDirectory())
              .map(dirent => {
                  return {
                      label: dirent.name,
                      path: `${source}/${dirent.name}`,
                      icon: 'far fa-folder',
                      children: getDirectories(`${source}/${dirent.name}`)
                  }
              }).sort((a, b) => a.label < b.label)
        }
        res.send(getDirectories(fileConfig.uploadsFolder));
    },
    getFilesByDir: (req, res, next) => {
        let path = req.query.path || fileConfig.uploadsFolder
        File.findAll({
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
    },
    getAll: (req, res, next) => {
        File.findAll()
          .then((files) => {
              console.log('File fetched successfully');
              res.send(files);
          })
          .catch((e) => {
              return res.status(404).end();
          })
    },
    getTotalOfFiles: (req, res, next) => {
        File.findAll({
            where: {
                folder: false
            }
        })
          .then((files) => {
              let total = files.length ? files.map((file) => file.size).reduce((acc, next) => acc + next) : 0
              res.send({ total });
          })
          .catch(() => {
              return res.status(404).end();
          })
    },
    uploadFile: (req, res, next) => {
        let savedModels = []
        async.each(req.files, (file, callback) => {
            File.create({
                name: file.filename,
                size: file.size,
                mimetype:file.mimetype,
                encodedName: btoa(file.filename),
                path: req.body.folderPath || fileConfig.uploadsFolder
            })
              .then((response) => {
                savedModels.push(response)
                callback()
                console.log('File created successfully');

                // if (req.body.fileFolderPath) {
                //     fileModel.path = `${fileModel.path}/${req.body.fileFolderPath}`
                //     let folderPath = `${req.body.folderPath || fileConfig.uploadsFolder}/${req.body.fileFolderPath}`
                //     File.findOne({ path: folderPath }, (error, folder) => {
                //         if (!folder) {
                //             let paths = req.body.fileFolderPath.split('/')
                //             let folderModel = new File({
                //                 name: paths[paths.length - 1],
                //                 path: folderPath,
                //                 folder: true
                //             })
                //             folderModel.save((err) => {
                //                 if (err) {
                //                     return next('Error creating new folder', err);
                //                 }
                //             })
                //         }
                //     })
                // }

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
    },
    getFileOptions: () => {
        return {
            storage: multer.diskStorage({
                destination:  (req, file, cb) => {
                    let dir = req.body.folderPath || fileConfig.uploadsFolder
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
        }
    },
    downloadFile (req, res, next) {
        File.findOne({ where: { name: req.params.name } })
          .then((file) => {
              if (!file) {
                  File.findOne({ where: { encodedName: req.params.name } })
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
              }
          })
          .catch((e) => {
              res.status(400).end();
          })

    },
    renameFile: (req, res, next) => {
        let oldName = `${req.body.file.path}/${req.body.file.name}`
        let newName = `${req.body.file.path}/${req.body.newName}`
        File.update(
          { name: `${req.body.newName}` },
          { where: { id: req.body.file.id } }
        )
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
    },
    deleteFile (req, res, next) {
      File.findOne({ where: {id: req.params.id} })
          .then((file) => {
              // let fileLocation = path.join(__dirname, '..', 'uploads', file.name)
              let fileLocation = path.join(req.query.folderPath || fileConfig.uploadsFolder, file.name)
              fs.unlink(fileLocation, () => {
                File.destroy({ where: {id: req.params.id} })
                  .then((response) => res.send({ code: 200 }))
                  .catch((e) => {
                    res.status(400).end();
                  })
              })
          })
          .catch((e) => {
              res.status(400).end();
          })
    },
}
