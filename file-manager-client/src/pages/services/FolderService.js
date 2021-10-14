/*
 ***********************************************
 * fileshare
 * TDR Informática Ltda
 * Todos os direitos reservados ©
 ***********************************************
 * Nome do arquivo: FolderService.js
 * Criado por: Hudson
 * Data da criação: 15/09/2021
 * Observação:
 ***********************************************
 */
import Rest from 'src/service/Rest'

/**
 * @type {FileService}
 */
export default class FolderService extends Rest {
  /**
   * @type {string}
   */
  static resource = '/folders'

  /**
   * @param base
   * @param children
   * @returns {Promise}
   */
  create (base, children) {
    return this.post(`/create`, { base, children })
  }

  /**
   * @returns {Promise}
   */
  getAllDir () {
    return this.get(`/all`)
  }

  /***
   * @param folderPath
   * @returns {Promise}
   */
  removeDirectory (folderPath) {
    return this.post('/dir/delete/', { folderPath })
  }
}
