<template>
  <div id="q-app">
    <q-ajax-bar
      ref="bar"
      position="top"
      color="primary"
      size="5px"
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
