import * as FontAwesome from './build/fontawesome'
require('dotenv').config();
const env = process.env;

export default {
  server: {
    host: '0.0.0.0'
  },

  env: {
    API_URL: process.env.API_URL,
  },
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  watchers: {
    webpack: {
      aggregateTimeout:300,
      poll: 1000
    }
  },

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'ANYTEAM',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/scss/style.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    [
      '@nuxtjs/fontawesome',
      {
        components: 'fontAwesome', suffix: true
      }
    ]
  ],

  fontawesome: {
    icons: {
      solid: FontAwesome.solid,
      regular: FontAwesome.regular,
      brands: FontAwesome.brands,
    }
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/axios",
    '@nuxtjs/auth-next',
    '@nuxtjs/dotenv'
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: env.API_URL || 'http://localhost:3000',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {

  },
  router: {
    middleware: ['auth']
  },
  auth: {
    strategies: {
      local: {
        token: {
          property: 'access_token',
        },
        endpoints: {
          login: { url: '/api/v1/organization/login', method: 'post'},
          logout: false,
          user: { url: '/api/v1/organization/me', method: 'get', propertyName: '' },
        },
        user: {
          property: ''
        },
      }
    },
    redirect: {
      logout: '/login',
      home: '/',
      login: '/login',
    },
    localStorage: false
  }
}
