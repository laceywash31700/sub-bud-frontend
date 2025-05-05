import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path';


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@babel/template': path.resolve(__dirname, 'node_modules/@babel/template'),
      '@babel/generator': path.resolve(__dirname, 'node_modules/@babel/generator'),
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@modules': path.resolve(__dirname, './src/modules'),
    },
  },
  // Add this if you're still having JSX issues
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@babel/template',
      '@babel/generator',
    ],
  },
})