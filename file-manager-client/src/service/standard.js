import axios from 'axios'

export const BASE_URL = `${process.env.app.configurationFile ? window.configuration.serverAPI : process.env.api.BASE_URL}`
export let TOKEN = ''
const standard = axios.create({
  baseURL: `${BASE_URL}/api`,
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

  return Promise.reject(error)
}

standard.interceptors.response.use(responseSuccess, responseError)
export default standard
