import Api from './Api'

/**
 * @type {Rest}
 * @link https://labs.omniti.com/labs/jsend
 */
export default class Rest extends Api {
  /**
   * @type {String}
   */
  static resource = ''

  /**
   * @type {Rest}
   * @private
   */
  static __instance = undefined

  /**
   * @type {String}
   */
  id = 'id'

  /**
   * @type {Number}
   */
  size = 30

  /**
   * @type {string}
   */
  separator = '='

  /**
   * @type {string}
   */
  joiner = ','

  /**
   * @param {String} resource
   * @param {Object} http
   * @param {Object} options
   */
  constructor (resource, http = null, options = {}) {
    super(Rest.normalize(Rest.base, resource), http, options)
  }

  /**
   * @param {Object} options
   * @param {Object} http
   * @returns {this}
   */
  static build (options = {}, http = null) {
    return new this(this.resource, http, options)
  }

  /**
   * @param {Object} options
   * @param {Object} http
   * @returns {this}
   */
  static instance (options = {}, http = null) {
    if (!this.__instance) {
      this.__instance = this.build(options, http)
    }
    return this.__instance
  }

  /**
   * @param {Object} record
   * @returns {Promise}
   */
  create (record) {
    return this.post('', record)
  }

  /**
   * @param {Object} record
   * @returns {Promise}
   */
  update (record) {
    return this.put('', record)
  }

  /**
   * @param {object} record
   */
  save (record) {
    return record.id ? this.update(record) : this.create(record)
  }

  /**
   * @param {String|Object} record
   * @returns {Promise}
   */
  read (record) {
    return this.get(`${this.__getId(record)}`)
  }

  /**
   * @param {Object} record
   * @returns {Promise}
   */
  destroy (record) {
    return this.delete(`/${this.__getId(record)}`)
  }

  /**
   * @param {String|Object} record
   * @returns {String}
   */
  __getId (record) {
    if (typeof record === 'object') {
      return `/${record[this.id]}`
    }
    return String(record)
  }
}
