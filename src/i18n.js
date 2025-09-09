import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// 리소스 import (ESM로 바로 import)
import ko_common from "./locals/ko/common.json";
import en_common from "./locals/en/common.json";
import ja_common from "./locals/ja/common.json";
import zh_common from "./locals/zh/common.json";
import de_common from "./locals/de/common.json";
import fr_common from "./locals/fr/common.json";

/**
 * 앱이 켜질 때 번역 리소스(각 언어 JSON) 를 미리 로드하고,브라우저 언어를 감지해서 ko/en/ja/zh/de/fr 중 하나로 자동 설정해 주는 “i18n 엔진”이 필요
 * 이 파일이 한 번 초기화되면, 컴포넌트에서는 useTranslation()으로 간단히 t('키') 만 호출하면 돼.
 * 
 * 
 * 이 초기화의 핵심 포인트:
 * 1) resources: 언어별 번역 JSON 묶음 등록
 * 2) detection: 브라우저/쿼리스트링 등으로 언어 자동감지
 * 3) fallbackLng: 감지 실패 시 기본언어(ko)
 * 4) interpolation.escapeValue=false: React XSS는 React가 막아줘서 이 옵션 끔
 */

i18n
  .use(LanguageDetector) // 브라우저 언어 감지 플러그인
  .use(initReactI18next) // react-i18next 연결
  .init({
    resources: {
      ko: {common: ko_common},
      en: {common: en_common},
      ja: {common: ja_common},
      zh: {common: zh_common},
      de: {common: de_common},
      fr: {common: fr_common},
    },
    fallbackLng: "ko",
    supportedLngs: ["ko", "en", "ja", "zh", "de", "fr"],
    ns: ["common"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    detection: {
        // 언어 감지 우선순위: ?lang= → localStorage → cookie → 브라우저 설정 → <html lang="">
      order: ['querystring', 'navigator','htmlTag','cookie','localStorage'  ],
      lookupQuerystring: 'lang',
      caches: ['localStorage', 'cookie'],
    },
    returnNull: false, // 번역이 null이면 반칸 대신 key 보전
    returnEmptyString: false, // 빈 문자열도 막고 key를 찾도록 
    interpolation: { escapeValue: false },
  });

export default i18n;