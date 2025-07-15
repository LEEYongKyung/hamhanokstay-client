> 프로젝트 개요 및 실행 방법
## 목표 
HAMHanokStay에 대한 홈페이지를 개설하여, 우리 한옥에 대한 숙박 예약 및 한옥관리가 가능한 완성된 플랫폼을 구현. 대상은 구글 광고 및 우리 브랜드를 알게되어 들어오는 사람들이 예약하도록 유도하는 것이다. 

## 완성 모습 
우리 한옥에 관심이 있는 게스트는 홈페이지를 통해 숙박 예약이 가능하며, 우리 한옥에서 진행하는 여러 행사 내용을 확인할 수 있다.  호스트는 한옥에 대한 예약관리 및 예약 현황을 확인할 수 있다.

## HAMHanokStay
전통 한옥 숙박시설인 "HAMHanokStay"의 온라인 예약 및 소개를 위한 웹어플리케이션 

## 🌐도메인 구성
- **홈페이지(현재)**: https://www.hamhanokstay.com
- 관리자페이지 : https://admin.hamhanokstay.com
- 게스트가이드페이지 : https://guide.hamhanokstay.com
##  🏗️ 기술 스택
- Frontend: React, TailwindCSS, React Router, i18next
- Backend: Node.js, Express
- DB : MongoDB Atlas
- DevOps : Docker, docker-compose

## 🗂️디렉토리 구조 요약 
- `/client`: 사용자 인터페이스(React)
- `/server`:API 및 백엔드 로직 (Express + MongoDB)
- `/docs`: 협업문서, 스펙, API,배포 설명 등 

## 📂디렉토리 구조 상세 

```
├── client/                # 프론트엔드 
│   ├── public/
│   ├── src/
│   │   ├── assets/        # 이미지, 폰트, 정적 리소스
│   │   ├── components/    # 공통 컴포넌트
│   │   ├── pages/         # 각 페이지 컴포넌트 
│   │   ├── routes/        # React Router 정의
│   │   ├── services/      # API 통신 로직 (axios 등)
│   │   ├── i18n/          # 다국어 번역 리소스
│   │   └── App.tsx        # 루트 컴포넌트
│   └── tailwind.config.js
│
├── server/                # 백엔드 
│   ├── src/
│   │   ├── controllers/   # 예약, 이메일 처리 등의 로직
│   │   ├── routes/        # API 라우팅 정의
│   │   ├── models/        # MongoDB 스키마
│   │   ├── services/      # 외부 연동 서비스 (결제, 메일 등)
│   │   ├── utils/         # 유틸 함수들
│   │   └── app.js         # 익스프레스 서버 시작점
│   └── .env               # 환경 변수
│
├── docs/                  # 문서 디렉토리
│   ├── README.md          # 프로젝트 개요 및 실행 방법
│   ├── specs.md           # 🔹 기능 명세 문서 템플릿
│   ├── sitemap.md         # 🔹 사이트맵 구조 템플릿
│   ├── page-contents.md   # 각 페이지별 콘텐츠 정의 문서
│   ├── reservation-flow.md # 예약 흐름 상세 문서
│   ├── api.md             # 🔹 API 명세 템플릿
│   ├── deployment.md      # Docker 기반 배포 문서 템플릿
│   └── i18n.md            # 다국어 처리 가이드 템플릿
├── docker-compose.yml     # 프론트 + 백엔드 + MongoDB 연동
├── Dockerfile             # 서버용 도커파일 (프론트도 분리 시 추가)
├── .gitignore
└── package.json           # 루트 의존성 설정 (혹은 client/server에 개별 설치)

```

## 🚀실행 방법 

```bash
docker-compose up --build
```

## ✍️협업 방식 
- 기능 단위 브런치 생성 : `feature/예약폼`, `fix/bug-이메일`
- 커밋 메시지 규칙 : `feat:`, `fix:`, `docs:`,`chore(설정만 변경):`, `refactor(리팩토링):`
- PR 후 코드리뷰 및 병합

## 📭문의 및 기여 
- 운영자 : hamhanokstay@gmail.com
- Github Issues 사용 권장 

