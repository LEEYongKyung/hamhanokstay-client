import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
// 앱 보다 먼저 i18n 초기화해야 컴포넌트들이 t()를 통해 번역 정보를 바로 쓸 수 있음.
import './i18n.js';

// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
