<template>
  <div class="tree-container">
    <v-jstree
      v-if="model.length"
      :data="model"
      allow-batch
      whole-row
      :text-field-name="'label'"
      @item-click="itemClick"
    />
    <!--    <q-menu-->
    <!--      touch-position-->
    <!--      context-menu-->
    <!--    >-->
    <!--      <q-list-->
    <!--        dense-->
    <!--        style="min-width: 100px"-->
    <!--      >-->
    <!--        <q-item-->
    <!--          clickable-->
    <!--          v-close-popup-->
    <!--          @click="prompt = true"-->
    <!--        >-->
    <!--          <q-item-section>Nova Pasta</q-item-section>-->
    <!--        </q-item>-->
    <!--        <q-separator />-->
    <!--        <q-item-->
    <!--          clickable-->
    <!--          v-close-popup-->
    <!--        >-->
    <!--          <q-item-section>Excluir</q-item-section>-->
    <!--        </q-item>-->
    <!--      </q-list>-->
    <!--    </q-menu>-->
    <!--    <q-dialog-->
    <!--      v-model="prompt"-->
    <!--      persistent-->
    <!--    >-->
    <!--      <q-card style="min-width: 350px">-->
    <!--        <q-card-section>-->
    <!--          <div class="text-h6">-->
    <!--            Nova Pasta-->
    <!--          </div>-->
    <!--        </q-card-section>-->

    <!--        <q-card-section class="q-pt-none">-->
    <!--          <q-input-->
    <!--            dense-->
    <!--            v-model="folderName"-->
    <!--            autofocus-->
    <!--            @keyup.enter="prompt = false"-->
    <!--          />-->
    <!--        </q-card-section>-->

    <!--        <q-card-actions-->
    <!--          align="right"-->
    <!--          class="text-primary"-->
    <!--        >-->
    <!--          <q-btn-->
    <!--            flat-->
    <!--            label="Cancelar"-->
    <!--            @click="folderName = null"-->
    <!--            v-close-popup-->
    <!--          />-->
    <!--          <q-btn-->
    <!--            flat-->
    <!--            label="Adicionar"-->
    <!--            @click="newFolder"-->
    <!--          />-->
    <!--        </q-card-actions>-->
    <!--      </q-card>-->
    <!--    </q-dialog>-->
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
    selectedNode: null
  }),
  methods: {
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
      }
    }
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
</style>
