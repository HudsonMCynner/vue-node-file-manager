/**
 */
export default class Enum {
  /**
   * @param {Object} constants
   */
  constructor (constants) {
    this.constants = constants
  }

  /**
   * @param {Object} constants
   */
  static make (constants) {
    return (new this(constants))
      .generate()
  }

  /**
   * @returns {ReadonlyArray<any>}
   */
  generate () {
    const reduce = (accumulator, item) => {
      accumulator[item] = item
      return accumulator
    }
    return Object.freeze(this.constants.reduce(reduce, {}))
  }
}
