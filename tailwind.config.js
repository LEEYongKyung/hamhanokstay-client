/** @type {import('tailwindcss').Config} */
// tailwind.config.js : 디자인 시스템 설계도
// 프로젝트 전반에서 사용도리 색상, 폰트 크기, 간격, 그림자 등 모든 디자인의 규칙을 정의하고 커스터마이징 역활
// 
export default {
  content: [ // 어떤 파일들을 스캔하여 사용된 클래스를 찾아낼지 경로 설정 
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { // 고유한 디자인을 추가 
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

