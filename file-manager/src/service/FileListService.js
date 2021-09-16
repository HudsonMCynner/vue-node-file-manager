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
  static resource = '/files'
}
