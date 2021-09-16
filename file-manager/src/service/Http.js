import standard from './standard'
import Service from './Service'
import { sanitize } from '../app/Util'

/**
 * @type {Http}
 */
export default class Http extends Service {
  /**
   * @param {String} path
   * @param {Object} http
   * @param {Object} options
   */
  constructor (path, http = null, options = {}) {
    super(options)
    this.path = path
    this.http = http || standard
  }

  /**
   * @param {{data: String|Object}} response
   * @returns {Object}
   */
  static then (response) {
    if (!response.data) {
      return {}
    }
    if (typeof response.data === 'string') {
      return JSON.parse(response.data)
    }
    return response.data
  }

  /**
   * @param {Object} options
   * @param {String} path
   */
  static build (options, path) {
    return new this(options, path)
  }

  /**
   * @param {String} start
   * @param {String} end
   * @returns {String}
   */
  static normalize (start, end) {
    return sanitize(`${start}${end}`.replace(/([^:]\/)\/+/g, '$1'))
  }

  /**
   * @param {String} url
   * @param {Object} config
   * @returns {Promise}
   */
  get (url, config = { showCatchMessage: true }) {
    return this.http.get(Http.normalize(this.path, url), config)
      .then(Http.then)
  }

  /**
   * @param {String} url
   * @param {Object} data
   * @param {Object} config
   * @returns {Promise}
   */
  post (url, data, config = { showCatchMessage: true }) {
    const content = data instanceof FormData ? data : sanitize(data)
    return this.http.post(Http.normalize(this.path, url), content, config)
      .then(Http.then)
  }

  /**
   * @param {String} url
   * @param {Object} data
   * @param {Object} config
   * @returns {Promise}
   */
  put (url, data, config = { showCatchMessage: true }) {
    const content = data instanceof FormData ? data : sanitize(data)
    return this.http.put(Http.normalize(this.path, url), content, config)
      .then(Http.then)
  }

  /**
   * @param {String} url
   * @param {Object} data
   * @returns {Promise}
   */
  patch (url, data) {
    return this.http.patch(Http.normalize(this.path, url), sanitize(data))
      .then(Http.then)
  }

  /**
   * @param {String} url
   * @param {Object} config
   * @returns {Promise}
   */
  delete (url, config = { showCatchMessage: true }) {
    return this.http.delete(Http.normalize(this.path, url), config)
      .then(Http.then)
  }
}
