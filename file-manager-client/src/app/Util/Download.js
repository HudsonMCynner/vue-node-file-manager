/*
 * **********************************************
 * tagnos
 * TDR Informática Ltda
 * Todos os direitos reservados ©
 * **********************************************
 * Nome do arquivo: Download.js
 * Criado por : Wender Galan
 * Data da criação : 17/02/20
 * Observação :
 * **********************************************
 */
import { BASE_URL } from 'Common/src/config/service/standard'

export const NO_IMAGE = 'data:image/jpeg;base64,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'

/**
 * @param {String} b64Data
 * @param {String} contentType
 * @param {Number} sliceSize
 * @returns {Blob}
 */
const base64toBlob = (b64Data, contentType = 'application/octet-stream', sliceSize = 1024) => {
  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: contentType })
}

/**
 * @param {Object} file
 * @param {String} fileName
 * @param {String} fileType
 * @param {Object} response
 */
export const downloadFile = function (response, file = undefined, fileName = undefined, fileType = undefined, convertToBlob = true) {
  let blob = file
  if (convertToBlob) {
    blob = base64toBlob(file || response.file)
  }
  fileName = `${fileName || response.fileName}.${fileType || response.fileType}`
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.click()
}

/**
 * Faz a conversão da public key passada para o acesso a imagem no back-end.
 * @param {String} key
 * @returns {String} retorna um base64 de sem imagem ou a URL de acesso.
 */
export const convertPublicKeyToUri = function (key) {
  if (!key) {
    return NO_IMAGE
  }
  return `${BASE_URL}/files?key=${key}`
}

/**
 * @param url
 * @returns {string}
 */
export const convertUrlYoutubeToUrlEmbed = function (url) {
  let inicioURL = url.indexOf('=')
  if (inicioURL === -1) {
    inicioURL = url.lastIndexOf('/')
  }
  return `https://www.youtube.com/embed/${url.slice(inicioURL + 1, inicioURL + 12)}`
}
