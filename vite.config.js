import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const apiProxy = {
	"/techtrade_api": {
		target: "http://127.0.0.1",
		changeOrigin: true,
		secure: false,
	},
};

export default defineConfig({
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
