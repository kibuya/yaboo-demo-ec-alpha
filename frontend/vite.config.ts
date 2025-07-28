import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    port: 3000,
    host: true,
    // node_modulesのpdfjs-distを静的ファイルとして配信
    fs: {
      allow: ['..', '../node_modules']
    }
  },
  build: {
    target: 'es2020'
  },
  // pdfjs-distへのエイリアスを設定
  resolve: {
    alias: {
      'pdfjs-dist': path.resolve(__dirname, '../node_modules/pdfjs-dist')
    }
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist']
  }
});