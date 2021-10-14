import Repository from '../../../crud/repository/Repository'
import Folder from '../entity/Folder'

/**
 * @typedef {UsuarioRepository}
 */
export default class FileRepository extends Repository {
  entity = Folder
}

