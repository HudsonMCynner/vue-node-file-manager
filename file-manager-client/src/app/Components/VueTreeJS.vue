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
    root: [{
      selected: true,
      label: 'Meu Drive',
      path: '',
      children: []
    }],
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
        this.model = value
      }
    }
  }
}
</script>

<style
  lang="stylus"
  scoped
>
</style>
