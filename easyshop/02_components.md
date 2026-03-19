# 02 — UI 컴포넌트

> [사실]: DOM/CSS에서 직접 확인 / [추정]: 구조 유추

---

## 1. 레이아웃 컴포넌트

### 1-1. 전체 래퍼 (사실)
```html
<div id="wrap" class="eztax_homeMain">
  <div class="header">...</div>
  <div id="container" class="container eztax_intro">...</div>
  <div class="footer">...</div>
</div>
```

### 1-2. 이너 컨테이너 (사실)
```html
<div class="inner">
  <!-- 콘텐츠, 최대 너비 1200px, 가운데 정렬 -->
</div>
```

---

## 2. GNB / 헤더 (사실)

```html
<div class="header">           <!-- position: sticky; height: 73px -->
  <div class="inner">
    <div class="logo">
      <a href="https://www.easyshop.co.kr">
        <img src="/static/home/new_images/homepage/logo.svg" alt="이지샵 로고">
      </a>
    </div>
    <ul class="util_menu">
      <li><a href="/taxBooks/taxBooks.kicc">자동장부</a></li>
      <li><a href="/taxTlwa/taxTlwaIntro.kicc">기장대행</a></li>
      <li><a href="/taxLeaseBiz/taxLeaseBizIntro.kicc">임대사업자</a></li>
      <li><a href="/taxCustCntr/taxCustCntrMain.kicc">고객지원</a></li>
      <li><a href="/taxVan/taxVanTrx.kicc">카드매출관리</a></li>
      <li><a href="/taxLogn/taxLognLogin.kicc" class="point">로그인</a></li>
      <li><a href="...">인증서업로드</a></li>
    </ul>
  </div>
</div>
```

**속성**:
- 높이: 73px
- 배경: 흰색 (`#fff`)
- `position: sticky; top: 0;` — 스크롤 시 상단 고정
- 로고: SVG 파일
- 로그인 링크: `.point` 클래스 (강조색 텍스트)

---

## 3. 섹션 컴포넌트

### 3-1. 히어로 섹션 — `section.visual1` (사실)

```html
<div class="section visual1">
  <div class="inner">
    <div class="tit_wrap">
      <div class="tit"><!-- 메인 헤드라인 --></div>
      <div class="tit_desc"><!-- 서브 카피 --></div>
      <div class="btn_wrap">
        <button class="btn_start">무료로 시작하기</button>
      </div>
    </div>
    <div class="main-login-box"><!-- 로그인 폼 --></div>
  </div>
</div>
```

### 3-2. 기능 소개 섹션 — `section.visual2` (사실)

```html
<div class="section visual2">
  <div class="inner">
    <div class="img_box"><!-- 기능 이미지 --></div>
    <div class="txt_box">
      <div class="txt"><!-- 기능 설명 --></div>
    </div>
  </div>
</div>
```

### 3-3. 장점 섹션 — `section.visual_advantages` (사실)

```html
<div class="section visual_advantages">
  <div class="inner">
    <div class="visual_txt_wrap">
      <div class="box">
        <div class="inner-box cont01">...</div>
        <div class="inner-box cont02">...</div>
      </div>
    </div>
  </div>
</div>
```

### 3-4. 셀프세무신고 비교 — `section.visual-tax-self` (사실)

```html
<div class="section visual-tax-self">
  <!-- 셀프신고 vs 기장대행 비교 레이아웃 -->
</div>
```

---

## 4. 로그인 폼 컴포넌트 (사실)

```html
<div class="main-login-box">
  <form id="form" action="/taxLogn/taxLognLogin.kicc" method="post">
    <!-- 숨김 필드 -->
    <input type="hidden" name="_method" id="_method" value="">
    <input type="hidden" name="nextURL" value="...">

    <!-- 아이디 입력 -->
    <div class="ez_input_box" id="user_id_div">
      <input type="text" id="user_id" name="user_id"
             placeholder="아이디를 입력해 주세요.">
    </div>

    <!-- 비밀번호 입력 -->
    <div class="ez_input_box" id="password_div">
      <input type="password" id="password" name="password"
             placeholder="비밀번호를 입력해 주세요.">
    </div>

    <!-- 아이디 저장 -->
    <div class="ez_chk_box">
      <input type="checkbox" name="saveIdCheck" id="saveIdCheck">
      <label for="saveIdCheck">아이디 저장</label>
    </div>

    <!-- 로그인 버튼 -->
    <button type="button" onclick="fncLogin()">로그인</button>

    <!-- 하단 링크 -->
    <a href="javascript:fncFindIdPw();">아이디/비밀번호찾기</a>
    <a href="/taxMebs/taxMebsMbership.kicc?_method=embeddedNameCheckForm">회원가입</a>
  </form>
</div>
```

**에러 처리**: 필드별 `.ez_input_box` 에 `.error` 클래스 추가 → 빨간 테두리 + 오류 메시지 노출

---

## 5. 버튼 컴포넌트 (사실)

### 5-1. 메인 CTA 버튼 (노랑)
```html
<button class="btn_start">1개월 무료 사용해보기</button>
<!-- 또는 -->
<a class="btn_start" href="...">무료로 시작하기</a>
```
- 배경: `#FFDD33`
- 높이: 60px (PC), 40px (모바일)
- `border-radius: 60px` (pill 형태)
- 폰트: 26px → 16px (모바일)

