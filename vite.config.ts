import { reactRouter } from "@react-router/dev/vite";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [reactRouter(), UnoCSS(), tsconfigPaths()],

	server: {
		allowedHosts: ["36fd-154-161-8-33.ngrok-free.app"],
	},
});
