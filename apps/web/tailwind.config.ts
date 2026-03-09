import uiPreset from "@friends/ui/tailwind.preset";
import type { Config } from "tailwindcss";

const config: Config = {
  presets: [uiPreset],
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  darkMode: "class",
};

export default config;
