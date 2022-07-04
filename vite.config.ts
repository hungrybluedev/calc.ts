import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const icons = [
  {
    src: "images/icons/icon-72x72.png",
    sizes: "72x72",
    type: "image/png",
  },
  {
    src: "images/icons/icon-96x96.png",
    sizes: "96x96",
    type: "image/png",
  },
  {
    src: "images/icons/icon-128x128.png",
    sizes: "128x128",
    type: "image/png",
  },
  {
    src: "images/icons/icon-144x144.png",
    sizes: "144x144",
    type: "image/png",
  },
  {
    src: "images/icons/icon-152x152.png",
    sizes: "152x152",
    type: "image/png",
  },
  {
    src: "images/icons/icon-192x192.png",
    sizes: "192x192",
    type: "image/png",
  },
  {
    src: "images/icons/icon-384x384.png",
    sizes: "384x384",
    type: "image/png",
  },
  {
    src: "images/icons/icon-512x512.png",
    sizes: "512x512",
    type: "image/png",
  },
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*{js,css,html,png}"],
      },
      manifest: {
        name: "Simple Calculator",
        short_name: "Calculator",
        description:
          "A simple calculator made with React, TypeScript, and Vite",
        theme_color: "#9236ed",
        background_color: "#00acc1",
        display: "fullscreen",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: icons,
        screenshots: [
          {
            src: "images/screenshot.png",
            sizes: "1826x1452",
            type: "image/png",
          },
        ],
        shortcuts: [
          {
            name: "Calculator",
            icons: icons,
            short_name: "Calculator",
            description: "Open the calculator",
            url: "/",
          },
        ],
      },
    }),
  ],
});
