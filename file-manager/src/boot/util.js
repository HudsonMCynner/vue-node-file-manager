// eslint-disable-next-line import/named
import { apply, clone, prop, ref, uniqueKey, groupArrayByProps } from '../app/Util'

/**
 * @param {Vue} Vue
 */
export default ({ Vue }) => {
  Object.defineProperty(Vue.prototype, '$util', {
    get () {
      return {
        /**
         * @param {String} path
         * @param {Object} props
         */
        browse: (path, props = {}) => this.$root.$emit('app:tab.browse', path, props),
        /**
         * @param {String} path
         * @param {Object} props
         */
        newBrowse: (path, props = {}) => this.$root.$emit('app:tab.openPath', path, props),
        /**
         */
        close: (domain) => this.$root.$emit('app:tab.close', domain),
        /**
         * @param {String} reference
         * @returns {Object}
         */
        ref: (reference) => ref(this, reference),
        /**
         * @returns {String}
         */
        uniqueKey: uniqueKey,
        /**
         * @param {Object|Array} structure
         * @param {String} path
         * @returns {*} Returns the resolved value
         */
        prop: prop,
        /**
         * @param {Object|Array} structure
         * @param {String} path
         * @param {*} Value
         * @returns {*} Returns the resolved value
         */
        apply: apply,
        /**
         * @param {Object|Array} structure
         * @returns {*}
         */
        clone: clone,
        /**
         */
        groupArrayByProps: groupArrayByProps,
        /**
         * @param {*} params
         */
        log: console.log
      }
    }
  })
}
