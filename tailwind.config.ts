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
        myBg:"#131315",
        myBg2:"#18181b",
        myBorder:"#2c2c30",
        myBtnBg:"#db1a5a",
        myBtnBg2:"#424248",
        myBtnTst:"#c3c3c6",
      },
      boxShadow: {
        'inset-custom': 'inset 5px 7px 15px rgb(5, 5, 5)',
      },
    },
  },
  plugins: [],
};
export default config;