### 5-2. 링크 버튼 (초록)
```html
<a class="btn-link" href="...">기장대행 견적보기</a>
```
- 배경: `#39A628`
- 높이: 60px, `border-radius: 8px`
- 텍스트: 흰색

### 5-3. 폼 제출 버튼 (초록)
```html
<button class="ez_btn" type="submit">로그인</button>
```
- 배경: `#39A628`
- `max-width: 370px`, 높이: 54px
- `border-radius: 10px`
- Disabled: 배경 `#F4F4F4`, 텍스트 `#bbb`

### 5-4. 보조 버튼 (흰색 테두리)
```html
<button class="ez_btn_l">취소</button>
```
- `border: 1px solid #ccc`, 배경: 흰색

### 5-5. 소형 버튼 (회색)
```html
<button class="btn_id">확인</button>
```
- 배경: `#636263`, 높이: 30px, `border-radius: 6px`

---

## 6. 입력 폼 컴포넌트 (사실)

### 6-1. 텍스트 입력
```html
<div class="ez_input_box">          <!-- 상태 클래스: .error -->
  <label>레이블</label>
  <input class="ez_input" type="text" placeholder="...">
  <span class="err_mag">오류 메시지</span>  <!-- 에러 시 표시 -->
</div>
```
- 높이: 46px, 최대너비: 370px
- 보더: `1px solid #ddd`
- 포커스: `border-color: #39A628`
- 에러: `border-color: #FF4848`

### 6-2. 체크박스
```html
<div class="ez_chk_box">
  <input type="checkbox" id="id">
  <label for="id"><span class="i_chk"></span>레이블</label>
</div>
```
- 체크: 초록 아이콘 (`chk_on.svg`)

### 6-3. 라디오 버튼
```html
<div class="ez_radio_box">
  <input type="radio" id="r1" name="group">
  <label for="r1"><span class="square">선택지</span></label>
</div>
```
- 선택 시: `border-color: #39A628; color: #39A628`

### 6-4. 셀렉트 박스
```html
<div class="ez_select_box">
  <div class="select_area">
    <span class="select">선택됨</span>
    <ul class="select_list">
      <li>항목1</li>
      <li>항목2</li>
    </ul>
  </div>
</div>
```
- 커스텀 드롭다운 (네이티브 `<select>` 미사용)
- `border: 1px solid #7D7D7D; border-radius: 6px`

---

## 7. 카드 컴포넌트

### 7-1. 이지샵 장점 카드
```html
<div class="inner-box">
  <img src="...아이콘...">
  <strong>제목</strong>
  <p>설명</p>
</div>
```

### 7-2. 리뷰 카드 (사실)
```html
<!-- 업종 태그 + 리뷰 내용 + 사업자명 구조 -->
<div class="review-card">
  <span class="badge">부가세신고</span>
  <blockquote>"리뷰 내용..."</blockquote>
  <cite>업체명 │ 업종</cite>
</div>
```

### 7-3. 에이전트/서비스 카드 (기장대행 견적)
```html
<div class="round_box">
  <!-- 가입비, 월별 이용료, 추가 서비스 -->
</div>
```
- `border: 1px solid #E0E0E0; border-radius: 10px; padding: 40px 90px`

---

## 8. 팝업 / 모달 (사실)

```html
<div class="ez_pop">   <!-- position: fixed; z-index: 999 -->
  <div class="pop_inner">
    <button class="btn_close">닫기</button>
    <!-- 팝업 콘텐츠 -->
  </div>
</div>
<div class="dim">...</div>  <!-- 반투명 배경 -->
```
- 너비: 418px
- `border-radius: 10px`
- 위치: 화면 중앙 (`left: 50%; top: 50%; transform: translate(-50%, -50%)`)

---

## 9. 탭 컴포넌트 (임대사업자 페이지)

```html
<!-- 이미지 기반 탭 버튼 -->
<img id="tabAskBtn1" src="maintab01_off.gif" onclick="fncImgChange(1)">
<img id="tabAskBtn2" src="maintab02_off.gif" onclick="fncImgChange(2)">
<!-- 탭 콘텐츠 (display: none/block 토글) -->
<div id="tabAskImg1">...</div>
<div id="tabAskImg2">...</div>
```

---

## 10. 공지사항 롤링 배너 (사실)

- 3초 간격 자동 스크롤
- JS `setTimeout` 기반 애니메이션
- 공지사항 최신 N개 노출

---

## 11. 회원수 카운팅 애니메이션 (사실)

```html
<span id="mbrCntArea_h">
  <li id="mbr_cnt0">4</li>
  <li id="mbr_cnt1">5</li>
  <!-- ... 각 자릿수별 개별 li -->
</span>
```
- jQuery `countTo` 플러그인
- API 호출로 현재 회원수 가져옴: `GET /m/taxIntro/taxIntroJson.kicc?_method=mbrCount`
- 쿠키 캐싱 (max-age: 300초)

---

## 12. 푸터 (사실)

```html
<div class="footer">
  <div class="fo_bottom_wrap">  <!-- width: 1200px -->
    <!-- 서비스 링크 컬럼 -->
    <!-- 약관/정책 링크 -->
    <!-- 회사 정보 (2개 법인) -->
    <!-- 앱 다운로드 섹션 -->
  </div>
</div>
```

**2개 법인 정보 노출**:
- 이지샵(주): 서울 중구 세종대로 39 대한상공회의소 13층, TEL 1644-0907
- 한국정보통신(주): 동 건물 7층, TEL 1600-1234
