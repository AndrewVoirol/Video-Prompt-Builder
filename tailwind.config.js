/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{jsx,tsx,mdx}',
    './components/**/*.{jsx,tsx,mdx}',
    './app/**/*.{jsx,tsx,mdx}',
    './lib/**/*.{jsx,tsx,mdx}',
    './themes/**/*.{jsx,tsx,mdx}',
    './hooks/**/*.{jsx,tsx,mdx}',
  ],
  plugins: [require("tailwindcss-animate")],
}
