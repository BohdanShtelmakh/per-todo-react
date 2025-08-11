import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: parseInt(env.VITE_PORT ?? '3000'),
      open: true,
    },
    preview: {
      port: parseInt(env.VITE_PORT ?? '3000'),
      strictPort: true,
    },
  };
});
