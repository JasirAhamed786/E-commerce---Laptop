module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'amazon-orange': '#ff9900',
        'amazon-blue': '#146eb4',
        'amazon-yellow': '#ffed4e',
      },
      fontFamily: {
        'amazon': ['Amazon Ember', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
