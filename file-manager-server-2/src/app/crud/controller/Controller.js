/**
 * @typedef {Controller}
 */
export default class Controller {
	/**
	 * @type {Repository}
	 */
	repository = undefined

	/**
	 * @type {this}
	 * @private
	 */
	static _instance = undefined

	/**
	 */
	constructor () {
	}

	sync () {
		this.repository.sync()
	}

	/**
	 * @param req
	 * @param res
	 * @param next
	 */
	getById (req, res, next) {
		this.repository.getById(req.params._id)
			.then((result) => {
				res.status(200).send(result)
			}).catch((error) => {
			res.status(500).send({
				err: 'Was not possible to find the register!',
				detail: error
			})
		})
	}

	/**
	 * @param req
	 * @param res
	 * @param next
	 */
	getAll (req, res, next) {

		let offset = req.query.offset
		let limit = req.query.limit

		this.repository.getAll(offset, limit)
			.then((result) => {
				res.status(200).send(result)
			}).catch((error) => {
			res.status(500).send({
				err: 'Was not possible to find the registers!',
				detail: error
			})
		})
	}

	/**
	 * @param req
	 * @param res
	 * @param next
	 */
	deleteById (req, res, next) {
		this.repository.deleteById(req.params._id)
			.then((result) => {
				res.status(200).send(result)
			}).catch((error) => {
			res.status(500).send({
				err: 'Was not possible to delete the register!',
				detail: error
			})
		})
	}

	/**
	 * @param req
	 * @param res
	 * @param next
	 */
	alter (req, res, next) {
		this.repository.update(req.body)
			.then((result) => {
				// res.status(200).send(result)
				req.params._id = req.body.id
				this.getById(req, res, next)
			}).catch((error) => {
			console.log(error)
			res.status(500).send({
				err: 'Was not possible to update the register!',
				detail: error
			})
		})
	}

	/**
	 * @param req
	 * @param res
	 * @param next
	 */
	save (req, res, next) {
		this.repository.insert(req.body)
			.then((result) => {
				res.status(200).send(result)
			}).catch((error) => {
			res.status(500).send({
				err: 'Was not possible to insert a new register!',
				detail: error
			})
		})
	}

	/**
	 * @returns {this}
	 */
	static build () {
		return new this()
	}

	/**
	 * @returns {this}
	 */
	static instance () {
		if (!this._instance) {
			this._instance = this.build()
		}
		console.log('controller ->', this._instance.constructor.name)
		return this._instance
	}
}
