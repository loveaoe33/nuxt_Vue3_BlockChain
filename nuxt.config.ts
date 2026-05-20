// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    ['@pinia/nuxt', {
      autoImports: [
        'defineStore', // 自動匯入 defineStore
      ],
    }]
  ],
})
// nuxt.config.ts
