<template>
  <div id="q-app">
    <q-ajax-bar
      ref="bar"
      position="top"
      color="accent"
      size="0"
      @start="$q.loading.show()"
      @stop="$q.loading.hide()"
    />
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
</style>
