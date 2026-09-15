import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	base: '/report-semanal/',
	root: 'src',
	publicDir: '../public',
	build: { outDir: '../dist', emptyOutDir: true },
	plugins: [react()],
});
