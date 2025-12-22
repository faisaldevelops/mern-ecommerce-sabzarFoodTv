import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		// Increase chunk size warning limit
		chunkSizeWarningLimit: 600,
		// Use esbuild for minification
		minify: 'esbuild',
		esbuild: {
			drop: ['console', 'debugger']
		},
		// Disable source maps in production
		sourcemap: false,
		// Optimize asset inlining threshold
		assetsInlineLimit: 4096
	},
	// Optimize dependencies
	optimizeDeps: {
		include: ['react', 'react-dom', 'react-router-dom']
	}
});