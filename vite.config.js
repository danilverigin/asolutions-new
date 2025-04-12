import { defineConfig } from 'vite';
import { createRequire } from 'node:module';
import compression from 'vite-plugin-compression';
const require = createRequire(import.meta.url);

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        require('postcss-pxtorem')({
          rootValue: 16,
          unitToConvert: 'px',
          propList: ['*'],
        }),
      ],
    },
  },
  plugins: [
    compression({
      algorithm: 'gzip', // или 'brotliCompress'
      ext: '.gz', // расширение для сжатых файлов
    }),
  ],
  build: {
    minify: 'terser',
    cssMinify: true,
  },
});
