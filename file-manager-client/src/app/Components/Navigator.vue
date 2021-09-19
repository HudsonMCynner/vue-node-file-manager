<template>
  <div class="q-pa-md q-gutter-sm">
    <q-input
      ref="filter"
      outlined
      dense
      v-model="pesquisa"
      placeholder="Pesquisar"
    >
      <template v-slot:append>
        <q-icon
          v-if="pesquisa !== ''"
          name="clear"
          class="cursor-pointer"
          @click="resetFilter"
        />
      </template>
    </q-input>
    <vue-tree-j-s
      :value="getMenus"
      @folder:selected="itemClick"
      @create:folder="newFolder"
    />
  </div>
</template>

<script>

import VueTreeJS from 'src/app/Components/VueTreeJS'
export default {
  name: 'Navigator',
  components: { VueTreeJS },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  created () {
    this.nodes = this.value
  },
  data () {
    return {
      label: 'Pastas',
      nodes: [],
      pesquisa: ''
    }
  },
  methods: {
    newFolder (event) {
      this.$emit('create:folder', event)
    },
    itemClick (node) {
      this.$emit('path:selected', node.model)
    },
    filter (arr, term) {
      let matches = []
      if (!Array.isArray(arr)) {
        return matches
      }
      arr.forEach((item) => {
        if (item.label.toLowerCase().includes(term.toLowerCase())) {
          matches.push(item)
        }
        else {
          let childResults = this.filter(item.children, term)
          if (childResults.length) {
            matches.push(Object.assign({}, item, { children: childResults }))
          }
        }
      })
      return matches
    },
    resetFilter () {
      this.pesquisa = ''
      this.$refs.filter.focus()
    }
  },
  watch: {
    value: {
      handler (value) {
        this.nodes = value
      },
      deep: true
    }
  },
  computed: {
    getMenus () {
      return this.pesquisa ? this.filter(this.nodes, this.pesquisa) : this.nodes
    }
  }
}
</script>
