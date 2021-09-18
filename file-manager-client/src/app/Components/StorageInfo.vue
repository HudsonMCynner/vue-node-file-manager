<template>
  <div class="storage-container">
    <label>Armazenamento</label>
    <div class="storage-device">
      <div
        class="progress"
        :style="{width: getWidth }"
      />
    </div>
    <label>{{ getLivres }} livre(s) de {{ kbToMb(limit) }}</label>
  </div>
</template>

<script>
export default {
  name: 'StorageInfo',
  props: {
    value: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 1073741824
    }
  },
  methods: {
    kbToMb (bytes) {
      if (bytes >= 1073741824) {
        return (bytes / 1073741824).toFixed(2) + ' GB'
      }
      if (bytes >= 1048576) {
        return (bytes / 1048576).toFixed(2) + ' MB'
      }
      if (bytes >= 1024) {
        return (bytes / 1024).toFixed(2) + ' KB'
      }
      if (bytes > 1) {
        return bytes + ' bytes'
      }
      if (bytes === 1) {
        return bytes + ' byte'
      }
      else {
        return '0 bytes'
      }
    }
  },
  computed: {
    getWidth () {
      return `${this.value / this.limit * 100}%`
    },
    getLivres () {
      return this.kbToMb(this.limit - this.value)
    }
  }
}
</script>

<style
  lang="stylus"
  scoped
>
.storage-container
  padding 0 20px
  .storage-device
    width: 100%;
    height: 20px;
    border: 1px solid #c7c5c5;
    border-radius: 3px;
    .progress
      background #26a0da
      height 100%
</style>
