import { reactRouter } from "@react-router/dev/vite";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [reactRouter(), UnoCSS(), tsconfigPaths()],
	server: {
		allowedHosts: ["a4cc-154-161-28-122.ngrok-free.app"],
	},
});
