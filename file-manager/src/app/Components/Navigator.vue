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
    <folders-tree />
  </div>
</template>

<script>
import FileService from 'src/service/FileListService'
import FoldersTree from 'src/app/Components/FoldersTree'

export default {
  name: 'Navigator',
  components: { FoldersTree },
  created () {
    FileService.build().getAllDir()
      .then((response) => {
        this.simple = response.map((item) => {
          return {
            ...item,
            icon: 'folder'
          }
        })
      })
  },
  data () {
    return {
      filter: '',
      simple: []
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
