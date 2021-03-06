<template>
  <q-dialog
    v-model="model"
    no-backdrop-dismiss
    no-esc-dismiss
  >
    <q-card>
      <q-separator />
      <q-card-section>
        <div class="modal-upload-header">
          <div class="header-title">
            Enviar Arquivos
          </div>
          <div class="header-actions">
            <q-btn
              outline
              label="Pasta"
              color="primary"
              @click="selectFiles(false, true)"
            />
            <q-btn
              outline
              label="Arquivo"
              color="primary"
              @click="selectFiles(true, false)"
            />
            <q-btn
              v-if="false"
              outline
              label="Link"
              color="primary"
              @click="linkUpload"
            />
          </div>
          <div class="upload-info">
            <q-linear-progress
              v-if="false"
              stripe
              style="z-index: 9999;"
              size="25px"
              :value="getUploadPorcentage"
              color="primary"
            >
              <div class="absolute-full flex flex-center">
                <q-badge
                  color="white"
                  text-color="accent"
                  :label="`${(getUploadPorcentage * 100).toFixed(2)}%`"
                />
              </div>
            </q-linear-progress>
            <span v-if="files.length">{{ enviados }} de {{ files.length }} Arquivos Enviados</span>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="files-container">
          <div
            class="file-content"
            v-for="(file, index) in files"
            :key="index"
          >
            <div class="file-info">
              <span class="file-name">{{ file.file.name }}</span>
              <!--                            <span class="file-size-progress">{{ file.loaded }}</span>-->
              <span class="file-size">{{ kbToMb(file.loaded) }} / {{ kbToMb(file.file.size) }}</span>
              <q-icon
                name="fas fa-times"
                v-if="file.progress < 100"
                @click="removeFileFromUploadList(index)"
              />
            </div>
            <div class="progress-content">
              <div class="progress">
                <div
                  class="progress-bar"
                  :class="{'send-error': file.error }"
                  :style="{ width: `${file.progress}%`}"
                />
              </div>
              <span
                class="progress-counter"
                v-if="file.progress < 100 "
              >{{ file.progress }}%</span>
              <q-icon
                v-else
                name="fas fa-check-circle"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          flat
          label="Fechar"
          color="primary"
          @click="closeModal"
        />
        <q-btn
          v-if="files.length"
          flat
          label="Enviar"
          color="primary"
          @click="sendFiles"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import FileService from 'src/pages/services/FileService'
import FileMixin from 'src/app/Components/mixins/file'

export default {
  name: 'ModalUpload',
  mixins: [FileMixin],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    folderPath: {
      type: String,
      default: ''
    }
  },
  created () {
    this.model = this.value
    this.$root.$on('app:progress', this.progressbar)
  },
  destroyed () {
    this.$root.$off('app:progress')
  },
  data: () => ({
    progress: 1,
    model: false,
    files: [],
    enviados: 0
  }),
  methods: {
    removeFileFromUploadList (index) {
      this.files.splice(index, 1)
    },
    sendFiles () {
      if (!this.files.length) {
        return
      }
      const sendFileRecursive = (list, index) => {
        if (index >= list.length) {
          this.enviados = index
          setTimeout(() => {
            this.uploadEnd()
          }, 2000)
          return
        }
        this.enviados = index
        const updateProgress = (progress) => {
          list[index].progress = ((progress.loaded / progress.total) * 100).toFixed(2)
          list[index].loaded = progress.loaded // bytes loaded
        }
        FileService.build().uploadFiles([list[index].file], this.folderPath, list[index].folderPath, updateProgress)
          .then(() => {
            sendFileRecursive(list, (index + 1))
            // this.$emit('update:storage')
          })
          .catch(() => {
            list[index].erro = true
            sendFileRecursive(list, (index + 1))
          })
      }
      sendFileRecursive(this.files, 0)
    },
    uploadEnd () {
      this.resetData()
      this.closeModal()
      this.$emit('upload:end')
    },
    closeModal () {
      this.$emit('close')
    },
    resetData () {
      this.files = []
      this.enviados = 0
      this.totalUploadSize = 0
      this.totalUploadLoaded = 0
    },
    linkUpload () {
      fetch('https://upload.wikimedia.org/wikipedia/commons/7/77/Delete_key1.jpg')
        .then((res) => res.blob())
        .then((blob) => {
          console.log('~> ', blob)
        })
    },
    selectFiles (multiple, diretorio) {
      // this.resetData()
      this.getFile(multiple, diretorio).then((files) => {
        this.files = this.files.concat(Array.from(files).map((file) => {
          let fileObject = {
            file,
            progress: 0,
            loaded: '-',
            error: false
          }
          if (diretorio) {
            let paths = file.webkitRelativePath.split('/')
            fileObject.folderPath = paths.slice(0, paths.length - 1).join('/')
          }
          return fileObject
        }))
        this.totalUploadSize = this.files.map((file) => file.file.size).reduce((acc, next) => acc + next)
      })
    }
  },
  watch: {
    value: {
      handler (value) {
        this.resetData()
        this.model = value
      },
      deep: true
    }
  },
  computed: {
    getUploadPorcentage () {
      return this.totalUploadLoaded && this.totalUploadLoaded ? (this.totalUploadLoaded / this.totalUploadSize) : 0
    },
    getProgress () {
      return this.files.length ? this.enviados / this.files.length : 0
    }
  }
}
</script>

<style
  lang="stylus"
  scoped
>
.q-card
  width: 600px;
  height: 610px;
  .modal-upload-header
    display grid
    grid-template-columns 1fr
    grid-template-rows 2fr
    grid-gap 5px
    .header-title
      grid-column 1
      grid-row 1
      font-size 20px
      color grey
    .header-actions
      display grid
      grid-gap 5px
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
      grid-column 1
      grid-row 2
    .upload-info
      display grid
      grid-template-columns 1fr 190px
      grid-column-gap 10px
      justify-content space-between
      align-items center
  .files-container
    height: 405px
    overflow auto;
    .file-content
      padding: 5px 2px;
      .file-info
        display grid
        grid-template-columns 1fr 150px 25px
        align-items center
        grid-column-gap: 5px;
        .q-icon
          font-size 18px
          cursor pointer
          &:hover
            color red
        .file-name
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          width: 100%;
        .file-size
          text-align right
      .progress-content
        display grid
        grid-template-columns 1fr 45px
        grid-gap 5px
        align-items center
        .progress-counter
          font-size 12px
          color grey
        .q-icon
          color: #33ce4f;
          font-size: 16px;
        .progress
          width: 100%
          height: 8px;
          border-radius: 5px;
          border 1px solid #bbb7b7
          .progress-bar
            height 100%
            border-radius: 5px;
            background #33ce4f
          .send-error
            width 100% !important
            background #c32c2c !important
    &::-webkit-scrollbar
      display none
</style>
