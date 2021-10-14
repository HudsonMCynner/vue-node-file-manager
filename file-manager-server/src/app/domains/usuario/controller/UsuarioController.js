import Controller from '../../../crud/controller/Controller.js'
import UsuarioRepository from '../repository/UsuarioRepository.js'

/**
 * @typedef {UsuarioController}
 */
export default class UsuarioController extends Controller {
	/**
	 * @type {UsuarioRepository}
	 */
	repository = UsuarioRepository.instance()
}
