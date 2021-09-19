<template>
  <q-dialog v-model="fixed">
    <q-card>
      <q-card-section>
        <div class="text-h6">
          Terms of Agreement
        </div>
      </q-card-section>

      <q-separator />
      <q-card-section>
        <q-btn
          label="Pasta"
          color="primary"
          @click="selectFolder"
        />
        <q-btn
          flat
          label="Arquivo"
          color="primary"
          @click="selectFiles"
        />
      </q-card-section>

      <q-card-section>
        <div class="files-container">
          <div
            class="file-content"
            v-for="(file, index) in 50"
            :key="index"
          >
            <span>{{ file }}</span>
            <div class="progress-content">
              <div class="progress">
                <div class="progress-bar" />
              </div>
              <span class="progress-counter">{{ '100%' }}</span>
              <q-icon
                name="check_circle"
                v-if="false"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          flat
          label="Accept"
          color="primary"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import FileService from 'src/service/FileListService'

export default {
  name: 'ModalUpload',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  created () {
    this.model = this.value
  },
  data: () => ({
    model: null,
    fixed: true,
    files: [{ name: 'kasdjlasd' }]
  }),
  methods: {
    selectFiles () {
      this.getFile(true, false).then((files) => {
        FileService.build().uploadFiles(files, this.folderPath, this)
          .then(this.updateList)
      })
    },
    selectFolder () {
      this.getFile(false, true).then((files) => {
        if (!files.length) {
          return this.$notify.info('Nenhum arquivo selecionado')
        }
        let folder = files[0].webkitRelativePath.split('/')[0]
        console.log('~> ', folder)
        FileService.build().uploadFiles(files, this.folderPath, this)
          .then(this.updateList)
      })
    }
  },
  watch: {
    value: {
      handler (value) {
        this.model = value
      },
      deep: true
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
  height: 600px;
  .files-container
    height: 390px;
    overflow auto;
    .file-content
      padding: 5px;
      border: 1px solid #ada6a6;
      .progress-content
        display grid
        grid-template-columns 1fr 30px
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
          .progress-bar
            width 100%
            height 100%
            border-radius: 5px;
            background #33ce4f
    &::-webkit-scrollbar
      display none
</style>
