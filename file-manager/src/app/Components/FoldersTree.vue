<template>
  <ul class="tree">
    <li>
      <input
        type="checkbox"
        checked="checked"
        id="c1"
      >
      <q-icon name="folder" />
      <label
        class="tree_label"
        for="c1"
      >Level 0</label>
      <ul>
        <li>
          <input
            type="checkbox"
            checked="checked"
            id="c2"
          >
          <q-icon name="folder" />
          <label
            for="c2"
            class="tree_label"
          >Level 1</label>
          <ul>
            <li>
              <span class="tree_label">Level 2</span>
            </li>
            <li>
              <span class="tree_label">Level 2</span>
            </li>
          </ul>
        </li>
        <li>
          <input
            type="checkbox"
            id="c3"
          >
          <q-icon name="folder" />
          <label
            for="c3"
            class="tree_label"
          >Looong level 1</label>
          <ul>
            <li><span class="tree_label">Level 2</span></li>
            <li>
              <input
                type="checkbox"
                id="c4"
              >
              <q-icon name="folder" />
              <label
                for="c4"
                class="tree_label"
              >Specified tree item view</label>
              <ul>
                <li><span class="tree_label">Level 3</span></li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </li>
    <li>
      <input
        type="checkbox"
        id="c5"
      >
      <q-icon name="folder" />
      <label
        class="tree_label"
        for="c5"
      >Level 0</label>
      <ul>
        <li>
          <input
            type="checkbox"
            id="c6"
          >
          <q-icon name="folder" />
          <label
            for="c6"
            class="tree_label"
          >Level 1</label>
          <ul>
            <li><span class="tree_label">Level 2</span></li>
          </ul>
        </li>
        <li>
          <input
            type="checkbox"
            id="c7"
          >
          <q-icon name="folder" />
          <label
            for="c7"
            class="tree_label"
          >Level 1</label>
          <ul>
            <li><span class="tree_label">Level 2</span></li>
            <li>
              <input
                type="checkbox"
                id="c8"
              >
              <q-icon name="folder" />
              <label
                for="c8"
                class="tree_label"
              >Level 2</label>
              <ul>
                <li><span class="tree_label">Level 3</span></li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script type="text/javascript">
export default {
  name: 'FoldersTree',
  props: {
    children: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: () => [
        {
          icone: 'folder',
          nome: 'teste',
          mesnus: [
            {
              icone: 'folder',
              nome: 'teste 2'
            }
          ]
        }
      ]
    }
  },
  data: () => ({
    pesquisa: ''
  }),
  methods: {
    /**
     * @param {Object} item
     */
    clickMenu (item) {
      this.$root.$emit('app:tab.open', item)
    },
    closeMenu () {
      this.$emit('close')
      if ('menu' in this.$refs) {
        this.$refs.menu.hide()
      }
    }
  },
  computed: {
  }
}
</script>

<style
  lang="stylus"
  rel="stylesheet/stylus"
  scoped
>

/* ————————————————————–
  Tree core styles
*/
ul {
  list-style none
  margin-left: -17px;
}

.tree input {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}

.tree input ~ ul { display: none; }

.tree input:checked ~ ul {
  display: block;
  margin-left: -41px;
}

/* ————————————————————–
  Tree rows
*/
.tree li {
  line-height: 1.2;
  position: relative;
  padding: 0 0 1em 25px;
}

.tree ul li { padding: 1em 0 0 1em; }

.tree > li:last-child { padding-bottom: 0; }

/* ————————————————————–
  Tree labels
*/
.tree_label {
  position: relative;
  display: inline-block;
  background: #fff;
}

label.tree_label { cursor: pointer; }

label.tree_label:hover { color: #666; }

/* ————————————————————–
  Tree expanded icon
*/
.q-icon
  position: absolute;
  left: -15px;
  font-size: 24px;
  z-index: 1;
  margin-top: -5px;
  color: #fcd462;
//label.tree_label:before {
//  background: #000;
//  color: #fff;
//  position: relative;
//  z-index: 1;
//  float: left;
//  margin: 0 1em 0 -2em;
//  width: 1em;
//  height: 1em;
//  border-radius: 1em;
//  content: '+';
//  text-align: center;
//  line-height: .9em;
//}

//:checked ~ label.tree_label:before { content: '–'; }

/* ————————————————————–
  Tree branches
*/
.tree li:before {
  position: absolute;
  top: 0;
  bottom: 0;
  display: block;
  width: 0;
  border-left: 1px solid #777;
  content: "";
  left: -12px;
}

.tree_label:after {
  position: absolute;
  top: 0;
  left: -26px;
  display: block;
  height: 0.5em;
  width: 1em;
  border-bottom: 1px solid #777;
  border-left: 1px solid #777;
  border-radius: 0 0 0 .3em;
  content: '';
}

label.tree_label:after { border-bottom: 0; }

:checked ~ label.tree_label:after {
  border-radius: 0 .3em 0 0;
  border-top: 1px solid #777;
  border-right: 1px solid #777;
  border-bottom: 0;
  border-left: 0;
  bottom: 0;
  top: 0.5em;
  height: auto;
  margin-left: 0;
}

.tree li:last-child:before {
  height: 1em;
  bottom: auto;
}

.tree > li:last-child:before { display: none; }

.tree_custom {
  display: block;
  background: #eee;
  padding: 1em;
  border-radius: 0.3em;
}
</style>
