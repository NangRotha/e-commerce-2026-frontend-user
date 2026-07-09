/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'moul': ['Moul', 'serif'],         // សម្រាប់ចំណងជើង (ដូចជា ហាង, ផលិតផលពេញនិយម)
        'khmer': ['Battambang', 'sans-serif'], // សម្រាប់អត្ថបទធម្មតា
      },
      colors: {
        primary: '#25398C',
      }
    },
  },
  plugins: [],
}