# 07 — 서비스 연동 명세

> 이지샵 사이트에 우리 서비스를 붙이기 위한 UI 연동 포인트 분석
> [사실]: 확인된 DOM 구조 / [추정]: 유추된 패턴

---

## 연동 시나리오 개요

이지샵은 **레거시 Java/JSP 기반 모놀리식 구조**이므로,
연동 방식은 다음 3가지 트랙으로 접근 가능합니다:

| 트랙 | 방식 | 난이도 |
|---|---|---|
| A. GNB/사이드 삽입 | JavaScript 인젝션 또는 서버 템플릿 수정 | 낮음 |
| B. 신규 `.kicc` 페이지 추가 | 서버 사이드 JSP 페이지 신규 생성 | 중간 |
| C. 인증 연동 후 내부 대시보드 진입 | 세션 기반 인증 후 내부 페이지 삽입 | 높음 |

---

## 연동 포인트 상세

### 포인트 1: GNB 메뉴 항목 추가

**현재 DOM 구조**:
```html
<ul class="util_menu">
  <li><a href="...">자동장부</a></li>
  <li><a href="...">기장대행</a></li>
  <li><a href="...">임대사업자</a></li>
  <li><a href="...">고객지원</a></li>
  <li><a href="...">카드매출관리</a></li>
  <li><a href="..." class="point">로그인</a></li>
  <li><a href="...">인증서업로드</a></li>
</ul>
```

**연동 방법**:
```html
<!-- 기존 목록에 추가 -->
<li><a href="/우리서비스/intro.kicc">우리 서비스명</a></li>
<!-- 또는 강조 표시 -->
<li><a href="/우리서비스/intro.kicc" class="point">우리 서비스명</a></li>
```

**스타일 적용**:
- 기본 링크: `util_menu li a` 스타일 자동 상속
- 강조 링크: `.point` 클래스 (초록 또는 특수 색상)

---

### 포인트 2: 홈 히어로 섹션 내 배너/CTA 삽입

**현재 DOM 구조**:
```html
<div class="section visual1">
  <div class="inner">
    <div class="tit_wrap">...</div>
    <div class="main-login-box">...</div>
  </div>
</div>
```

**연동 방법 (A — 아래에 섹션 추가)**:
```html
<div class="section visual1">
  ...기존 내용...
</div>

<!-- 신규 섹션 삽입 -->
<div class="section" style="background: #F6FFEF; padding: 60px 0;">
  <div class="inner">
    <div class="tit_wrap">
      <div class="tit">우리 서비스 제목</div>
      <div class="tit_desc">간단한 설명</div>
      <div class="btn_wrap">
        <a class="btn_start" href="/우리서비스/intro.kicc">시작하기</a>
      </div>
    </div>
  </div>
</div>
```

---

### 포인트 3: 고객지원 서브메뉴 추가

**현재 고객지원 서브메뉴 구조**:
```
/taxCustCntr/
  ├── 첫방문/교육
  ├── 기초 세무 정보 (6개)
  └── 자동장부 가이드 (5개)
```

**연동 방법 (신규 카테고리 추가)**:
```
/taxCustCntr/
  ...기존...
  └── 우리 서비스 가이드
      ├── /taxCustCntr/ourService/intro.kicc
      └── /taxCustCntr/ourService/guide.kicc
```

---

### 포인트 4: 푸터 서비스 링크 추가

**현재 푸터 구조**:
```html
<div class="fo_bottom_wrap">
  <!-- 서비스 링크 컬럼 -->
  자동장부 | 기장대행 | 임대사업자 | 카드매출관리 | 고객지원
</div>
```

**연동 방법**:
```html
자동장부 | 기장대행 | 임대사업자 | 카드매출관리 | 고객지원 | [우리 서비스]
```

---

### 포인트 5: 로그인 이후 대시보드 진입

**현재 인증 흐름**:
```
POST /taxLogn/taxLognLogin.kicc
→ 세션 쿠키 발급
→ nextURL 리다이렉트 (기본: /taxBooks/taxBooks.kicc)
```

**연동 방법 (nextURL 파라미터 활용)**:
```html
<a href="/taxLogn/taxLognLogin.kicc?nextURL=/우리서비스/dashboard.kicc">
  우리 서비스로 로그인
</a>
```

---

## UI 컴포넌트 재사용 가이드

신규 페이지에서 이지샵 디자인 시스템을 재사용하려면:

### CSS 임포트

