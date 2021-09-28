<template>
  <div class="tree-container">
    <v-jstree
      style="height: 100%;"
      v-if="show"
      :data="model"
      allow-batch
      whole-row
    >
      <template slot-scope="_">
        <div
          style="display: inherit; width: 200px"
          @click.ctrl="customItemClickWithCtrl"
          @click.exact="itemClick(_.vm, _.model, $event)"
          @click.exact.right="rightClick(_.vm, _.model, $event)"
        >
          <q-menu
            touch-position
            context-menu
          >
            <q-list
              dense
              style="min-width: 100px"
            >
              <q-item
                clickable
                v-close-popup
              >
                <q-item-section @click="prompt = true">
                  <div style="display: grid; grid-template-columns: 25px 1fr; align-items: center;">
                    <q-icon
                      name="fas fa-folder-plus"
                      style="font-size: 16px; color: #78a9f8"
                    />Nova Pasta
                  </div>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item
                clickable
                v-close-popup
              >
                <q-item-section @click="deleteDirectory">
                  <div style="display: grid; grid-template-columns: 25px 1fr; align-items: center;">
                    <q-icon
                      name="fas fa-trash-alt"
                      style="font-size: 16px; color: #78a9f8"
                    />Excluir
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
          <i
            class="tree-icon tree-icon tree-themeicon tree-themeicon-custom"
            :class="_.model.opened || _.model.selected ? 'far fa-folder-open' : 'far fa-folder'"
            role="presentation"
            v-if="!_.model.loading"
          />
          {{ _.model.label }}
        </div>
      </template>
    </v-jstree>
    <q-dialog
      v-model="prompt"
      persistent
    >
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">
            Nova Pasta
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="folderName"
            autofocus
            @keyup.enter="prompt = false"
          />
        </q-card-section>

        <q-card-actions
          align="right"
          class="text-primary"
        >
          <q-btn
            flat
            label="Cancel"
            v-close-popup
          />
          <q-btn
            flat
            label="Ok"
            @click="newFolder"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
    deleteDirectory () {
      if (!this.selectedNode) {
        return
      }
      this.$emit('delete:folder', this.selectedNode.path)
    },
    newFolder () {
      if (this.folderName) {
        this.prompt = false
        this.$emit('create:folder', { base: this.selectedNode.path, children: this.folderName })
        this.folderName = null
      }
    },
    customItemClickWithCtrl () {},
    // eslint-disable-next-line no-unused-vars
    rightClick (node, model, event) {
      debugger
      this.selectedNode = model
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
  color $primary
</style>
