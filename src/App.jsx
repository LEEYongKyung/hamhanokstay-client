import { useEffect } from 'react';
import Home from './pages/Home'
//  <html lang> 동기화 작업 ( 접근성 & SEO에 도움)
//  현재 사용중인 언어를 <html lang="xx"> 에 반영하면 접근성/검색엔지이 더 잘 이해함
import { useTranslation } from 'react-i18next'

function App() {
  const {i18n, t} = useTranslation();

  useEffect(() => {
    const lang = i18n.resolvedLanguage || i18n.language || 'ko';
    // 중국어는 zh-Hans같은 형태로 지정하면 더 친절함
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang;
  }, [i18n.language]);
  return (
    <>
      <Home />
    </>
  )
}

export default App
