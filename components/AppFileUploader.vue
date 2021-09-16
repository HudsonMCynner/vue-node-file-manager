<template>
  <div>
    <div
      class="upload-container"
      v-click-outside="clickOutside"
      :class="{ 'input-field-active': inputField }"
    >
      <div class="upload-body">
        <div
          class="upload-field"
          v-if="inputField"
          v-file-drop="filesSelected"
          v-file-dragleave
          v-file-dragover
          @dblclick="selectFiles"
        >
          <div class="upload-field-info">
            <div v-if="files.length || remoteAttach">
              <div
                class="upl-btn"
                @click="clearFiles"
                v-if="!disable && !readonly"
              >
                <q-icon
                  :name="actions.clearAll.icon"
                />
                <q-tooltip> {{ actions.clearAll.tooltip }}</q-tooltip>
              </div>
              <div>
                <div
                  class="file-size"
                  v-if="multiple"
                >
                  {{ files.length }} Arquivo(s)
                </div>
                <small>
                  {{ multiple ? `Total: ${getTotalSizeOfFiles }`: files.length ? `${files[0].name || files[0].fileName} - ${getTotalSizeOfFiles}` : remoteAttach ? 'Arquivo Anexado' : '' }}
                </small>
              </div>
            </div>
          </div>
          <div class="upload-field-btn">
            <div
              class="upl-btn"
              @click="selectFiles"
              v-if="multiple ? true : !remoteAttach ? files.length < 1 : false"
            >
              <q-icon :name="actions.add.icon" />
              <q-tooltip> {{ actions.add.tooltip }}</q-tooltip>
            </div>
          </div>
        </div>
        <div
          v-if="dropZone && !inputField && !disable && !readonly"
          class="drop-zone"
          v-file-drop="filesSelected"
          v-file-dragleave
          v-file-dragover
        >
          <span>Arraste e Solte os Arquivos Aqui</span>
        </div>
      </div>
    </div>
    <q-dialog v-model="modal">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <q-input
            style="width: 100%"
            dense
            ref="input"
            outlined
            placeholder="Url..."
            v-model="fileUrl"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="primary"
            label="Cancel"
          />
          <q-btn
            color="primary"
            label="OK"
            @click="downloadAndReadFile"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
// import { lang } from 'Common/src/app/Util/Lang'
import { downloadFile } from 'src/util/download'

