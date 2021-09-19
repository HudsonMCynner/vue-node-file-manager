<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Gerenciador de Arquivos
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <navigator
        @path:selected="getFilesByDir"
        :value="nodes"
      />
      <storage-info
        :value="armazenamento"
        style="position: absolute; bottom: 10px; width: 100%;"
      />
    </q-drawer>

    <q-page-container>
      <file-list
        :value="files"
        :folder-path="folderPath"
      />
    </q-page-container>
  </q-layout>
</template>

<script type="text/javascript">
import FileService from 'src/service/FileListService'
import StorageInfo from 'src/app/Components/StorageInfo'

export default {
  name: 'LayoutDashboard',
  components: { StorageInfo },
  data: () => ({
    leftDrawerOpen: false,
    nodes: [],
    files: [],
    folderPath: '',
    armazenamento: 0
  }),
  created () {
    FileService.build().getAllDir()
      .then((response) => {
        this.nodes = [{
          selected: true,
          label: 'Home',
          path: ''
        }].concat(response)
      })
    FileService.build().getFilesByDir(this.folderPath)
      .then((response) => {
        this.files = response
      })
    FileService.build().getTotalSizeOfFiles()
      .then((response) => {
        this.armazenamento = response.total
      })
  },
  methods: {
    kbToMb (kbts) {
      return kbts ? (kbts / (1024 * 1024)).toFixed(2) + 'MB' : ''
    },
    getFilesByDir (folder) {
      this.folderPath = folder.path
      FileService.build().getFilesByDir(folder.path)
        .then((response) => {
          this.files = response
        })
    },
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  }
}
</script>

<style
  lang="stylus"
  rel="stylesheet/stylus"
  scoped
>
</style>
