import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const apiProxy = {
	"/techtrade_api": {
		target: "http://127.0.0.1",
		changeOrigin: true,
		secure: false,
	},
};

export default defineConfig({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	plugins: [react(), tailwindcss()],
	server: {
		port: 5173,
		strictPort: false,
		proxy: apiProxy,
	},
	preview: {
		proxy: apiProxy,
	},
});
