/** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{html,ts}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/david-ui-angular/**/*.{html,ts,js,mjs}"
    
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')({
      charts: true,
  }),
  ],
}