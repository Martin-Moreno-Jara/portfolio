/** @type {import('tailwindcss').Config} */
export default {
  // 🔧 FIX ME (#1): the `content` array is empty. Tailwind scans the files
  // listed here to know which utility classes you actually use; everything
  // else is stripped out of the final CSS. With an empty array, EVERY class
  // gets purged and the site renders completely unstyled.
  // Hint: point it at your HTML and source files, e.g.
  //   ["./index.html", "./src/**/*.{ts,tsx}"]
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}
