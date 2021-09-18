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
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <navigator
          @path:selected="getFilesByDir"
          :value="nodes"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <file-list
        :value="files"
        :path="path"
      />
    </q-page-container>
  </q-layout>
</template>

<script type="text/javascript">
import FileService from 'src/service/FileListService'

export default {
  name: 'LayoutDashboard',
  data: () => ({
    leftDrawerOpen: false,
    nodes: [],
    files: [],
    path: ''
  }),
  created () {
    FileService.build().getAllDir()
      .then((response) => {
        this.nodes = [{
          label: 'Home',
          path: ''
        }].concat(response.map((item) => {
          return {
            ...item,
            'icon': 'fa fa-folder'
          }
        }))
      })
    FileService.build().getAllFiles()
      .then((response) => {
        this.files = response
      })
    FileService.build().getTotalSizeOfFiles()
      .then((response) => {
        console.log('~> ', this.kbToMb(response.total))
      })
  },
  methods: {
    kbToMb (kbts) {
      return kbts ? (kbts / (1024 * 1024)).toFixed(2) + 'MB' : ''
    },
    getFilesByDir (folder) {
      this.path = folder.path
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
