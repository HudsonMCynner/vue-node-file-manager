import Http from './Http'

/**
 * @type Api
 */
export default class Api extends Http {
  /**
   * @type {String}
   */
  static base = ''

  /**
   * @param {String} path
   * @param {Object} http
   * @param {Object} options
   * @return {this}
   */
  static build (path = '', http = null, options = {}) {
    return new this(Http.normalize(Api.base, path), http, options)
  }
}
