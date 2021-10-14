// Configuration for your app
module.exports = function (ctx) {
  const webpack = require('webpack')
  const path = require('path')
  // const path = require('path')
  const join = path.join
  const componentsQuasarConf = require(join(`${__dirname}`, './components.quasar.conf'))
  const env = require('./.env.js')
  const packageJson = require('./package.json')
  const threadLoader = require('thread-loader')

  threadLoader.warmup({
  }, [
    // can be any module, i. e.
    'babel-loader',
    'sass-loader'
  ])
  return {
    htmlVariables: { version: packageJson.version },
    // app plugins (/src/plugins)
    boot: [
      'components',
      'dev',
      'i18n',
      'util',
      'vuelidate',
      'notify'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      // 'fontawesome'
      // ctx.theme.mat ? 'roboto-font' : null
      /*
       * 'material-icons' // optional, you are not bound to it
       * 'ionicons',
       * 'mdi',
       * 'fontawesome'
       */
    ],
    supportIE: true,
    build: {
      scopeHoisting: true,
      // publicPath: 'file-manager-client',
      // vueRouterMode: 'history',

      // showProgress: false,
      gzip: true,
      // analyze: true,

      preloadChunks: false,
      extractCSS: false,
      /*
       * Build para homologação não é necessário o public path
       * Caso tenha um subdominio se faz necessário colocar o public path com a config de pasta
       */
      extendWebpack (cfg) {
        cfg.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
        cfg.module.rules.push(
          {
            test: /.*([Cc])ontroller\.js$/,
            use: ['vue-hot-reload-loader']
          },
          {
            enforce: 'pre',
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            exclude: /node_modules/
          })
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          'vue$': 'vue/dist/vue.esm.js',
          'src': path.resolve(__dirname, 'src')
        }
      },
      env: env
    },
    devServer: {
      /*
       * https: true,
       * port: 8080,
       * open: true // opens browser window automatically
       */
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: componentsQuasarConf.components(),
      iconSet: 'fontawesome-v5',
      directives: [
        'Ripple',
        'ClosePopup'
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'Loading'
      ],
      // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
      lang: 'pt-br' // Quasar language
    },
    // animations: 'all' --- includes all animations
    animations: [],
    ssr: {
      pwa: false
    },
    pwa: {
      /*
       * workboxPluginMode: 'InjectManifest',
       * workboxOptions: {},
       */
      manifest: {
        /*
         * name: 'Quasar App',
         * short_name: 'Quasar-PWA',
         * description: 'Best PWA App in town!',
         */
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        /*
         * OS X / Mac App Store
         * appBundleId: '',
         * appCategoryType: '',
         * osxSign: '',
         * protocol: 'myapp://path',
         */

        /*
         * Window only
         * win32metadata: { ... }
         */
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
