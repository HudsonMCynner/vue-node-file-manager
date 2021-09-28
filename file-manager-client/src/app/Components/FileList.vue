<template>
  <div class="file-lista-container">
    <div class="file-list-header">
      <q-btn
        outline
        :icon="modeView === 'grid' ? 'fas fa-th-large' : 'fas fa-list'"
        color="primary"
        @click="modeView = modeView === 'list' ? 'grid' : 'list'"
      />
      <q-btn
        outline
        :icon="sort ? 'fas fa-sort-alpha-up' : 'fas fa-sort-alpha-down'"
        color="primary"
        @click="toggleSort"
      />
      <q-input
        v-model="search"
        outlined
        dense
        placeholder="Pesquisar"
      >
        <template v-slot:append>
          <q-icon name="fas fa-search" />
        </template>
      </q-input>
      <q-btn
        outline
        icon="fas fa-upload"
        color="primary"
        @click="modalUpload = true"
      />
      <q-btn
        outline
        icon="fas fa-trash-alt"
        color="primary"
        @click="removeFile"
      />
      <modal-upload
        :folder-path="folderPath"
        @upload:end="uploadEnd"
        @update:storage="$emit('update:storage')"
        :value="modalUpload"
        @close="modalUpload = false"
      />
    </div>
    <div
      class="file-list-content tableFixHead"
      v-if="modeView === 'list'"
    >
      <table class="style-table">
        <thead class="style-thead">
          <tr>
            <th class="style-th">
              Nome
            </th>
            <th class="style-th">
              Tamanho
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(file, index) in getFiles"
            :key="index"
            @click="selectFile($event, file)"
            @click.right="selected = [file]"
            :class="{'selected-row': isSelected(file._id)}"
          >
            <td class="style-td">
              <div
                style="width: 100%;
    height: 35px;
    display: grid;
    align-items: center;
    grid-template-columns: 26px 1fr;
    grid-column-gap: 5px;
    padding: 0 2px;"
              >
                <q-icon
                  :name="getIcon(file)"
                  size="20px"
                />
                {{ file.name }}
              </div>
            </td>
            <td
              class="style-td"
              style="width: 90px"
            >
              {{ kbToMb(file.size) }}
            </td>
            <q-menu
              touch-position
              context-menu
            >
              <q-list
                dense
                style="min-width: 100px"
              >
                <q-item
                  clickable
                  @click="gerarLink(file)"
                  v-close-popup
                >
                  <q-item-section style="display: grid; grid-template-columns: 25px 1fr; align-items: center;">
                    <q-icon name="fas fa-link" style="font-size: 16px; color: #78a9f8"/>
                    Gerar Link
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  @click="rename(file)"
                  v-close-popup
                >
                  <q-item-section style="display: grid; grid-template-columns: 25px 1fr; align-items: center;">
                    <q-icon name="fas fa-download" style="font-size: 16px; color: #78a9f8"/>
                    Download
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  @click="rename(file)"
                  v-close-popup
                >
                  <q-item-section style="display: grid; grid-template-columns: 25px 1fr; align-items: center;">
                    <q-icon name="fas fa-i-cursor" style="font-size: 16px; color: #78a9f8"/>
                    Renomear
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="file-list-grid-view"
      v-if="modeView === 'grid'"
    >
      <div
        class="file-card"
        v-for="(file, index) in getFiles"
        :key="index"
        @click="selectFile($event, file)"
        @click.right="selected = [file]"
        :class="{'selected-row': isSelected(file._id)}"
      >
        <q-icon
          :name="getIcon(file)"
        />
        <span class="file-label">{{ file.name }}</span>
        <q-menu
          touch-position
          context-menu
        >
          <q-list
            dense
            style="min-width: 100px"
          >
            <q-item
              clickable
              @click="gerarLink(file)"
              v-close-popup
            >
              <q-item-section style="display: grid; grid-template-columns: 25px 1fr; align-items: center;">
                <q-icon name="fas fa-link" style="font-size: 16px; color: #78a9f8"/>
                Gerar Link
              </q-item-section>
            </q-item>
            <q-item
              clickable
              @click="downloadFile(file)"
              v-close-popup
            >
              <q-item-section style="display: grid; grid-template-columns: 25px 1fr; align-items: center;">
                <q-icon name="fas fa-download" style="font-size: 16px; color: #78a9f8"/>
                Download
              </q-item-section>
            </q-item>
            <q-item
              clickable
              @click="rename(file)"
              v-close-popup
            >
              <q-item-section style="display: grid; grid-template-columns: 25px 1fr; align-items: center;">
                <q-icon name="fas fa-i-cursor" style="font-size: 16px; color: #78a9f8"/>
                Renomear
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </div>
  </div>
