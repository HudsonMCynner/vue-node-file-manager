import axios from 'axios'

export const BASE_URL = `${process.env.app.configurationFile ? window.configuration.serverAPI : process.env.api.BASE_URL}`
export let TOKEN = ''
const standard = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
  transformResponse: [
    function (data) {
      return data
    }
  ]
})
/**
 * @param {String} token
 */
export const setToken = (token) => {
  delete standard.defaults.headers.common.Authorization
  if (token) {
    token = (`Bearer ${token.replace('Bearer ', '')}`)
    standard.defaults.headers.common.Authorization = token
    TOKEN = token
  }
}

/**
 * @returns {string}
 */
export const getToken = () => {
  return standard.defaults.headers.common.Authorization
}

/**
 * @param {Number} idSistema
 */
export const setSistemaHeader = (idSistema) => {
  standard.defaults.headers.common.SISTEMA = idSistema
}

/**
 * @param {String} versaoSistema
 */
export const setVersaoSistemaHeader = (versaoSistema) => {
  standard.defaults.headers.common.VERSAO_SISTEMA = versaoSistema
}
/**
 * @param {Number} idModulo
 */
export const setModuloHeader = (idModulo) => {
  standard.defaults.headers.common.MODULO = idModulo
}
/**
 * @param {Number} idCliente
 */
export const setClienteHeader = (idCliente) => {
  if (!idCliente) {
    delete standard.defaults.headers.common.CLIENTE
    return
  }
  standard.defaults.headers.common.CLIENTE = idCliente
}
/**
 * @param {Number} idMatricula
 */
export const setMatriculaHeader = (idMatricula) => {
  if (!idMatricula) {
    delete standard.defaults.headers.common.MATRICULA
    return
  }
  standard.defaults.headers.common.MATRICULA = idMatricula
}

export const responseSuccess = (response) => {
  if (response.headers && response.headers.authorization) {
    setToken(response.headers.authorization)
  }
  return response
}

const responseError = function (error) {
  if (!error.response) {
    return Promise.reject(error)
  }
  //
  // if (error.response.status === 423) {
  //   let data = JSON.parse(error.response.data)
  //   info('', data.message)
  //   $router.push('/auth/login')
  //   return Promise.reject(error)
  // }
  //
  // if (error.response.status === 426) {
  //   let data = JSON.parse(error.response.data)
  //   info('', data.message)
  //     .then(() => {
  //       window.location.reload(true)
  //     })
  //   return Promise.reject(error)
  // }
  //
  // if (error.response.status === 401) {
  //   let data = JSON.parse(error.response.data)
  //   info('', data.message)
  //   $router.push('/auth/login')
  // }
  //
  // if (error.response.status === 403) {
  //   info('', lang('prototype.request.forbidden.message'))
  //   return Promise.reject(JSON.parse(error.response.data))
  // }
  //
  // if (error.response.data) {
  //   return Promise.reject(JSON.parse(error.response.data))
  // }

  return Promise.reject(error)
}

standard.interceptors.response.use(responseSuccess, responseError)
export default standard
