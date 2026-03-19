# 04 — 인터랙션 및 상태 전이

> [사실]: DOM/JS에서 직접 관찰 / [추정]: 패턴 유추

---

## 1. 로그인 플로우

```
사용자 입력
  ↓
[아이디 입력] → keyup Enter → fncLogin()
[비밀번호 입력] → keyup Enter → fncLogin()
[로그인 버튼] click → fncLogin()
  ↓
클라이언트 유효성 검사
  ├── 아이디 비어있음 → #user_id_div.addClass('error') → 포커스
  └── 비밀번호 비어있음 → #password_div.addClass('error') → 포커스
  ↓ (통과)
loginPass = false (중복 제출 방지)
jQuery("#_method").val("login")
jQuery("#form").submit()
  ↓
POST /taxLogn/taxLognLogin.kicc
  ├── 성공 → nextURL 리다이렉트
  └── 실패 → 커스텀 alert 재정의 팝업
```

**아이디 저장 (사실)**:
- 체크 시: 쿠키 30일 유지 (`setGnbCookie("saveId", userId, date)`)
- 해제 시: 쿠키 만료 (어제 날짜로 set)
- 다음 방문 시: `getGnbCookie("saveId")` → `#user_id` 자동 채움

---

## 2. 회원가입 플로우 (2단계)

```
Step 1: 본인인증
  └── 이름 + 주민번호 + 휴대폰 + 통신사 선택
  └── 인증방식 선택 (SMS / KB인증서)
  └── 인증번호 발송 → 타이머 시작 (유효시간 표시)
  └── 인증번호 입력 → 인증 완료
      ↓
Step 2: 약관동의 + 사업자 정보
  └── 필수 약관 전체 동의
  └── 이메일/문자 수신 동의 (선택)
  └── 사업자 기본 정보 입력
  └── "완료" 버튼 → 가입 완료
```

**유효성 검사 방식**:
- 실시간 필드 검증 (입력할 때마다)
- 필수값 완료 시 버튼 활성화
- 통신사 선택에 따라 약관 항목 동적 변경

---

## 3. 탭 전환 (임대사업자 페이지)

```javascript
function fncImgChange(val) {
  for(i=1; i<=6; i++) {
    if(i == val) {
      // 선택 탭: _on.gif 이미지 + display 표시
      jQuery("#tabAskImg"+i).css("display","");
    } else {
      // 비선택 탭: _off.gif 이미지 + display:none
      jQuery("#tabAskImg"+i).css("display","none");
    }
  }
}
```

- **탭 UI**: 이미지 파일(_on.gif / _off.gif) 교체 방식
- **상태 유지**: URL 변경 없음 (클라이언트 state만)

---

## 4. 공지사항/FAQ 탭 전환 (홈)

```javascript
function fncChooseBbs(val) {
  if(val == "1") {
    // 공지사항 표시, FAQ 숨김
    jQuery("#notice").css("display","");
    jQuery("#faq").css("display","none");
    jQuery("#bbsFlag").val("1");
  } else if(val == "2") {
    // FAQ 표시, 공지사항 숨김
    jQuery("#notice").css("display","none");
    jQuery("#faq").css("display","");
    jQuery("#bbsFlag").val("2");
  }
}
```

---

## 5. 배너 랜덤 노출 (홈)

```javascript
var bannerTag = new Array();
bannerTag[0] = '<li>카드매출관리 배너</li>';
bannerTag[1] = '<li>LG U+ 배너</li>';
var idx = Math.floor(Math.random() * bannerTag.length);
// idx에 따라 해당 배너만 DOM에 삽입
```

- **빈도**: 페이지 로드 시 1회 (이후 고정)
- **배너 클릭 로그**: `GET /comm/BanerLog.kicc?pgm_id=taxIntro&baner_id={id}`

---

## 6. 회원수 카운팅 애니메이션 (홈)

```javascript
jQuery("#mbrCntArea_h").countTo({
  from: "454395" - 1000,
  to: "454395",
  speed: 2000,
  refreshInterval: 30,
  onUpdate: function(var1) {
    // 각 자릿수 개별 업데이트 (li 요소)
  }
});
```

