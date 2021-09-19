<template>
  <div id="q-app">
    <q-linear-progress
      v-if="progress > 0"
      stripe
      style="z-index: 9999; position: absolute; top: 0; left: 0"
      size="15px"
      :value="progress"
      color="primary"
    >
      <div class="absolute-full flex flex-center">
        <q-badge
          color="white"
          text-color="accent"
          :label="getProgressInfo"
        />
      </div>
    </q-linear-progress>
    <q-ajax-bar
      ref="bar"
      position="top"
      color="blue"
      size="0"
      @start="$q.loading.show()"
      @stop="$q.loading.hide()"
    />
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    progress: 0
  }),
  methods: {
    progressbar (progress) {
      this.progress = progress
      if (progress >= 1) {
        setTimeout(() => {
          this.progress = 0
        }, 500)
      }
    }
  },
  created () {
    this.$root.$on('app:progress', this.progressbar)
  },
  destroyed () {
    // this.$root.$off('app:progress')
  },
  computed: {
    getProgressInfo () {
      return `${(this.progress * 100).toFixed(2)}%`
    }
  }
}
</script>

<style>
</style>
