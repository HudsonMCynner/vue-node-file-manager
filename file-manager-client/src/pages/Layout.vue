<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="fas fa-bars"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Gerenciador de Arquivos
        </q-toolbar-title>

        <div>v1.0.0</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <navigator
        @path:selected="getFilesByDir"
        @create:folder="createFolder"
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
        @update:list="getStorageUsage"
        @update:storage="getStorageUsage"
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
    this.updateDirectories()
    FileService.build().getFilesByDir(this.folderPath)
      .then((response) => {
        this.files = response
      })
    this.getStorageUsage()
  },
  methods: {
    updateDirectories () {
      FileService.build().getAllDir()
        .then((response) => {
          this.nodes = [{
            selected: true,
            opened: true,
            label: 'Meu Drive',
            path: '',
            children: response
          }]
        })
    },
    createFolder (event) {
      FileService.build().createDirectory(event)
        .then(this.updateDirectories)
    },
    getStorageUsage () {
      this.updateDirectories()
      FileService.build().getTotalSizeOfFiles()
        .then((response) => {
          this.armazenamento = response.total
        })
    },
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
