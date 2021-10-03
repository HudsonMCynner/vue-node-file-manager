/**
 * @typedef {Route}
 */
export default class Route {
	/**
	 * @type {Express}
	 */
	app = undefined

	/**
	 * @type {string}
	 */
	domain = ''

	/**
	 * @type {Controller}
	 */
	controller

	/**
	 * @type {this}
	 * @private
	 */
	static _instance = undefined

	/**
	 * @param {Express} app
	 */
	constructor (app) {
		this.app = app
	}

	sync () {
		this.controller.sync()
	}

	/**
	 */
	getById () {
		this.app.get(`/${this.domain}/:_id`, (req, res, next) => {
			this.controller.getById(req, res, next)
		})
	}

	/**
	 */
	getAll () {
		this.app.get(`/${this.domain}`, (req, res, next) => {
			this.controller.getAll(req, res, next)
		})
	}

	/**
	 */
	deleteById () {
		this.app.delete(`/${this.domain}/:_id`, (req, res, next) => {
			this.controller.deleteById(req, res, next)
		})
	}

	/**
	 */
	alter () {
		this.app.put(`/${this.domain}`, (req, res, next) => {
			this.controller.alter(req, res, next)
		})
	}

	/**
	 */
	save () {
		this.app.post(`/${this.domain}`, (req, res, next) => {
			this.controller.save(req, res, next)
		})
	}

	/**
	 * @private
	 */
	_startRoutes () {
		this.sync()
		this.getById()
		this.getAll()
		this.deleteById()
		this.alter()
		this.save()
	}

	/**
	 * @returns {e.Express}
	 */
	getRouter () {
		this._startRoutes()
		return this.app
	}

	/**
	 * @param {Express} app
	 * @returns {this}
	 */
	static build (app) {
		return new this(app)
	}

	/**
	 * @param {Express} app
	 * @returns {this}
	 */
	static instance (app) {
		if (!this._instance) {
			this._instance = this.build(app)
		}
		console.log('router ->', this._instance.constructor.name)
		return this._instance
	}
}
