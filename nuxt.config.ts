// https://nuxt.com/docs/api/configuration/nuxt-config
import { pinia } from '@pinia/nuxt'
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },


  // router: {
  //   middleware: ['auth']
  // },

  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '~/assets/css/main.css',
      'bootstrap/dist/css/bootstrap.css',
       '@fortawesome/fontawesome-free/css/all.css'
    // Tambahkan URL untuk file CSS Bootstrap lainnya jika diperlukan
  ],
  build: {
    transpile: ['bootstrap']
  },
  modules: [
    // ...
    '@pinia/nuxt',
  ],
  plugins: [
    '~/plugins/bootstrap.client.ts'
  ],
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
    }
  }
 
})