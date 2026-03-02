import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf7ef',
          100: '#f5ebd6',
          200: '#ebd5ad',
          300: '#dec68b',
          400: '#c5a059', // Main logo color
          500: '#ad8345',
          600: '#946638',
          700: '#764d2f',
          800: '#63402b',
          900: '#533627',
          950: '#2f1c12',
        },
        primary: {
          50: '#fdf4f3',
          100: '#fce8e6',
          200: '#fad4d2',
          300: '#f6b3af',
          400: '#f0847e',
          500: '#e45e54',
          600: '#d03f38',
          700: '#ae312d',
          800: '#902c29',
          900: '#772928',
          950: '#401210',
        },
        dark: {
          50: '#f6f6f7',
          100: '#e1e3e5',
          200: '#c3c7cc',
          300: '#9ea4ad',
          400: '#7a828e',
          500: '#606874',
          600: '#4c525c',
          700: '#3f434b',
          800: '#36393f',
          900: '#2f3136',
          950: '#1a1c1f',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
