<template>
  <div class="tree-menu">
    <div
      class="label-wrapper"
      @click="toggleChildren"
    >
      <div
        :style="indent"
        :class="labelClasses"
        @click="$emit('path', path)"
      >
        <q-icon
          v-if="nodes"
          :name="showChildren ? 'folder_open' : 'folder'"
        />
        {{ label }}
      </div>
    </div>
    <template v-for="(node, index) in nodes">
      <tree-folders
        :key="index"
        v-if="showChildren"
        :nodes="node.children"
        :label="node.label"
        :path="node.path"
        :depth="depth + 1"
        @select="$emit('path')"
      />
    </template>
  </div>
</template>

<script type="text/javascript">
export default { // [ 'nodes', 'label', 'depth' ]
  name: 'TreeFolders',
  props: {
    nodes: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    },
    depth: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      showChildren: false,
      selected: null
    }
  },
  computed: {
    labelClasses () {
      return { 'has-children': this.nodes }
    },
    indent () {
      return { transform: `translate(${this.depth * 12}px)` }
    }
  },
  methods: {
    toggleChildren () {
      if (!this.nodes.length) {
        return
      }
      this.showChildren = !this.showChildren
    }
  }
}
</script>

<style
  lang="stylus"
  rel="stylesheet/stylus"
  scoped
>
.tree-menu
  .label-wrapper
    padding 5px
    .q-icon
      font-size 20px
    .has-children
      cursor: pointer;
    &:hover
      background #8080804a
</style>