**API 호출 (실제 데이터)**:
```
GET /m/taxIntro/taxIntroJson.kicc?_method=mbrCount
응답: { "mbrCnt": 454395 }
쿠키 캐싱: max-age=300 (5분)
```

---

## 7. 팝업 레이어 (사실)

```javascript
// 열기
function fncOpenPop(src, popName, width, height, left, top) {
  window.open(src, popName, 'width='+width+', height='+height+...);
}

// 레이어 팝업
function cfOpenLayer(html, width, height, event) { ... }
function cfCloseLayer() { ... }

// 하루 동안 열지 않기
function fncCloseLayer() {
  if(jQuery("#checkname").is(":checked"))
    fncSetCookie("intro_pop_20130628", "done", 1);
  cfCloseLayer();
}
```

---

## 8. 방문 추적 로그 (사실)

```javascript
// 페이지 진입 시 자동 호출
var param = "gh_code=null&referer=https://www.easyshop.co.kr/index.jsp";
new Ajax.Request('https://www.easyshop.co.kr/comm/GHLog.kicc', {
  method: 'post',
  parameters: param
});
```

- Prototype.js의 `Ajax.Request` 사용
- 방문 경로 추적 목적

---

## 9. 앱 다운로드 분기 (사실)

```javascript
function fnCardAppDown() {
  var mobileType = navigator.userAgent.toLowerCase();
  if (mobileType.indexOf('android') > -1) {
    document.getElementById("btnLink").setAttribute('href',
      'https://play.google.com/store/apps/details?id=kr.co.kicc.easyshop');
  } else if (mobileType.indexOf('iphone') > -1 || ...) {
    document.getElementById("btnLink").setAttribute('href',
      'https://apps.apple.com/kr/app/easyshop-mobile/id486312603');
  }
  // PC: 아무 동작 없음
}
```

---

## 10. 스크롤 기반 푸터 배너 (사실)

```javascript
window.addEventListener('scroll', function () {
  var scrollTop = window.pageYOffset;
  var windowHeight = window.innerHeight;
  var documentHeight = document.documentElement.scrollHeight;

  if (scrollTop === 0) {
    banner.classList.remove('fixed');
  } else {
    banner.classList.add('fixed');
  }

  if (scrollTop + windowHeight >= documentHeight - 100) {
    banner.classList.add('bottom');     // 페이지 하단: 고정 해제
    banner.classList.remove('fixed');
  } else {
    banner.classList.remove('bottom');
  }
});
```

- 스크롤 중: `.fixed` 클래스 → 화면 하단 고정
- 페이지 최하단: `.bottom` 클래스 → 자연스럽게 자리 잡음

---

## 11. 영상 플레이어 (사실)

```javascript
function fncOpenFlvLayer(type) {
  // JW Player 초기화 (FLV 파일 재생)
  jwplayer('mediaspace').setup({
    flashplayer: '/static/mediaplayer-5.7/player.swf',
    file: '...소개영상.flv',
    width: '960', height: '540',
    autostart: 'true'
  });
  cfOpenLayer(html, "960", "540", window.event);
}
```

- JW Player 5.7 (구버전, Flash 기반 → 현재 대부분 미작동)
- 레이어 팝업 방식으로 재생

---

## 12. 페이지 이동 패턴

| 트리거 | 이동 방식 | 대상 |
|---|---|---|
| GNB 링크 클릭 | `location.href` | 전체 페이지 이동 |
| 폼 제출 | `form.submit()` | POST + 리다이렉트 |
| CTA 버튼 | `location.href` | 가입/로그인 페이지 |
| 팝업 닫기 후 이동 | `fncOpener(url)` | opener.location.href |
| 배너 클릭 | `target="_blank"` | 새 탭 |

---

## 13. 에러 처리 패턴

```javascript
// 브라우저 기본 alert 재정의
window.alert = function(msg) {
  // 커스텀 팝업 표시
  showCustomAlert(msg);
};

// 필드 에러 표시
jQuery("#필드_div").addClass('error');
// → .ez_input_box.error .ez_input { border-color: #FF4848 }
// → .ez_input_box.error .err_mag { display: block }
```
