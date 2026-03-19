# 03 — 디자인 토큰

> [사실]: CSS 파일(`easyshop.css`, `homeIntro.css`)에서 직접 추출
> CSS 파일: `/static/home/new_css/easyshop.css?ver=20260209`
>            `/static/home/new_css/homeIntro.css?ver=20260101`

---

## 색상 (Colors)

### 브랜드 컬러

| 이름 | 값 | 사용처 |
|---|---|---|
| Primary Green | `#39A628` | 버튼, 링크, 포커스 테두리, 강조 텍스트 |
| Accent Yellow | `#FFDD33` | 메인 CTA 버튼 (`.btn_start`) |
| Dark Footer | `#333643` | 푸터 배경 |

### 텍스트 컬러

| 이름 | 값 | 사용처 |
|---|---|---|
| Text Primary | `#222` | 메인 본문 텍스트 |
| Text Secondary | `#4A4A4A` | 서브 텍스트 |
| Text Tertiary | `#7D7D7D` | 보조 텍스트, 레이블 |
| Text Placeholder | `#BBBBBB` | placeholder 텍스트 |
| Text White | `#fff` | 버튼 위 텍스트, 역배경 |

### 상태 컬러

| 이름 | 값 | 사용처 |
|---|---|---|
| Error Red | `#FF4848` | 오류 상태 테두리, 오류 메시지 |
| Warning Orange | `#F56200` | 경고 |
| Disabled | `#F4F4F4` | 비활성 버튼 배경 |
| Disabled Text | `#bbb` | 비활성 버튼 텍스트 |

### 배경 컬러

| 이름 | 값 | 사용처 |
|---|---|---|
| BG Light Gray | `#F4F4F4` | 카드 배경, disabled |
| BG Light Green | `#F6FFEF` | 섹션 배경 (그린 톤) |
| BG Light Beige | `#FFFBEF` | 섹션 배경 (옐로 톤) |
| BG Blue | `#D3E8F8` | KB 관련 섹션 |
| BG Scrollbar | `#F2F2F2` | 스크롤바 트랙 |

### 테두리 컬러

| 이름 | 값 | 사용처 |
|---|---|---|
| Border Light | `#E0E0E0` | 카드 테두리 (`.round_box`) |
| Border Input | `#ddd` | 입력 필드 기본 테두리 |
| Border Dark | `#7D7D7D` | 셀렉트 박스 드롭다운 |

---

## 타이포그래피 (Typography)

### 폰트 패밀리

```css
/* 기본 한글/영문 (사실) */
font-family: "Pretendard", "Roboto", sans-serif;

/* 숫자 전용 */
font-family: "Roboto";

/* 보조 한글 */
font-family: "NanumSquare";
```

### 폰트 사이즈 스케일

| 용도 | PC | 모바일 |
|---|---|---|
| 히어로 헤드라인 | 64–80px | 24–28px |
| 섹션 타이틀 | 30–50px | 20–24px |
| 본문 | 16–20px | 14–16px |
| 작은 텍스트/레이블 | 12–14px | 12px |
| CTA 버튼 텍스트 | 26px | 16px |
| 폼 입력 텍스트 | 14px | 14px |

### 폰트 두께

| 사용처 | weight |
|---|---|
| 히어로 헤드라인 | 700–800 |
| 섹션 타이틀 | 500–700 |
| CTA 버튼 | 500–600 |
| 본문 | 400 |
| 보조 설명 | 300–400 |

---

## 레이아웃 (Layout)

### 컨테이너 너비

| 요소 | 너비 |
|---|---|
| 최대 컨텐츠 너비 | 1200px |
| 헤더 이너 | 1200px |
| 푸터 이너 (`fo_bottom_wrap`) | 1200px |
| 회원 관련 컨테이너 (`memberBody`) | min-width 1200px |
| 폼 영역 (`.round_box`) | 550px |
| 입력 필드 최대 (`ez_input`, `ez_btn`) | 370px |

### 헤더

```css
.header {
  height: 73px;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 100;
}
```

### 섹션 패딩

| 환경 | 패딩 |
|---|---|
| PC | `150px 0` |
| 모바일 | `40px 0` |

### Inner 패딩 (모바일)

```css
@media (max-width: 767px) {
  .container .section .inner { padding: 40px 20px; }
}
```

---

## 컴포넌트 치수 (Sizing)

### 버튼

| 컴포넌트 | 높이 | 너비 | border-radius |
|---|---|---|---|
| `.btn_start` | 60px | auto (padding) | 60px (pill) |
| `.btn-link` | 60px | auto (padding) | 8px |
| `.ez_btn` | 54px | 100% (max 370px) | 10px |
| `.ez_btn_l` | 54px | 100% (max 370px) | 10px |
| `.btn_id` | 30px | 58px | 6px |

### 입력 필드

| 컴포넌트 | 높이 | 최대 너비 | border-radius |
|---|---|---|---|
| `.ez_input` | 46px | 370px | 6px |

### 팝업

| 컴포넌트 | 너비 | border-radius |
|---|---|---|
| `.ez_pop` | 418px | 10px |
| `.round_box` | 550px | 10px |

---

## 브레이크포인트 (Breakpoints)

```css
/* 모바일 (사실) */
@media (max-width: 767px) { ... }

/* 소형 모바일 (사실) */
@media (max-width: 360px) { ... }
```

**주요 변경 사항 (PC → 모바일)**:
- 레이아웃: `flex row` → `block`
- 섹션 너비: `1200px fixed` → `100% fluid`
- 섹션 패딩: `150px 0` → `40px 20px`
- 제목 크기: `64–80px` → `24–28px`
- 버튼 높이: `60px` → `30–38px`
- 컨테이너 `min-width: 1200px` → 해제

---

## CSS 파일 목록 (사실)

| 파일 | 역할 |
|---|---|
| `/static/home/new_css/easyshop.css?ver=20260209` | 공통 컴포넌트 (버튼, 폼, 팝업, 헤더, 푸터) |
| `/static/home/new_css/homeIntro.css?ver=20260101` | 홈 인트로 페이지 섹션별 레이아웃 |
| `/static/home/css/easytax.css?v=20230830_` | 레거시 세무 스타일 |
| `/static/home/css/taxIntro.css?ver=20230920` | 소개 페이지용 |
| `/static/home/new_css/swiper/scrollbar.min.css` | Swiper 슬라이더 |
| `/static/home/jquery/css/ui-lightness/jquery-ui-1.8.12.custom.css` | jQuery UI (구버전) |
| `https://cdn.ckeditor.com/ckeditor5/46.0.0/ckeditor5.css` | CKEditor 5 (편집기) |
