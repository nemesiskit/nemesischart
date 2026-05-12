import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const base = {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  }

  if (mode === 'lib') {
    return {
      ...base,
      build: {
        lib: {
          entry: resolve(__dirname, 'src/lib/index.js'),
          name: 'NemesisChart',
          fileName: (format) => `nemesischart.${format === 'es' ? 'js' : 'umd.cjs'}`,
        },
        rollupOptions: {
          external: ['vue', 'chart.js', 'primevue', 'primeflex', 'primeicons'],
          output: {
            exports: 'named',
            globals: {
              vue: 'Vue',
              'chart.js': 'Chart',
              primevue: 'PrimeVue',
            },
          },
        },
      },
    }
  }

  return base
})