</template>

<script>
import FileService from 'src/service/FileListService'
import ModalUpload from 'src/app/Components/ModalUpload'
import { BASE_URL } from 'src/service/standard'

export default {
  name: 'FileList',
  components: { ModalUpload },
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    folderPath: {
      type: String,
      default: ''
    }
  },
  created () {
    this.files = this.value
    if (!Array.prototype.last) {
      // eslint-disable-next-line no-extend-native
      Array.prototype.last = function () {
        return this[this.length - 1]
      }
    }
  },
  data: () => ({
    fileIcons: {
      pdf: 'fa fa-file-pdf',
      txt: 'fa fa-file-text',
      doc: 'fa fa-file-word',
      docx: 'fa fa-file-word',
      zip: 'fa fa-file-archive',
      rar: 'fa fa-file-archive',
      xls: 'fa fa-file-excel',
      xlsx: 'fa fa-file-excel',
      png: 'fa fa-file-image',
      jpg: 'fa fa-file-image',
      jpeg: 'fa fa-file-image',
      webp: 'fa fa-file-image',
      ogg: 'fa fa-file-audio',
      mp2: 'fa fa-file-audio',
      wma: 'fa fa-file-audio',
      mp4: 'fa fa-file-video',
      avi: 'fa fa-file-video',
      kmv: 'fa fa-file-video',
      html: 'fa fa-file-code',
      exe: 'fa fa-terminal',
      csv: 'fa fa-file-csv',
      others: 'fa fa-file',
      folder: 'fa fa-folder'
    },
    inputUpload: {
      inputField: true,
      dropZone: true,
      multiple: true
    },
    search: '',
    selectAll: false,
    model: null,
    selected: [],
    files: [],
    modalUpload: false,
    modeView: 'list', // list || grid
    sort: 1, // 1 - A-Z || 0 Z-A,
    range: {
      inicio: null,
      fim: null
    }
  }),
  methods: {
    toggleSort () {
      if (this.sort === 0) {
        this.sort = 1
        this.files = this.files.sort((a, b) => {
          if (a.folder && !b.folder) {
            return -1
          }
          if (!a.folder && b.folder) {
            return 1
          }
          return a.name.localeCompare(b.name)
        })
        return
      }
      this.sort = 0
      this.files = this.files.sort((a, b) => {
        if (a.folder && !b.folder) {
          return -1
        }
        if (!a.folder && b.folder) {
          return 1
        }
        return a.name.localeCompare(b.name)
      }).reverse()
    },
    getIcon (file) {
      if (file.folder) {
        return this.fileIcons['folder']
      }
      let icon = this.fileIcons[file.name.split('.').last()]
      return icon || this.fileIcons['others']
    },
    kbToMb (bytes) {
      if (typeof bytes !== 'number') {
        return ''
      }
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
    },
    updateList () {
      FileService.build().getFilesByDir(this.folderPath)
        .then((response) => {
          this.$emit('update:list')
          this.files = response
        })
    },
    downloadFile ({ encodedName, name }) {
      const link = document.createElement('a')
      link.href = `${BASE_URL}/file/download/${encodedName}`
      link.target = '_blank'
      link.download = name
      link.click()
      console.log('~> ', link.href)
    },
    rename (file) {
      console.log('~> ', file)
    },
    gerarLink ({ encodedName }) {
      navigator.clipboard.writeText(`${BASE_URL}/file/download/${encodedName}`)
      console.log('~> ', `${BASE_URL}/file/download/${encodedName}`)
      this.$notify.info('Link gerado e copiado')
    },
    uploadEnd () {
      this.updateList()
    },
    removeFile () {
      if (!this.selected.length) {
        return this.$notify.info('Selecione os arquivos para excluir.')
      }
      const removeRecursive = (list, index) => {
        if (index >= list.length) {
          this.selected = []
          this.updateList()
          return this.$notify.success('Arquivos excluídos com sucesso!')
        }
        FileService.build().deleteFile(list[index]._id, this.folderPath)
          .then(() => {
            FileService.build().getFilesByDir(this.folderPath)
              .then(removeRecursive(list, (index + 1)))
          })
      }
      removeRecursive(this.selected, 0)
    },
    selectFile (event, file) {
      if (event.ctrlKey) {
        const index = this.selected.findIndex((fileSel) => fileSel._id === file._id)
        if (index !== -1) {
          this.selected.splice(index, 1)
        }
        else {
          this.selected.push(file)
        }
        return
      }
      // if (event.shiftKey) {
      //   let inicio = 0
      //   if (this.selected.length) {
      //     inicio = this.files.findIndex((item) => item._id === this.selected[this.selected.length - 1]._id) // pega sempre o ultimo selecionado
      //   }
      //   let fim = this.files.findIndex((item) => item._id === file._id)
      //   if (inicio > fim) {
      //     for (let i = inicio; i <= fim; i--) {
      //       this.selected.push(this.files[i])
      //     }
      //   }
      //   else {
      //     for (let i = inicio; i <= fim; i++) {
      //       this.selected.push(this.files[i])
      //     }
      //   }
      //   return
      // }
      const index = this.selected.findIndex((fileSel) => fileSel._id === file._id)
      if (index !== -1 && this.selected.length === 1) {
        this.selected.splice(index, 1)
      }
      else {
        this.selected = [file]
      }
    },
    isSelected (id) {
      if (!id) {
        return false
      }
      return this.selected.some((file) => file._id === id)
    }
  },
  watch: {
    value: {
      handler (value) {
        this.files = value.map((item) => item).sort((a, b) => {
          if (a.folder && !b.folder) {
            return -1
          }
          if (!a.folder && b.folder) {
            return 1
          }
          return a.name.localeCompare(b.name)
        })
      },
      deep: true
    },
    folderPath () {
      this.selected = []
    }
  },
  computed: {
    getFiles () {
      return this.files
    },
    isSelectedAll () {
      return this.selected.length === this.files.length && this.selected.length > 0 && this.files.length > 0
    }
  }
}
</script>

