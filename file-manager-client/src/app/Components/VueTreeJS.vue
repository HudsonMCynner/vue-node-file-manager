<template>
  <div class="tree-container">
    <v-jstree
      v-if="show"
      :data="model"
      allow-batch
      whole-row
      :text-field-name="'label'"
      @item-click="itemClick"
    />
  </div>
</template>

<script>
import VJstree from 'vue-jstree'
export default {
  name: 'VueTreeJS',
  components: {
    VJstree
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  created () {
    this.model = this.value
  },
  data: () => ({
    root: [{
      selected: true,
      label: 'Meu Drive',
      path: '',
      children: []
    }],
    prompt: false,
    folderName: null,
    model: [],
    selectedNode: null,
    show: false
  }),
  methods: {
    showComponent () {
      setTimeout(() => {
        this.show = true
      }, 200)
    },
    newFolder () {
      if (this.folderName) {
        this.prompt = false
        this.$emit('create:folder', { base: this.selectedNode, children: this.folderName })
        this.folderName = null
      }
    },
    itemClick (node) {
      this.selectedNode = node
      this.$emit('folder:selected', node)
    }
  },
  watch: {
    value: {
      handler (value) {
        this.model = value
        this.show = false
        if (value.length) {
          this.showComponent()
        }
      }
    }
  },
  computed: {
  }
}
</script>

<style
  lang="stylus"
  scoped
>
.tree-container
  width 100%
  height: calc(100vh - 135px);
  padding: 0 10px 0 0;
>>> .tree-default .tree-node {
  margin-left: 13px;
}
>>> .tree-icon
  font-size 20px
  color #78A9F7
</style>
