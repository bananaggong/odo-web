# 06 — 기술 스택

> [확실]: 직접 확인 / [추정]: 패턴/파일명으로 유추

---

## 서버 사이드 (확실)

| 기술 | 근거 |
|---|---|
| **Java Servlet / JSP** | URL 확장자 `.kicc` (KICC 커스텀 서블릿 매핑), `Ajax.Request` POST body 패턴 |
| **KICC 자체 프레임워크** | `.kicc` 확장자가 한국정보통신(KICC)의 프레임워크 식별자 |
| **REST-like 메서드 오버라이드** | `?_method=login`, `?_method=mbrCount` 패턴 (POST-only 서버에서 GET/PUT 시뮬레이션) |

---

## 프론트엔드 (확실)

| 기술 | 버전 | 근거 |
|---|---|---|
| **jQuery** | ~1.x-3.x | `jQuery(function(){...})`, `jQuery("#id")` 패턴 |
| **jQuery UI** | 1.8.12 | CSS 파일 경로 `/jquery-ui-1.8.12.custom.css` |
| **Prototype.js** | 불명 | `new Ajax.Request(...)` — Prototype.js 전용 API |
| **CKEditor 5** | 46.0.0 | CSS CDN `cdn.ckeditor.com/ckeditor5/46.0.0/ckeditor5.css` |
| **Swiper** | 불명 | CSS 파일 `/new_css/swiper/scrollbar.min.css` |
| **JW Player** | 5.7 | `/static/mediaplayer-5.7/player.swf` (Flash, 레거시) |
| **jQuery countTo** | — | 회원수 카운팅 애니메이션 플러그인 |

---

## CSS (확실)

| 파일 | 목적 |
|---|---|
| `easyshop.css?ver=20260209` | 공통 컴포넌트 스타일 (최신) |
| `homeIntro.css?ver=20260101` | 홈 랜딩 전용 섹션 레이아웃 |
| `taxIntro.css?ver=20230920` | 소개 페이지 스타일 (구버전) |
| `easytax.css?v=20230830_` | 세무 기능 공통 스타일 |
| `jquery-ui-1.8.12.custom.css` | jQuery UI 스타일 |
| `ckeditor5.css` | 에디터 스타일 |
| `scrollbar.min.css` | 커스텀 스크롤바 |

---

## 폰트 (확실)

| 폰트 | 용도 |
|---|---|
| **Pretendard** | 기본 한글/영문 (최신 폰트) |
| **Roboto** | 영문/숫자 보조 |
| **NanumSquare** | 보조 한글 (구버전 페이지) |

---

## 분석 및 마케팅 (확실)

| 도구 | 용도 | 근거 |
|---|---|---|
| **Google Analytics 4** | 방문자 분석 | GA4 태그 확인 |
| **Google Ads (AW-900944351)** | 전환 추적 + 리마케팅 | `google_conversion_id = 900944351` |
| **WiseTracker** | 국내 웹 분석 도구 | `WDOTInitialization` 함수 |
| **Facebook Pixel (2315350972050519)** | 리마케팅 | `fbq('init', ...)` |
| **Roosevelt (navercorp)** | 네이버 광고 추적 | `roosevelt_params` 변수 |

---

## 호스팅 / 인프라 (추정)

| 항목 | 추정값 | 근거 |
|---|---|---|
| 호스팅 | 자체 서버 또는 IDC | Vercel/Netlify/AWS 흔적 없음, 구형 Java 구조 |
| CDN | 미사용 또는 자체 CDN | 정적 파일이 같은 도메인 `/static/` 경로 |
| SSL | HTTPS (Let's Encrypt 또는 유료 인증서) | https:// 접속 가능 |

---

## 레거시 / 기술 부채 관찰

| 항목 | 상태 |
|---|---|
| Prototype.js + jQuery 혼용 | 하위호환성 유지 목적으로 두 라이브러리 공존 |
| JW Player Flash 기반 | 동영상 재생 현재 사실상 미작동 (Chrome Flash 지원 종료) |
| jQuery UI 1.8.12 | 2011년 버전 사용 중 (보안 취약점 가능성) |
| `.gif` 이미지 기반 탭 UI | 이미지 교체 방식의 탭 전환 |
| `window.open()` 기반 팝업 | 팝업 차단기에 의해 차단될 수 있음 |
| FLV 영상 포맷 | 지원 종료 포맷 |
| 버전 쿼리스트링 수동 관리 | `?ver=20260209` 방식 (빌드툴 없음) |

---

## 모바일 앱 (확실)

| 플랫폼 | ID/링크 | 스토어 |
|---|---|---|
| Android | `kr.co.kicc.easyshop` | Google Play |
| iOS | `id486312603` | App Store |

앱 다운로드 분기: `navigator.userAgent` 기반 Android/iOS/PC 분기
