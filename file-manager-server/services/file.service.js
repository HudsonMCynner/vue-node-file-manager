const mongoose = require('mongoose');
const File = require('../models/file');
const multer = require('multer');
const async = require('async')
const fs = require('fs')
const path = require('path')
const btoa = require('btoa')
const { readdirSync } = require('fs')

const fileConfig = require('../config/file.config')

const mongoDB = fileConfig.dbConnection;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
    createDirectory: (base = fileConfig.uploadsFolder) => {
        const mkdir = (dir) => {
            fs.exists(dir, exist => {
                if (!exist) {
                    return fs.mkdir(dir, error => new Error(dir))
                }
            })
        }
        const paths = fileConfig.baseDirectories
        mkdir(base)
        paths.forEach((path) => {
            mkdir(`${base}/${path}`)
        })
    },
    getDir: (req, res, next) => {
        const getDirectories = (source) => {
            return readdirSync(source, { withFileTypes: true })
              .filter(dirent => dirent.isDirectory())
              .map(dirent => {
                  return {
                      label: dirent.name,
                      path: `${source}/${dirent.name}`,
                      children: getDirectories(`${source}/${dirent.name}`)
                  }
              }).sort((a, b) => a.label < b.label)
        }
        res.send(getDirectories(fileConfig.uploadsFolder));
    },
    getFilesByDir: (req, res, next) => {
        File.find({ path: req.query.path || fileConfig.uploadsFolder }, (err, files) => {
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
        File.find((err, files) => {
            if (err) {
                return res.status(404).end();
            }
            let total = files.map((file) => file.size).reduce((acc, next) => acc + next)
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
                fileModel.path = req.folderPath || fileConfig.uploadsFolder
                fileModel.size = file.size
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
                    const dir = fileConfig.uploadsFolder
                    fs.exists(dir, exist => {
                        if (!exist) {
                            return fs.mkdir(dir, error => cb(error, dir))
                        }
                        return cb(null, dir)
                    })
                },
                filename: (req, file, cb) => {
                    let extension = fileConfig.supportedMimes[file.mimetype]
                    let originalname = file.originalname.split('.')[0]
                    let fileName = originalname + '-' + (new Date()).getMilliseconds() + '.' + extension
                    cb(null, fileName)
                }
            }),
            fileFilter: (req, file, cb) => {
                let extension = fileConfig.supportedMimes[file.mimetype]

                if (!extension) {
                    return cb(null, false)
                } else {
                    cb(null, true)
                }
            }
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
                    let fileLocation = path.join(fileConfig.uploadsFolder, file.name)

                    res.download(fileLocation, (err) => {
                        if (err) {
                            res.status(400).end();
                        }
                    })
                })
            }
        })
    },
    deleteFile (req, res, next) {
        File.findOne({id: req.params._id}, (err, file) => {
            if (err) {
                res.status(400).end();
            }

            if (!file) {
                res.status(404).end();
            }

            // let fileLocation = path.join(__dirname, '..', 'uploads', file.name)
            let fileLocation = path.join(fileConfig.uploadsFolder, file.name)
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