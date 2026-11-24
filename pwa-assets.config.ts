import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

const background = "#E7F1E4";

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    transparent: { ...minimal2023Preset.transparent, padding: 0, resizeOptions: { background } },
    maskable: { ...minimal2023Preset.maskable, padding: 0.25, resizeOptions: { background } },
    apple: { ...minimal2023Preset.apple, padding: 0.15, resizeOptions: { background } },
  },
  images: ["public/icon.svg"],
});
