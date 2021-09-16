// noinspection NpmUsedModulesInstalled
import { Notify } from 'quasar'

/**
 * @param {String} message
 */
export const success = (message) => {
  Notify.create({
    message: message,
    color: 'positive',
    position: 'top-right'
  })
}

/**
 * @param {String} message
 */
export const fail = (message) => {
  Notify.create({
    message: message,
    color: 'warning',
    position: 'top-right'
  })
}

/**
 * @param {String} message
 */
export const info = (message) => {
  Notify.create({
    message: message,
    color: 'info',
    position: 'top-right'
  })
}

/**
 * @param {String} message
 */
export const error = (message) => {
  Notify.create({
    message: message,
    color: 'negative',
    position: 'top-right'
  })
}

/**
 * @param Vue
 * @returns {{success: success, info: info, error: error, warning: warning}}
 */
export default ({ Vue }) => {
  /**
   */
  Object.defineProperty(Vue.prototype, '$notify', {
    get () {
      return {
        success, error, fail, info
      }
    }
  })
}
