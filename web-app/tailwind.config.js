/** @type {import('tailwindcss').Config} */

import daisyui from "daisyui";
import animate from "tailwindcss-animate";

const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {},
  plugins: [animate, daisyui],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#0070F3",
          secondary: "#7C3AED",
          accent: "#37CDBE",
          neutral: "#3D4451",
          "base-100": "#FFFFFF",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
        dark: {
          primary: "#0070F3",
          secondary: "#7C3AED",
          accent: "#37CDBE",
          neutral: "#191D24",
          "base-100": "#2A303C",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
};
export default config;
