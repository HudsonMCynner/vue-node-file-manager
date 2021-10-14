import Controller from '../../../crud/controller/Controller'
import FolderRepository from '../repository/FolderRepository'
import fs, { readdirSync } from 'fs'

/**
 * @typedef {UsuarioController}
 */
export default class FolderController extends Controller {
  /**
   * @type {UsuarioRepository}
   */
  repository = FolderRepository.instance()

  createDirectory (req, res, next) {
    let $this = this
    const mkdir = (dir) => {
      fs.exists(dir, exist => {
        if (!exist) {
          return fs.mkdir(dir, error => {
            if (error) {
              return res.status(500).end()
            }
            $this.repository.insert({
              name: req.body.base.children,
              path: dir,
              folder: true
            })
              .then(() => {
                res.send({ dir })
              })
              .catch(() => {
                return next('Error creating new folder', err);
              })
          })
        }
        return dir
      })
    }
    mkdir(`${req.body.base.base || process.env.uploadsFolder}/${req.body.base.children}`)
  }

  deleteDirectory (req, res, next) {
    const path = req.body.folderPath
    fs.rm(path, { recursive: true }, () => {
      this.repository.destroy(
        { where: { path } }
      )
        .then(() => {
          res.send({ code: 200, message: 'Arquivos removidos com sucesso!' });
        })
        .catch((e) => {
          return res.status(404).end();
        })
    });
  }

  getDirectories (req, res, next) {
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
    res.send(getDirectories(process.env.uploadsFolder));
  }
}
