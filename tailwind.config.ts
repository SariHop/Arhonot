import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        banana: "#F2F996",
        mindaro: "#D0F19F",
        lime: "#AAE552",
        coral: "#f09090",
        magenta: "#992b51",
      },
    },
  },
  plugins: [],
};

export default config;