```html
<!-- 공통 컴포넌트 스타일 (필수) -->
<link rel="stylesheet" href="/static/home/new_css/easyshop.css?ver=20260209">

<!-- 홈 섹션 레이아웃 (선택) -->
<link rel="stylesheet" href="/static/home/new_css/homeIntro.css?ver=20260101">
```

### 버튼 재사용

```html
<!-- 노란 메인 CTA 버튼 -->
<button class="btn_start">우리 서비스 시작하기</button>

<!-- 초록 링크 버튼 -->
<a class="btn-link" href="...">자세히 보기</a>

<!-- 초록 폼 제출 버튼 -->
<button class="ez_btn" type="submit">확인</button>
```

### 입력 필드 재사용

```html
<div class="ez_input_box" id="field_wrap">
  <label>필드명</label>
  <input class="ez_input" type="text" placeholder="입력해 주세요.">
  <span class="err_mag">오류 메시지</span>
</div>

<!-- 에러 상태: JavaScript로 클래스 토글 -->
<script>
  jQuery("#field_wrap").addClass('error');
</script>
```

### 카드/섹션 재사용

```html
<div class="round_box">
  <!-- width: 550px, border-radius: 10px -->
  콘텐츠
</div>
```

### 섹션 템플릿

```html
<div class="section visual1" style="background: #F6FFEF;">
  <div class="inner">
    <!-- 콘텐츠 최대너비 1200px 자동 적용 -->
    <div class="tit_wrap">
      <div class="tit">섹션 타이틀</div>
      <div class="tit_desc">설명 텍스트</div>
      <div class="btn_wrap">
        <a class="btn_start" href="...">CTA 텍스트</a>
      </div>
    </div>
  </div>
</div>
```

---

## 연동 시 주의사항

### 기술적 제약

| 항목 | 내용 |
|---|---|
| 서버 언어 | Java/JSP 서버에 JSP 파일 배포 또는 리버스프록시 필요 |
| 인증 | KICC 독자 세션 시스템 — 표준 JWT/OAuth와 다를 수 있음 |
| jQuery 버전 | 구버전 jQuery + Prototype.js 혼용 — 충돌 주의 |
| Flash 의존성 | JW Player 5.7 Flash 미작동 — 영상 대체 방안 필요 |
| 팝업 차단 | `window.open()` 팝업 방식 — 최신 브라우저에서 차단 가능 |

### 스타일 충돌 주의

```css
/* 이지샵의 전역 스타일이 우리 컴포넌트에 영향을 줄 수 있음 */
/* 우리 컴포넌트를 고유 클래스로 래핑 권장 */
.our-service-wrapper {
  /* 이지샵 스타일 격리 */
  all: initial;
  /* 이지샵 폰트 상속 유지 */
  font-family: "Pretendard", "Roboto", sans-serif;
}
```

### 반응형 대응

```css
/* 이지샵과 동일한 브레이크포인트 사용 */
@media (max-width: 767px) {
  /* 모바일 스타일 */
}
@media (max-width: 360px) {
  /* 소형 모바일 스타일 */
}
```

---

## 디자인 통합 체크리스트

연동 UI가 이지샵과 자연스럽게 어우러지기 위한 체크리스트:

- [ ] 폰트: Pretendard 사용
- [ ] Primary 버튼: `#39A628` (초록) 또는 `#FFDD33` (노랑)
- [ ] 헤더 높이 73px 기준으로 레이아웃 조정 (`padding-top` 또는 `margin-top`)
- [ ] 컨텐츠 최대너비: 1200px + `margin: 0 auto`
- [ ] 모바일 브레이크포인트: 767px 동일 적용
- [ ] 에러 색상: `#FF4848`
- [ ] 테두리 반경: 버튼 8–60px, 입력 6px, 카드 10px
- [ ] GNB 고정(`position: sticky`)에 의한 상단 오프셋 73px 처리

---

## 페이지 삽입 위치 추천 (서비스 유형별)

| 우리 서비스 유형 | 추천 연동 위치 | 이유 |
|---|---|---|
| AI 세무 자동화 | `section.visual_advantages` 내 항목 추가 | 기존 장점 섹션에 자연스럽게 추가 |
| 금융 서비스 | 홈 `section.visual2` 이후 신규 섹션 | 기능 소개 섹션 흐름에 맞춤 |
| 교육/컨텐츠 | `/taxCustCntr/` 서브메뉴 추가 | 교육 채널로 진입 |
| 결제/구독 | GNB + 가격 페이지 신규 생성 | 비용 비교 흐름에 배치 |
| B2B/API | 푸터 + 별도 랜딩 페이지 | 개발자/사업자 타겟 별도 랜딩 |