export default {
  name: 'AppFileUploader',
  directives: {
    'click-outside': {
      bind: function (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          // here I check that click was outside the el and his children
          if (!(el === event.target || el.contains(event.target))) {
            // and if it did, call method provided in attribute value
            vnode.context[binding.expression](event)
          }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unbind: function (el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      }
    },
    'file-drop': {
      bind: function (el, binding, vnode) {
        el.drop = (event) => {
          event.preventDefault()
          vnode.context[binding.expression](event.dataTransfer.files)
          el.classList.remove('active')
        }
        el.addEventListener('drop', el.drop)
      },
      unbind: function (el) {
        el.removeEventListener('drop', el.drop)
      }
    },
    'file-dragover': {
      // eslint-disable-next-line no-unused-vars
      bind: function (el, binding, vnode) {
        el.dragover = (event) => {
          event.preventDefault()
          el.classList.add('active')
        }
        el.addEventListener('dragover', el.dragover)
      },
      unbind: function (el) {
        el.removeEventListener('dragover', el.dragover)
      }
    },
    'file-dragleave': {
      // eslint-disable-next-line no-unused-vars
      bind: function (el, binding, vnode) {
        el.dragleave = (event) => {
          event.preventDefault()
          el.classList.remove('active')
        }
        el.addEventListener('dragleave', el.dragleave)
      },
      unbind: function (el) {
        el.removeEventListener('dragleave', el.dragleave)
      }
    }
  },
  props: {
    /**
     * usado para carregar o arquivo
     **/
    value: {
      type: [String, FormData, Object, File, Array],
      default: ''
    },
    base64File: {
      type: Array,
      default: () => ([])
    },
    /**
     * Usado para exibir um input padão
     **/
    inputField: {
      type: Boolean,
      default: true
    },
    url: {
      type: [String],
      default: ''
    },
    /**
     * Usado para definir o tamanho da lista de arquivos
     **/
    listMaxHeight: {
      type: String,
      default: '150px'
    },
    disable: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    /**
     * Usado para não validar o formato do arquivo
     **/
    ignoreType: {
      type: Boolean,
      default: false
    },
    /**
     * Usado para não validar o tamanho do arquivo
     **/
    ignoreSize: {
      type: Boolean,
      default: false
    },
    /**
     * Usado para habilitar mutiplos arquivos
     **/
    multiple: {
      type: Boolean,
      default: false
    },
    /**
     * Usado para habilitar a area de drop de arquivos
     **/
    dropZone: {
      type: Boolean,
      default: true
    },
    /**
     * Usado para definir quais extensoes e formatos sao permitidos
     **/
    format: {
      type: [String, RegExp, Function, Object],
      default: () => (/pdf|docx|doc|xlsx|xls|odt|txt|png|jpeg|jpg/)
    },
    /**
     * Usado para definir tamanho maximo do arquivo
     * */
    maxSize: {
      type: Number, // 10 Mb
      default: (10 * 1024 * 1024)
    },
    /**
     * Usado para controla se sera exibida as mensagens padão de validação do componente
     **/
    defaultMessage: {
      type: Boolean,
      default: true
    },
    /**
     * Usado para controlar se o download sera feito pelo componente ou externamente
     */
    automaticDownload: {
      type: Boolean,
      default: false
    },
    /**
     * Propriedade na qual se identifica o nome do arquivo
     */
    fileNameProp: {
      type: String,
      default: 'name'
    },
    /**
     * Usado para indicar que existe um arquivo, mas o mesmo esta fora do componente
     */
    externalAttach: {
      type: Boolean,
      default: false
    },
    removeConfirmation: {
      type: Function,
      default: function () {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
          return resolve()
        })
      }
    },
    /**
     * Usado quando a remoção não é feita pelo componente
     */
    manualRemove: {
      type: Boolean,
      default: false
    },
    /**
     * Usado como filtro dos arquivos em caso de remoção manual
     */
    excludeProp: {
      type: String,
      default: ''
    },
    actions: {
      type: Object,
      default: () => ({
        clearAll: {
          icon: 'remove',
          tooltip: 'Limpar Tudo'
        },
        add: {
          icon: 'add',
          tooltip: 'Adicionar'
        },
        upload: {
          icon: 'upload',
          tooltip: 'Enviar'
        },
        download: {
          icon: 'download',
          tooltip: 'Download'
        },
        remove: {
          icon: 'remove',
          tooltip: 'Excluir'
        }
      })
    }
  },
  created () {
    this.model = this.value ? this.value : []
    this.remoteAttach = this.externalAttach
    if (Array.isArray(this.value)) {
      this.files = this.value
    }
  },
  data: () => ({
    model: null,
    files: [],
    showList: false,
    modal: false,
    fileUrl: null,
    remoteAttach: false
  }),
  methods: {
    downloadFiles (value) {
      if (this.remoteAttach) {
        return this.$emit('files:external:download')
      }
      for (const file of value) {
        if (file instanceof File) {
          downloadFile({}, file, file.name, file.type.split('/')[1], false)
          return
        }
        if (file.file && file.file instanceof File) {
          downloadFile({}, file.file, file.file.name, file.file.type.split('/')[1], false)
          return
        }
        if (this.automaticDownload) {
          return this.$emit('files:download', file)
        }
        downloadFile(file)
      }
    },
    downloadAndReadFile () {
      // https://i.pinimg.com/originals/47/0a/19/470a19a36904fe200610cc1f41eb00d9.jpg
      fetch('https://upload.wikimedia.org/wikipedia/commons/7/77/Delete_key1.jpg')
        .then((res) => res.blob())
        .then((blob) => {
          console.log('~> ', URL.createObjectURL(blob))
        })
    },
    getFile () {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        const element = document.createElement('input')
        element.type = 'file'
        element.id = 'tempFile'
        if (this.multiple) {
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
    selectFiles () {
      this.getFile().then(this.filesSelected)
    },
    emitInput () {
      if (this.multiple) {
        return this.$emit('input', this.files)
      }
      this.$emit('input', this.files.length ? this.files[0] : null)
    },
    removeFile (file) {
      // TODO: fazer forma de confirmação de exclusao ou rowback ou desfazer exclusao
      const index = this.files.indexOf(file)
      if (this.manualRemove) {
        this.$emit('files:remove', file)
        return
      }
      this.$emit('files:remove', file)
      this.files.splice(index, 1)
      this.emitInput()
      // this.removeConfirmation()
      //   .then(() => {
      //
      //   })
    },
    downloadFile (index) {
      this.$emit('download', this.files[index])
    },
    clickOutside () {
      this.showList = false
    },
    clearFiles () {
      if (this.remoteAttach) {
        this.$emit('files:external:remove')
        return
      }
      this.$emit('files:remove', this.files)
      this.files = []
      this.emitInput()
    },
    renderImage (file) {
      if (file && file instanceof File) {
        return URL.createObjectURL(file)
      }
      if (file.file && file.file instanceof File) {
        return URL.createObjectURL(file.file)
      }
      return ''
    },
    isImage (file) {
      if (file instanceof File) {
        return Boolean(file.type.split('/')[1].match(/png|jpeg|jpg/))
      }
      if (file.file && file.file.type) {
        return Boolean(file.file.type.split('/')[1].match(/png|jpeg|jpg/))
      }
      return ''
    },
    errorSize () {
      if (this.defaultMessage) {
        // this.$message.toast(lang(`prototype.components.appUpload.sizeExceeded`), 'error')
      } else {
        this.$emit('size:exceeded')
      }
    },
    errorType () {
      if (this.defaultMessage) {
        let formatosAceitos = this.format
        if (this.format instanceof RegExp) {
          // eslint-disable-next-line no-unused-vars
          formatosAceitos = this.format.toString()
            .replace(/[//"]/g, '')
            .split('|')
            .join(', ')
        }
        // this.$message.toast(lang('prototype.components.appUpload.formatError', { formatosAceitos: formatosAceitos }), 'error')
        return false
      }
      this.$emit('format:error')
    },
    validateType (fileType) {
      if (!this.ignoreType) {
        const result = fileType.split('/')[1].match(this.format)
        if (!result) {
          return this.errorType()
        }
        return result
      }
      return true
    },
    validateSize (fileSize) {
      if (!this.ignoreSize) {
        const result = fileSize < this.maxSize
        if (!result) {
          this.errorSize()
        }
        return result
      }
      return true
    },
    filesSelected (files) {
      if (this.multiple) {
        Array.from(files).forEach((file) => {
          if (this.validateType(file.type) && this.validateSize(file.size)) {
            this.files.unshift(file)
          }
        })
        this.emitInput()
        return
      }
      if (this.validateType(files[0].type) && this.validateSize(files[0].size)) {
        this.files = [files[0]]
        this.emitInput()
      }
    },
    removeFiles (index) {
      this.files.splice(index, 1)
    },
    kbToMb (kbts) {
      return kbts ? (kbts / (1024 * 1024)).toFixed(2) + 'MB' : ''
    },
    getFileName (file) {
      return file.name ? file.name : file[this.fileNameProp] ? file[this.fileNameProp] : ''
    },
    recoverMimeType (type) {
      switch (type) {
        case 'pdf':
          return 'application/pdf'
        case 'txt':
          return 'text/plain'
        case 'jpeg':
          return 'image/jpeg'
        case 'png':
          return 'image/png'
        case 'gif':
          return 'image/gif'
        case 'bmp':
          return 'image/bmp'
        case 'webp':
          return 'image/webp'
        case 'mp4':
          return 'video/mp4'
        case 'webm':
          return 'video/webm'
        case 'ogg':
          return 'video/ogg'
        default:
          return 'application/octet-stream'
      }
    },
    urltoFile (url, filename, mimeType) {
      return (fetch(url)
        .then(function (res) {
          return res.arrayBuffer()
        })
        .then(function (buf) {
          return new File([buf], filename, { type: mimeType })
        })
      )
    }
  },
  watch: {
    value: {
      handler (value) {
        this.files = value ? this.multiple ? value : [value] : []
      },
      deep: true
    },
    externalAttach: {
      handler (value) {
        this.remoteAttach = value
      }
    },
    base64File: {
      handler (value) {
        let arrayFiles
        if (this.multiple) {
          arrayFiles = value
        } else {
          arrayFiles = [value[0]]
        }
        // eslint-disable-next-line array-callback-return
        arrayFiles.map((item) => {
          const mimeType = this.recoverMimeType(item.fileType)
          this.urltoFile(`data:${mimeType};base64,${item.file}`, item.fileName, mimeType)
            .then((file) => {
              this.files.push(file)
            })
        })
      },
      deep: true
    }
  },
  computed: {
    getFiles () {
      return this.manualRemove ? this.files.filter((file) => !file[this.excludeProp]) : this.files
    },
    getTotalSizeOfFiles () {
      const sizes = this.files.length && this.files.every((file) => file.size || file.fileSize) ? this.files.map((file) => file.size || file.fileSize) : []
      return sizes.length ? (sizes.reduce((acc, next) => acc + next) / (1024 * 1024)).toFixed(2) + 'MB' : ''
    }
  }
}
</script>

<style
    scoped
>
.upl-btn {
  cursor: pointer;
  height: 25px;
  width: 25px;
  border: 1px solid;
  border-radius: 5px;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  color: #000;
  border-color: #d2d2d2;
}
.upload-container {
  min-width: 240px;
  display: flex;
  flex-direction: column;
  border-radius: 3px;
}
.upload-container .upload-header {
  color: #fff;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  border: 1px solid #959595;
}
.upload-container .upload-header .clear-all {
  width: 40px;
}
.upload-container .upload-header .clear-all .q-icon {
  font-size: 15px;
  padding: 5px;
}
.upload-container .upload-header .info {
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  width: calc(100% - 60px - 20px);
  color: #000;
}
.upload-container .upload-header .add-file {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.upload-container .upload-header .add-file .q-icon {
  padding: 5px;
  font-size: 15px;
}
.upload-container .upload-body {
  position: relative;
  border-width: 0 1px 1px 1px;
  border-style: solid;
  border-color: #959595;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}
.upload-container .upload-body .upload-field {
  padding: 0 5px;
  border-radius: 5px;
  width: 100%;
  height: 40px;
  border: 1px solid #959595;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.upload-container .upload-body .upload-field .upload-field-info > div {
  color: rgba(0,0,0,0.541);
  display: flex;
  align-items: center;
  flex-direction: row;
}
.upload-container .upload-body .upload-field .upload-field-info .upl-btn .q-icon {
  font-size: 15px;
  margin: unset;
}
.upload-container .upload-body .upload-field .upload-field-btn {
  color: rgba(0,0,0,0.541);
  display: flex;
  flex-direction: row;
}
.upload-container .upload-body .upload-field .upload-field-btn .upl-btn .q-icon {
  font-size: 15px;
  margin: unset;
}
.upload-container .upload-body .drop-zone {
  padding: 5px;
  width: calc(100% - 10px);
  height: 50px;
  margin: 5px;
  border-radius: 5px;
  border-width: 1px;
  border-style: dashed;
  display: flex;
  justify-content: center;
  align-items: center;
}
.upload-container .upload-body .drop-zone span {
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
}
.upload-container .upload-body .files-list {
  width: 100%;
  word-break: break-all;
  padding: 5px;
  overflow: auto;
}
.upload-container .upload-body .files-list .img-item {
  position: relative;
  width: 100%;
  height: 200px;
  margin: 5px 2px;
}
.upload-container .upload-body .files-list .img-item .image-info {
  width: 100%;
  padding: 5px 5px 10px 5px;
  background: linear-gradient(180deg, rgba(140,136,136,0.702) 20%, rgba(248,248,248,0.078));
  position: absolute;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  left: 0;
  top: 0;
  display: flex;
  justify-content: space-between;
  min-height: 40px;
}
.upload-container .upload-body .files-list .img-item .image-info .description {
  width: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  font-size: 16px;
  color: #fff;
}
.upload-container .upload-body .files-list .img-item .remove-btn {
  position: absolute;
  right: 0;
  top: 0;
}
.upload-container .upload-body .files-list .img-item .remove-btn .q-icon {
  font-size: 14px;
}
.upload-container .upload-body .files-list .img-item .download-btn {
  position: absolute;
  right: 50px;
  top: 0;
}
.upload-container .upload-body .files-list .img-item .download-btn .q-icon {
  font-size: 16px;
}
.upload-container .upload-body .files-list .img-item .image-preview {
  height: 100%;
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 10px;
}
.upload-container .upload-body .files-list .file-item {
  position: relative;
  width: 100%;
  margin: 5px 2px;
  background: #f5f5f5;
  border: 1px solid #a0a0a0;
  border-radius: 10px;
}
.upload-container .upload-body .files-list .file-item .image-info {
  width: 100%;
  padding: 5px 5px 10px 5px;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  display: flex;
  justify-content: space-between;
  min-height: 40px;
}
.upload-container .upload-body .files-list .file-item .image-info .description {
  width: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  font-size: 16px;
  color: #000;
  line-height: 15px;
}
.upload-container .upload-body .files-list .file-item .remove-btn {
  position: absolute;
  right: 0;
  top: 0;
}
.upload-container .upload-body .files-list .file-item .remove-btn .q-icon {
  font-size: 16px;
}
.upload-container .upload-body .files-list .file-item .download-btn {
  position: absolute;
  right: 50px;
  top: 0;
}
.upload-container .upload-body .files-list .file-item .download-btn .q-icon {
  font-size: 14px;
}
.active {
  background: #000;
  color: #fff;
}
.input-field-active {
  border-width: 0 !important;
}
.input-field-active .upload-body {
  border-width: 0 !important;
}
.input-field-active .upload-body .files-list {
  background: #fff;
  width: 100%;
}
.input-field-active .files-list {
  border-width: 0 1px 1px 1px !important;
  border-radius: 5px;
  border-color: #959595;
  border-style: solid;
}
</style>
