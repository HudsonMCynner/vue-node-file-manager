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
            File.deleteMany({ path }, (err, files) => {
                if (err) {
                    return res.status(404).end();
                }
                res.send({ code: 200, message: 'Arquivos removidos com sucesso!' });
            });
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
        File.find({ path }, (err, files) => {
            files = files.filter((file) => {
                if (file.folder) {
                    let paths = path.split('/')
                    return file.name !== paths[paths.length - 1]
                }
                return file.path.indexOf(path) > -1
            })
            if (err) {
                return res.status(404).end();
            }
            res.send(files);
        });
    },
    getAll: (req, res, next) => {
        File.find((err, files) => {
            if (err) {
                return res.status(404).end();
            }
            console.log('File fetched successfully');
            res.send(files);
        });
    },
    getTotalOfFiles: (req, res, next) => {
        File.find({ folder: false }, (err, files) => {
            if (err) {
                return res.status(404).end();
            }
            let total = files.length ? files.map((file) => file.size).reduce((acc, next) => acc + next) : 0
            res.send({ total });
        });
    },
    uploadFile: (req, res, next) => {
        let savedModels = []
        async.each(req.files, (file, callback) => {
            let fileModel = new File({
                name: file.filename
            });
            fileModel.save((err) => {
                if (err) {
                    return next('Error creating new file', err);
                }

                fileModel.encodedName = btoa(fileModel._id)
                fileModel.path = req.body.folderPath || fileConfig.uploadsFolder
                if (req.body.fileFolderPath) {
                    fileModel.path = `${fileModel.path}/${req.body.fileFolderPath}`
                    let folderPath = `${req.body.folderPath || fileConfig.uploadsFolder}/${req.body.fileFolderPath}`
                    File.findOne({ path: folderPath }, (error, folder) => {
                        if (!folder) {
                            let paths = req.body.fileFolderPath.split('/')
                            let folderModel = new File({
                                name: paths[paths.length - 1],
                                path: folderPath,
                                folder: true
                            })
                            folderModel.save((err) => {
                                if (err) {
                                    return next('Error creating new folder', err);
                                }
                            })
                        }
                    })
                }
                fileModel.size = file.size
                fileModel.mimetype = file.mimetype
                fileModel.save((err) => {
                    if (err) {
                        return next('Error creating new file', err);
                    }

                    savedModels.push(fileModel)

                    callback()
                    console.log('File created successfully');
                })

            });
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
        File.findOne({name: req.params.name}, (err, file) => {
            if (err) {
                res.status(400).end();
            }

            if (!file) {
                File.findOne({encodedName: req.params.name}, (err, file) => {
                    if (err) {
                        res.status(400).end();
                    }

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
            }
        })
    },
    renameFile: (req, res, next) => {
        let oldName = `${req.body.file.path}/${req.body.file.name}`
        let newName = `${req.body.file.path}/${req.body.newName}`
        File.updateOne({ _id: req.body.file._id }, { name: `${req.body.newName}` }, (err, file) => {
            fs.rename(oldName, newName, function (err) {
                if (err) throw err;
                console.log('File Renamed.');
                res.send({ code: 200 })

            });
        })
    },
    deleteFile (req, res, next) {
        File.findOne({_id: req.params.id}, (err, file) => {
            if (err) {
                res.status(400).end();
            }

            if (!file) {
                res.status(404).end();
            }

            // let fileLocation = path.join(__dirname, '..', 'uploads', file.name)
            let fileLocation = path.join(req.query.folderPath || fileConfig.uploadsFolder, file.name)
            fs.unlink(fileLocation, () => {
                File.deleteOne(file, (err) => {
                    if (err) {
                        return next(err)
                    }

                    return res.send([])
                })
            })
        })
    },
}
