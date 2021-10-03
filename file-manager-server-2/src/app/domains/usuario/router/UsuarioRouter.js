import Route from '../../../crud/router/Route.js'
import UsuarioController from '../controller/UsuarioController.js'

/**
 * @typedef {UsuarioRouter}
 */
export default class UsuarioRouter extends Route {
	/**
	 * @type {string}
	 */
	domain = 'usuarios'

	/**
	 * @type {UsuarioController}
	 */
	controller = UsuarioController.instance()
}
