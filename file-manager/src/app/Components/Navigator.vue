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

    <q-tree
      :nodes="simple"
      node-key="label"
      :filter="filter"
      default-expand-all
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
        this.simple = response
      })
  },
  data () {
    return {
      filter: '',
      simple: []
    }
  },
  methods: {
    resetFilter () {
      this.filter = ''
      this.$refs.filter.focus()
    }
  }
}
</script>
