/**
 * @param {String} pattern
 * @param {*} value
 * @return {String}
 */
export const mask = (pattern, value) => {
  let masked = ''
  value = unMask(pattern, value)
  if (!value) {
    return ''
  }
  let j = 0
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === '*') {
      masked += '*'
      continue
    }
    if (j > value.length - 1) {
      return masked
    }
    if (pattern[i] === '#') {
      masked += value[j]
      j++
      continue
    }
    if (pattern[i] === '%') {
      masked += value[j]
      j++
      continue
    }
    masked += pattern[i]
  }
  return masked
}

/**
 * @param {string} pattern
 * @param {string} value
 * @return {string}
 */
export const unMask = (pattern, value) => {
  const chars = noDuplicates(String(pattern)
    .replace(/[#*%]/g, '')
    .split(''))
  return String(value)
    .replace(new RegExp('[' + chars.join(',') + ']', 'g'), '')
}

/**
 * @param {Array} array
 * @return {Array}
 */
export const noDuplicates = (array) => {
  const a = array.concat()
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) {
        a.splice(j--, 1)
      }
    }
  }
  return a
}

/**
 * @param {string} template
 * @param {Array|Object} replaces
 * @returns {string}
 */
export const replacement = (template, replaces) => {
  const string = String(template)
  // eslint-disable-next-line no-useless-escape
  const regex = (expression) => new RegExp('\\\{' + expression + '\\\}', 'g')

  if (Array.isArray(replaces)) {
    return replaces.reduce(
      (string, value, index) => string.replace(regex(index), String(value)),
      string
    )
  }

  if (typeof replaces === 'object') {
    return Object.keys(replaces)
      .reduce(
        (string, key) => string.replace(regex(key), String(replaces[key])),
        string
      )
  }

  return template
}

/**
 * @param {string} stringComAcento
 * @returns {string}
 */
export const removerAcentos = (stringComAcento) => {
  if (stringComAcento) {
    let string = stringComAcento
    let mapaAcentosHex = {
      a: /[\xE0-\xE6]/g,
      A: /[\xC0-\xC6]/g,
      e: /[\xE8-\xEB]/g,
      E: /[\xC8-\xCB]/g,
      i: /[\xEC-\xEF]/g,
      I: /[\xCC-\xCF]/g,
      o: /[\xF2-\xF6]/g,
      O: /[\xD2-\xD6]/g,
      u: /[\xF9-\xFC]/g,
      U: /[\xD9-\xDC]/g,
      c: /\xE7/g,
      C: /\xC7/g,
      n: /\xF1/g,
      N: /\xD1/g
    }

    for (let letra in mapaAcentosHex) {
      let expressaoRegular = mapaAcentosHex[letra]
      string = string.toString().replace(expressaoRegular, letra)
    }
    return string
  }
  return ''
}

/**
 * @param value
 * @returns {string|*}
 */
export const normalize = (value) => {
  const string = String(value)
  if (string.startsWith('/')) {
    return string.slice(1)
  }
  return value
}