<style
  lang="stylus"
  scoped
>
// ================ Grid ==============
.file-list-grid-view
  display grid
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(100px, 1fr));
  row-gap 15px
  column-gap 10px
  justify-content: space-between;
  overflow: auto;
  height: calc(100vh - 120px);
  padding: 5px;
  border: 1px solid #938f8f;
  border-radius: 5px;
  .file-card
    //box-shadow: 0 0 7px 2px #0000006b
    padding 10px
    border 1px solid #938f8f
    height 90px
    display flex
    flex-direction column
    border-radius 5px
    position relative
    .q-icon
      font-size 45px
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      color: #7a7d7d;
    .file-label
      position: absolute;
      bottom: -30px;
      left: 0;
      padding: 2px 0;
      height: 25px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      width: 100%;

// ================ List ==============
.tableFixHead
  border 1px solid #b1b1b1
  border-radius 3px
  overflow-y: auto;
  height: calc(100vh - 120px);

.tableFixHead::-webkit-scrollbar-track
  border-radius 0

.tableFixHead thead th
  background white !important
  color black !important
  z-index 1
  position: sticky !important
  top: 0 !important

.file-lista-container {
  padding: 5px;
  display: grid;
  grid-template-rows: 50px 1fr;
  grid-gap: 10px;
}
.file-lista-container .file-list-header {
  display: grid;
  grid-template-columns: 50px 50px 1fr 50px 50px;
  grid-column-gap: 10px;
  padding: 5px;
}
.style-table {
  width: 100%;
  border-radius: 3px;
  border-color: #808080;
  background: #fff;
  border-spacing: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 1px 1px rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12);
}
.style-thead {
  margin-top: 10px;
  border-color: rgba(0,0,0,0.12);
}
.style-th {
  padding: 5px;
  color: #515151;
  font-weight: 400;
  font-size: 15px;
  text-align: initial;
}
.style-td
  padding-left: 5px;
  border-top: 1px solid;
  //border-bottom: 1px solid;
  border-color: rgba(0,0,0,0.12);
  font-size: 12px;
  .q-icon
    color: #7a7d7d
  //cursor pointer

.cell-checkbox
  width 30px
.selected-row
  background #2d99a847
  //font-weight 700
</style>
