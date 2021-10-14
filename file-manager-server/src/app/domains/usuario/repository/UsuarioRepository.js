import Repository from '../../../crud/repository/Repository'
import User from '../entity/usuario'

/**
 * @typedef {UsuarioRepository}
 */
export default class UsuarioRepository extends Repository {
	entity = User
}

