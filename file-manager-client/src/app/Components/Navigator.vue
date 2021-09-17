<template>
  <div class="q-pa-md q-gutter-sm">
    <q-input
      ref="filter"
      outlined
      dense
      v-model="filter"
      placeholder="Pesquisar"
    >
      <template v-slot:append>
        <q-icon
          v-if="filter !== ''"
          name="clear"
          class="cursor-pointer"
          @click="resetFilter"
        />
      </template>
    </q-input>
    <tree-folders
      :root="true"
      :nodes="tree.nodes"
      :depth="0"
      :label="tree.label"
    />
  </div>
</template>

<script>
import FileService from 'src/service/FileListService'

export default {
  name: 'Navigator',
  created () {
    FileService.build().getAllDir()
      .then((response) => {
        this.tree.nodes = response.map((item) => {
          return {
            ...item,
            icon: 'folder'
          }
        })
      })
    FileService.build().getFilesByDir()
      .then((response) => {
        console.log('~> ', response)
      })
  },
  data () {
    return {
      tree: {
        label: 'Pastas',
        nodes: []
      },
      filter: ''
    }
  },
  methods: {
    update (event) {
      console.log('~> ', event)
    },
    resetFilter () {
      this.filter = ''
      this.$refs.filter.focus()
    }
  }
}
</script>
