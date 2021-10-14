import Repository from '../../../crud/repository/Repository'
import File from '../entity/File'

/**
 * @typedef {UsuarioRepository}
 */
export default class FileRepository extends Repository {
  entity = File
}

