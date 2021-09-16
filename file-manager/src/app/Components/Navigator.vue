<template>
  <div class="q-pa-md q-gutter-sm">
    <q-input
      ref="filterRef"
      filled
      v-model="filter"
      label="Search - only filters labels that have also '(*)'"
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
      :filter-method="myFilterMethod"
      v-model:expanded="expanded"
      default-expand-all
    />
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'Navigator',
  setup () {
    const filter = ref('')
    const filterRef = ref(null)

    return {
      filter,
      filterRef,
      expanded: ref(['Good service (disabled node) (*)']),

      simple: [
        {
          label: 'Documentos',
          icon: 'folder',
          children: [
            { label: 'Trabalho' },
            { label: 'Escola' }
          ]
        },
        {
          label: 'Imagens',
          icon: 'folder',
          children: [
            { label: 'Background' },
            { label: 'Demos' }
          ]
        },
        {
          label: 'Videos',
          icon: 'folder',
          children: [
            { label: 'Cursos' },
            { label: 'Trabalho' },
            { label: 'Gravações' }
          ]
        }
      ],

      myFilterMethod (node, filter) {
        const filt = filter.toLowerCase()
        return node.label && node.label.toLowerCase().indexOf(filt) > -1
      },

      resetFilter () {
        filter.value = ''
        filterRef.value.focus()
      }
    }
  }
}
</script>
