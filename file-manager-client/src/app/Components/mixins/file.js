export default {
  methods: {
    getFile (multiple = this.multiple, diretorio) {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        const element = document.createElement('input')
        element.type = 'file'
        element.id = 'tempFile'
        if (multiple) {
          element.multiple = true
        }
        if (diretorio) {
          element.webkitdirectory = true
          element.mozdirectory = true
        }
        element.style.display = 'none'
        element.click()
        element.addEventListener('input', (event) => {
          if (event.target.files.length) {
            resolve(event.target.files)
            document.body.removeChild(element)
            return
          }
          document.body.removeChild(element)
          return resolve([])
        })
        document.body.appendChild(element)
      })
    },
    kbToMb (bytes) {
      if (bytes >= 1073741824) {
        return (bytes / 1073741824).toFixed(2) + ' GB'
      }
      if (bytes >= 1048576) {
        return (bytes / 1048576).toFixed(2) + ' MB'
      }
      if (bytes >= 1024) {
        return (bytes / 1024).toFixed(2) + ' KB'
      }
      if (bytes > 1) {
        return bytes + ' bytes'
      }
      if (bytes === 1) {
        return bytes + ' byte'
      }
      else {
        return '0 bytes'
      }
    }
  }
}
