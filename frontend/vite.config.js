import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',     // Compatível com navegadores modernos
    outDir: 'dist',        // Pasta de saída padrão
    sourcemap: false       // Pode ativar para debugging
  },
  server: {
    port: 5173,            // Porta local
    open: true             // Abre navegador automaticamente
  },
  define: {
    'process.env': {}      // Evita erro com libs que usam process.env
  }
});
