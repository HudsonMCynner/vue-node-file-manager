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
      <q-btn-dropdown
        color="primary"
        label="Ações"
        size="sm"
      >
        <q-list>
          <q-item
            clickable
            v-close-popup
            @click="selectFiles"
          >
            <q-item-section>
              <q-item-label>Enviar Arquivos</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-close-popup
            @click="selectFolder"
          >
            <q-item-section>
              <q-item-label>Enviar Pasta</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-if="selected.length"
            clickable
            v-close-popup
            @click="removeFile"
          >
            <q-item-section>
              <q-item-label>Excluir Selecionados</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <div class="file-list-content">
      <table class="style-table">
        <thead class="style-thead">
          <tr>
            <th class="style-th cell-checkbox">
              <q-checkbox
                :value="isSelectedAll"
                @input="selectAllFiles"
              />
            </th>
            <th class="style-th">
              Nome
            </th>
            <td class="style-th">
              Tamanho
            </td>
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
import file from './mixins/file'

export default {
  name: 'FileList',
  mixins: [file],
  props: {
    value: {
      type: Array,
      default: () => ([])
    }
  },
  created () {
    this.files = this.value
  },
  data: () => ({
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
    selectMode: 'multiple' // single | multiple
  }),
  methods: {
    downloadFile ({ encodedName, name }) {
      let base = 'http://localhost:3000'
      const link = document.createElement('a')
      link.href = `${base}/file/download/${encodedName}`
      link.target = '_blank'
      link.download = name
      link.click()
    },
    removeFile () {
      if (this.selectMode === 'single') {
        if (this.selected.length) {
          FileService.build().deleteFile(this.selected[0]._id)
            .then(() => {
              this.$notify.success('Arquivo excluído com sucesso!')
              this.selected = []
              FileService.build().getAllFiles()
                .then((response) => {
                  this.files = response
                })
            })
        }
        else {
          console.log('~> Selecione um arquivo')
        }
      }
      const removeRecursive = (list, index) => {
        if (index >= list.length) {
          this.selected = []
          return this.$notify.success('Arquivos excluídos com sucesso!')
        }
        FileService.build().deleteFile(list[index]._id)
          .then(() => {
            FileService.build().getAllFiles()
              .then((response) => {
                this.files = response
                removeRecursive(list, (index + 1))
              })
          })
      }
      removeRecursive(this.selected, 0)
    },
    selectFiles () {
      this.getFile(true, false).then((files) => {
        FileService.build().uploadFiles(files)
          .then(() => {
            FileService.build().getAllFiles()
              .then((response) => {
                this.files = response
              })
          })
      })
    },
    selectFolder () {
      this.getFile(false, true).then((files) => {
        if (!files.length) {
          return this.$notify.info('Nenhum arquivo selecionado')
        }
        let folder = files[0].webkitRelativePath.split('/')[0]
        console.log('~> ', folder)
        FileService.build().uploadFiles(files)
          .then(() => {
            FileService.build().getAllFiles()
              .then((response) => {
                this.files = response
              })
          })
      })
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
      this.selected = this.files
    }
  },
  watch: {
    value: {
      handler (value) {
        this.files = value
      },
      deep: true
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
.file-lista-container {
  padding: 5px;
  display: grid;
  grid-template-rows: 50px 1fr;
  grid-gap: 10px;
}
.file-lista-container .file-list-header {
  display: grid;
  grid-template-columns: 1fr 130px;
  grid-gap: 10px;
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
