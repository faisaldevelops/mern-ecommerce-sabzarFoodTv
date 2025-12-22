import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],

	build: {
		// Modern browsers, good balance of size + compatibility
		target: "es2020",

		// Fast, safe minification
		minify: "esbuild",

		// No source maps in prod
		sourcemap: false,

		// Prevent noisy warnings without forcing risky splits
		chunkSizeWarningLimit: 600,

		// Let Rollup handle dependency graph safely
		rollupOptions: {
			output: {
				chunkFileNames: "assets/[name]-[hash].js",
				entryFileNames: "assets/[name]-[hash].js",
				assetFileNames: "assets/[name]-[hash].[ext]",

				// OPTIONAL: split ONLY clearly isolated heavy libs
				manualChunks(id) {
					if (!id.includes("node_modules")) return;

					// Heavy libs that are NOT needed on first paint
					if (id.includes("recharts")) return "charts";
					if (id.includes("framer-motion")) return "animations";

					// Everything else is auto-vendor'd safely
				}
			}
		}
	},

	// Speed up dev server only (does NOT affect prod bundle)
	optimizeDeps: {
		include: ["react", "react-dom", "react-router-dom"]
	}
});