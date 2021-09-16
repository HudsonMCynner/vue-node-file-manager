export default [
  {
    label: 'Alternar Tela Cheira',
    icon: 'fas fa-compress-wide',
    handler () {
      if (this.$q && this.$q.fullscreen) {
        // noinspection JSCheckFunctionSignatures
        this.$q.fullscreen.toggle()
      }
    }
  },
  {
    label: 'Sair',
    icon: 'far fa-power-off',
    handler () {
      this.$store.dispatch('auth/logout').then(() => this.$router.push('/auth'))
    }
  }
]
