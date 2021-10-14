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
        @delete:folder="deleteFolder"
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
        @file:rename="renameFile"
      />
    </q-page-container>
  </q-layout>
</template>

<script type="text/javascript">
import FileService from 'src/pages/services/FileService'
import FolderService from 'src/pages/services/FolderService'
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
    this.updateFileList()
    this.getStorageUsage()
  },
  methods: {
    updateFileList () {
      FileService.build().getFilesByDir(this.folderPath)
        .then((response) => {
          this.files = response
        })
    },
    renameFile (event) {
      FileService.build().rename(event.file, event.newName)
        .then(this.updateFileList)
    },
    updateDirectories () {
      FolderService.build().getAllDir()
        .then((response) => {
          this.nodes = [{
            opened: true,
            label: 'Meu Drive',
            icon: 'far fa-folder',
            path: '',
            children: response
          }]
        })
    },
    createFolder (event) {
      FolderService.build().create(event)
        .then(this.updateDirectories)
    },
    deleteFolder (event) {
      FolderService.build().removeDirectory(event)
        .then(() => {
          this.getStorageUsage()
          this.updateDirectories()
          this.updateFileList()
        })
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
