<template>
  <div class="file-lista-container">
    <div class="file-list-header">
      <q-input
        v-model="search"
        outlined
        dense
        placeholder="Pesquisar">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <app-file-uploader v-bind="inputUpload"/>
      <q-btn
        outline
        style="color: goldenrod;"
        label="Enviar" />
    </div>
    <div class="file-list-content">
      <table class="style-table">
        <thead class="style-thead">
          <tr>
            <th class="style-th">
              <q-checkbox v-model="selectAll"/>
            </th>
            <th class="style-th">Nome</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(file, index) in files"
            :key="index">
            <td class="style-td">
              <q-checkbox
                :model-value="isSelected(file.id)"
                @update="selectFile(file)"
              />
            </td>
            <td class="style-td">
              {{ file.name }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import FileService from 'src/service/FileService'
import AppFileUploader from 'components/AppFileUploader'

export default {
  name: 'FileList',
  components: { AppFileUploader },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  created () {
    this.model = this.value
    FileService.build().get('')
      .then((response) => {
        // []
        this.files = response
      })
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
    selectMode: 'single' // single | multiple
  }),
  methods: {
    selectFile (file) {
      debugger
      const index = this.selected.findIndex((fileSel) => fileSel.id === file.id)
      if (this.selectMode === 'multiple') {
        if (index !== -1) {
          this.selected.splice(index, 1)
        }
        this.selected.push(file)
      }
      else {
        if (index !== -1) {
          this.selected.splice(index, 1)
        }
        this.selected = [file]
      }
    },
    isSelected (id) {
      if (!id) {
        return false
      }
      return this.selected.some((file) => file.id === id)
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
  grid-template-columns: 1fr 1fr 130px;
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
}

</style>
