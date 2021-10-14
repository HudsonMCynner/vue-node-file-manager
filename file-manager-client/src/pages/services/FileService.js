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
import Rest from 'src/service/Rest'

/**
 * @type {FileService}
 */
export default class FileService extends Rest {
  /**
   * @type {string}
   */
  static resource = '/files'

  /**
   * @param files
   * @param folderPath
   * @param fileFolderPath
   * @param onUploadProgressCallback
   * @returns {Promise}
   */
  uploadFiles (files, folderPath, fileFolderPath, onUploadProgressCallback) {
    let formData = new FormData()
    formData.append('folderPath', folderPath)
    if (fileFolderPath) {
      formData.append('fileFolderPath', fileFolderPath)
    }
    for (let index = 0; index < files.length; index++) {
      formData.append(files[index].name, files[index], files[index].name)
    }
    return this.post('/upload', formData, {
      onUploadProgress: onUploadProgressCallback
    })
  }

  /**
   * @param fileId
   * @param folderPath
   * @returns {Promise}
   */
  deleteFile (fileId, folderPath) {
    return this.delete(`/${fileId}`, {
      params: {
        folderPath
      }
    })
  }

  /**
   * @returns {Promise}
   */
  getAllDir () {
    return this.get(`/directories/all`)
  }
  /**
   * @returns {Promise}
   */
  getTotalSizeOfFiles () {
    return this.get(`/total`)
  }

  /**
   * @param path
   * @returns {Promise}
   */
  getFilesByDir (path) {
    return this.get('/directories', {
      params: {
        path
      }
    })
  }

  /***
   * @returns {Promise}
   * @param file
   * @param newName
   */
  rename (file, newName) {
    return this.put('/rename', { file, newName })
  }
}
