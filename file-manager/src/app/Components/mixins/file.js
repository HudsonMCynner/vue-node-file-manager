export default {
  methods: {
    getFile (multiple = this.multiple) {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        const element = document.createElement('input')
        element.type = 'file'
        element.id = 'tempFile'
        if (multiple) {
          element.multiple = true
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
    kbToMb (kbts) {
      return kbts ? (kbts / (1024 * 1024)).toFixed(2) + 'MB' : ''
    }
  }
}
