/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(284.48deg, #003459 22.18%, #007EA7 49.05%, #00A8E8 82.18%)',
      },
      width: {
        'custom': '1325px',
      },
      height: {
        'custom': '650px',
      },
      inset: {
        '-245': '-115px',
        '-180': '-95px',
      },
      borderRadius: {
        'right': '300px',
      }
    },
  },
  plugins: [],
};
