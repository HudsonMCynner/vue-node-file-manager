/*
 ***********************************************
 * fileshare
 * TDR Informática Ltda
 * Todos os direitos reservados ©
 ***********************************************
 * Nome do arquivo: FileListService.js
 * Criado por: Hudson
 * Data da criação: 15/09/2021
 * Observação:
 ***********************************************
 */
import Rest from './Rest'

/**
 * @type {FileListService}
 */
export default class FileListService extends Rest {
  /**
   * @type {string}
   */
  static resource = ''

  /**
   * @returns {Promise}
   */
  getAllFiles () {
    return this.get('/files')
  }

  /**
   * @param files
   * @param folderPath
   * @param scopeVue
   * @returns {Promise}
   */
  uploadFiles (files, folderPath, scopeVue) {
    let formData = new FormData()
    formData.append('folderPath', folderPath)
    for (let index = 0; index < files.length; index++) {
      formData.append(files[index].name, files[index], files[index].name)
    }
    return this.post('/upload', formData, {
      onUploadProgress: (progressEvent) => {
        scopeVue.$root.$emit('app:progress', (progressEvent.loaded / progressEvent.total))
      }
    })
  }

  /**
   * @param fileId
   * @param folderPath
   * @returns {Promise}
   */
  deleteFile (fileId, folderPath) {
    return this.delete(`/files/${fileId}`, {
      params: {
        folderPath
      }
    })
  }

  /**
   */
  downloadFile () {
  }

  /**
   * @returns {Promise}
   */
  getAllDir () {
    return this.get(`/dirs`)
  }
  /**
   * @returns {Promise}
   */
  getTotalSizeOfFiles () {
    return this.get(`/files/total`)
  }

  /**
   * @param base
   * @param children
   * @returns {Promise}
   */
  createDirectory (base, children) {
    return this.post(`/dirs/create`, { base, children })
  }

  /**
   * @param path
   * @returns {Promise}
   */
  getFilesByDir (path) {
    return this.get('/files/dir', {
      params: {
        path
      }
    })
  }
}
