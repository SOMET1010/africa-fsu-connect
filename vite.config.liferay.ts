
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Configuration Vite spécifique pour Liferay
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/liferay-main.tsx'),
      name: 'ReactSutelPortlet',
      fileName: 'react-sutel-bundle',
      formats: ['umd']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        dir: 'modules/react-sutel-portlet/src/main/resources/META-INF/resources/js/',
        entryFileNames: 'react-sutel-bundle.js',
        chunkFileNames: 'chunk-[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return '../css/[name][extname]';
          }
          return 'assets/[name][extname]';
        }
      }
    },
    outDir: 'modules/react-sutel-portlet/src/main/resources/META-INF/resources/',
    emptyOutDir: false,
    cssCodeSplit: false
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
});
