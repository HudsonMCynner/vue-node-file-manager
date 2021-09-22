<template>
  <div class="file-lista-container">
    <div class="file-list-header">
      <q-input
        v-model="search"
        outlined
        dense
        placeholder="Pesquisar"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn
        outline
        icon="file_upload"
        color="primary"
        @click="modalUpload = true"
      />
      <q-btn
        outline
        icon="delete"
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
    <div class="file-list-content tableFixHead">
      <table class="style-table">
        <thead class="style-thead">
          <tr>
            <th style="width: 25px" />
            <th class="style-th cell-checkbox">
              <q-checkbox
                :value="isSelectedAll"
                @input="selectAllFiles"
              />
            </th>
            <th class="style-th">
              Nome
            </th>
            <th class="style-th">
              Tamanho
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(file, index) in files"
            :key="index"
            @click="selectFile(file)"
            :class="{'selected-row': isSelected(file._id)}"
          >
            <td class="style-td">
              <q-icon
                :name="getIcon(file.name)"
                size="20px"
              />
            </td>
            <td class="style-td cell-checkbox">
              <q-checkbox
                :value="isSelected(file._id)"
                @input="selectFile(file)"
              />
            </td>
            <td class="style-td">
              {{ file.name }}
            </td>
            <td
              class="style-td"
              style="width: 90px"
            >
              {{ kbToMb(file.size) }}
            </td>
            <td
              class="style-td"
              style="width: 45px"
            >
              <q-btn
                flat
                dense
                size="md"
                icon="file_download"
                @click="downloadFile(file)"
              />
            </td>
          </tr>
        </tbody>
      </table>
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
      pdf: 'fa fa-file-pdf-o',
      txt: 'fa fa-file-text-o',
      doc: 'fa fa-file-word-o',
      docx: 'fa fa-file-word-o',
      zip: 'fa fa-file-archive-o',
      xls: 'fa fa-file-excel-o',
      xlsx: 'fa fa-file-excel-o',
      png: 'fa fa-file-image-o',
      jpg: 'fa fa-file-image-o',
      jpeg: 'fa fa-file-image-o',
      webp: 'fa fa-file-image-o',
      ogg: 'fa fa-file-audio-o',
      mp2: 'fa fa-file-audio-o',
      wma: 'fa fa-file-audio-o',
      mp4: 'fa fa-file-film-o',
      avi: 'fa fa-file-film-o',
      kmv: 'fa fa-file-film-o',
      html: 'fa fa-file-code-o',
      exe: 'fa fa-terminal',
      others: 'fa fa-file-o'
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
    selectMode: 'multiple', // single | multiple
    modalUpload: false
  }),
  methods: {
    getIcon (name) {
      debugger
      return this.fileIcons[name.split('.').last()]
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
    selectFile (file) {
      const index = this.selected.findIndex((fileSel) => fileSel._id === file._id)
      if (this.selectMode === 'multiple') {
        if (index !== -1) {
          this.selected.splice(index, 1)
        }
        else {
          this.selected.push(file)
        }
      }
      else {
        if (index !== -1) {
          this.selected.splice(index, 1)
        }
        else {
          this.selected = [file]
        }
      }
    },
    isSelected (id) {
      if (!id) {
        return false
      }
      return this.selected.some((file) => file._id === id)
    },
    selectAllFiles () {
      if (this.isSelectedAll) {
        this.selected = []
        return
      }
      this.selected = this.files.map((item) => item)
    }
  },
  watch: {
    value: {
      handler (value) {
        this.files = value
      },
      deep: true
    },
    folderPath () {
      this.selected = []
    }
  },
  computed: {
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
  grid-template-columns: 1fr 50px 50px;
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
.style-td {
  padding-left: 5px;
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: rgba(0,0,0,0.12);
  font-size: 12px;
  cursor pointer
}
.cell-checkbox
  width 30px
.selected-row
  background #2d99a847
  font-weight 700
</style>
