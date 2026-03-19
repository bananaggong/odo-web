# 00 — 이지샵(EasyShop) 사이트 분석 요약

> 분석 대상: https://www.easyshop.co.kr
> 분석 일시: 2026-03-19
> 분석 범위: 공개 DOM, CSS, 네트워크 요청, 인터랙션 관찰

---

## 한 줄 요약

이지샵은 **개인사업자·임대사업자를 위한 세무/회계 SaaS**로, 자동장부·세무신고·기장대행·카드매출관리를 핵심 서비스로 제공한다. 인증된 회원 454,395명 규모의 서비스.

---

## 제품 콘셉트

| 축 | 내용 |
|---|---|
| 포지셔닝 | "사업자를 돕는 선한 손" — 세무 비용 절감 + 셀프 신고 |
| 핵심 주장 | 기존 세무사 대비 90% 비용 절감 (222만원 → 24만원) |
| 타겟 | 개인사업자 (자영업자, 프리랜서, 임대사업자) |
| 운영사 | 이지샵(주) + 한국정보통신(주)(KICC) 공동 운영 |
| 브랜드 컬러 | 초록색(#39A628) + 노란색(#FFDD33) 기반 밝고 친근한 톤 |

---

## 서비스 구조 (4대 핵심 서비스)

| 서비스 | URL | 요금 | 설명 |
|---|---|---|---|
| 자동장부 | `/taxBooks/taxBooks.kicc` | 간편 1.54만원/월, 복식 2.42만원/월 | 거래 자동수집 + 세무신고 |
| 기장대행 | `/taxTlwa/taxTlwaIntro.kicc` | 4.84만원/월~ | 제휴세무사 대행 |
| 임대사업자 | `/taxLeaseBiz/taxLeaseBizIntro.kicc` | 동일 | 임대특화 장부+관리 |
| 카드매출관리 | `/taxVan/taxVanTrx.kicc` | 무료 | 카드사 정산내역 조회 |

---

## 기술 스택 (확실)

- **서버**: Java/JSP (URL이 `.kicc` 확장자, 구형 Java Servlet 패턴)
- **프론트엔드**: jQuery + jQuery UI (Prototype.js도 일부 사용)
- **CSS 프레임워크**: 자체 커스텀 CSS (`easyshop.css`, `homeIntro.css`)
- **폰트**: Pretendard, Roboto, NanumSquare
- **분석 도구**: WiseTracker + Google Analytics 4 + Facebook Pixel
- **호스팅**: 자체 서버 (Vercel 아님)

---

## 핵심 UI 관찰

1. **GNB 고정 헤더**: `position: sticky`, 높이 73px, 최대너비 1200px
2. **로그인 폼 홈 노출**: 홈 히어로 섹션에 로그인 박스 함께 노출
3. **섹션 기반 스크롤**: `section.visual1` ~ `section.visual7` 순차 구성
4. **CTA 이중 구조**: 노란 버튼(`.btn_start`) + 초록 버튼(`.btn-link`) 병행
5. **반응형**: 브레이크포인트 767px (모바일), 360px (소형 모바일)
6. **레거시 기술 혼재**: jQuery + Prototype.js + `new Ajax.Request()` 병용
7. **배너 로테이션**: 랜덤 배너 JS로 동적 노출

---

## 서비스 연동 포인트 (요약)

| 연동 위치 | 방식 | 비고 |
|---|---|---|
| GNB 메뉴 추가 | `<li>` 항목 추가 | `util_menu` 클래스 내 |
| 히어로 섹션 삽입 | `section.visual1` 교체 또는 신규 섹션 추가 | |
| 로그인 이후 대시보드 | 내부 페이지 `/taxBooks/` 하위 진입 | 인증 필요 |
| 푸터 링크 추가 | `.fo_bottom_wrap` 내 추가 | |
| 고객지원 서브메뉴 추가 | `/taxCustCntr/` 하위 경로 신규 생성 | |

---

## 파일 목록

| 파일 | 내용 |
|---|---|
| `01_sitemap.md` | 전체 URL 구조 및 깊이 지도 |
| `02_components.md` | UI 컴포넌트 목록 및 클래스 매핑 |
| `03_design_tokens.md` | 색상, 폰트, 간격, 레이아웃 토큰 |
| `04_interactions.md` | 인터랙션 및 상태 전이 |
| `05_data_model.md` | 폼 데이터 구조 및 API 패턴 추정 |
| `06_tech_stack.md` | 기술 스택 상세 |
| `07_integration_spec.md` | 서비스 연동 명세 |
