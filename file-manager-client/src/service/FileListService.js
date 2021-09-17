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
   * @returns {Promise}
   */
  uploadFiles (files) {
    let formData = new FormData()
    for (let index = 0; index < files.length; index++) {
      formData.append(files[index].name, files[index], files[index].name)
    }
    return this.post('/upload', formData)
  }

  /**
   * @param fileId
   * @returns {Promise}
   */
  deleteFile (fileId) {
    return this.delete(`/files/${fileId}`)
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