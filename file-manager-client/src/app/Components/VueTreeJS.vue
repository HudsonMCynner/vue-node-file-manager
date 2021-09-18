<template>
  <v-jstree
    v-if="model.length"
    :data="model"
    allow-batch
    whole-row
    :text-field-name="'label'"
    @item-click="itemClick"
  />
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
    model: []
  }),
  methods: {
    itemClick (node) {
      this.$emit('folder:selected', node)
    }
  },
  watch: {
    value: {
      handler (value) {
        setTimeout(() => {
          this.model = value
        }, 1000)
      }
    }
  }
}
</script>

<style
  lang="stylus"
  scoped
>
>>>.tree-anchor
  .tree-icon.tree-themeicon.fa.fa-folder
    display none
  .tree-icon.tree-themeicon.fa.fa-warning
    display none
  .tree-icon.tree-themeicon.fa.fa-check
    display none
</style>
