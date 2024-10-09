import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@slice': path.resolve(__dirname, 'src/slice'),
      '@sections': path.resolve(__dirname, 'src/sections')
    },
  },
})
