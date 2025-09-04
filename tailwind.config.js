/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fefae0", // 크림은 배경색 추가 
        main: "#402a1c",
        hanji: "#f5f5f2"

      },
      fontFamily: {
        gowun: ['GowunDodum-Regular', 'sans-serif'],
        // chosun: ['ChosunCentennial', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
  ],
}

