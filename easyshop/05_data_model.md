# 05 — 데이터 모델 및 API 패턴

> [사실]: 공개 DOM/JS에서 관찰된 구조 / [추정]: 패턴으로 유추

---

## URL/API 패턴 (사실)

```
https://www.easyshop.co.kr/{섹션}/{액션}.kicc
                                           ↑
                            Java Servlet/JSP 확장자 (.kicc는 KICC 커스텀 확장자)

쿼리 파라미터:
  ?_method={HTTP 메서드 오버라이드}   ← REST-like 메서드 오버라이드
  ?CPC_REFERER={유입 URL}             ← 광고 추적
```

**관찰된 API 목록**:

| 메서드 | URL | 설명 |
|---|---|---|
| GET | `/m/taxIntro/taxIntroJson.kicc?_method=mbrCount` | 회원수 조회 (JSON 응답) |
| POST | `/comm/GHLog.kicc` | 방문/GA 로그 기록 |
| GET | `/comm/BanerLog.kicc?pgm_id=...&baner_id=...` | 배너 클릭 로그 |
| POST | `/taxLogn/taxLognLogin.kicc` | 로그인 처리 |
| GET/POST | `/taxMebs/taxMebsMbership.kicc` | 회원가입 처리 |

---

## 로그인 폼 데이터 (사실)

```
POST /taxLogn/taxLognLogin.kicc

Form Fields:
  _method      = "login"                    (hidden)
  user_id      = "사용자아이디"               (text)
  password     = "비밀번호"                  (password)
  saveIdCheck  = "on" | undefined           (checkbox)
  nextURL      = "/taxBooks/taxBooks.kicc"   (hidden, 로그인 후 이동 경로)
  nextURL2     = ""                          (hidden)
```

---

## 회원수 API 응답 (사실)

```
GET /m/taxIntro/taxIntroJson.kicc?_method=mbrCount

Response (JSON):
{
  "mbrCnt": 454395
}

쿠키 캐싱: introMbrCnt={mbrCnt}; max-age=300
```

---

## 회원가입 폼 데이터 (사실)

### Step 1: 본인인증

```
POST /taxMebs/taxMebsMbership.kicc

Fields:
  name          = "이름"            (한글/영문만)
  jumin1        = "123456"         (주민번호 앞 6자리)
  jumin2        = "1"              (주민번호 뒷 1자리)
  phone         = "01012345678"    (11자리)
  telecom       = "SKT|KT|LGU|MVNO" (통신사)
  authType      = "SMS|KB"         (인증 방식)
  authNum       = "123456"         (인증번호)
```

### Step 2: 약관동의

```
Fields:
  agreeService  = "Y"    (서비스 이용약관, 필수)
  agreePrivacy  = "Y"    (개인정보 수집, 필수)
  agreeThird    = "Y"    (제3자 제공, 필수)
  agreeVan      = "Y"    (통합매출관리 서비스, 필수)
  agreeEmail    = "Y|N"  (이메일 수신, 선택)
  agreeSms      = "Y|N"  (문자 수신, 선택)
```

---

## 방문 로그 파라미터 (사실)

```
POST /comm/GHLog.kicc

Body:
  gh_code = "null" | "{광고코드}"
  referer = "https://www.easyshop.co.kr/index.jsp"
```

---

## 배너 로그 파라미터 (사실)

```
GET /comm/BanerLog.kicc

Query:
  _method  = "regist"
  pgm_id   = "taxIntro"
  baner_id = "000" | "001" | "002"  (배너 종류)
```

---

## 쿠키 구조 (사실)

| 쿠키명 | 값 | 만료 | 용도 |
|---|---|---|---|
| `saveId` | 사용자 아이디 | 30일 | 아이디 자동저장 |
| `introMbrCnt` | 회원수 숫자 | 300초 | 회원수 캐싱 |
| `intro_pop_20130628` | `"done"` | 1일 또는 10년 | 팝업 미표시 설정 |
| `gh_code` | 광고 코드 | 10년 | 광고 유입 추적 |

---

## 서비스 요금 데이터 (사실 — DOM에서 관찰)

```typescript
interface PricePlan {
  type: '간편장부' | '복식부기';
  monthlyFee: number;      // 원
  vatTaxFee: number;       // 부가세 신고 (원)
  incomeTaxFee: number;    // 종합소득세 신고 (원)
  registrationFee: number; // 가입비
}

const plans: PricePlan[] = [
  {
    type: '간편장부',
    monthlyFee: 15400,       // 1.54만원/월
    vatTaxFee: 0,            // 무료 포함 추정
    incomeTaxFee: 55000,     // 5.5만원/건
    registrationFee: 33000,  // 3.3만원
  },
  {
    type: '복식부기',
    monthlyFee: 24200,       // 2.42만원/월
    vatTaxFee: 0,
    incomeTaxFee: 55000,
    registrationFee: 33000,
  }
];

// 기장대행 요금
const tlwaPlan = {
  monthlyFee: 48400,         // 4.84만원/월~
  incomeTaxFee: 250000,      // 25만원
};
```

---

## 에이전트 리뷰 데이터 구조 (추정 — DOM 관찰)

```typescript
interface Review {
  category: string;  // "부가세신고"
  quote: string;     // 리뷰 내용
  bizName: string;   // "맑음음악교습소"
  bizType: string;   // "음악교습소"
}
```

---

## 무료 혜택 데이터 (사실)

```typescript
const freeBenefits = [
  { title: '장부 1개월 무료 사용', desc: '간편장부 또는 복식장부' },
  { title: '전자세금계산서 10건', desc: '무료 발행' },
  { title: '카드매출 입금관리(이지체크)', desc: '카드사 정산 확인' },
  { title: '세무사 온라인 세무상담', desc: '무료 1회' },
  { title: '자영업자창업백과사전(도서)', desc: '무료 제공' },
];
```

---

## 통계/지표 데이터 (사실)

```typescript
const stats = {
  memberCount: 454395,                   // 2026-03-19 기준
  costSaving: {
    existing: 2220000,                   // 기존 세무사 연간 222만원
    selfReport: 240000,                  // 이지샵 셀프신고 24만원
    delegated: 830000,                   // 이지샵 기장대행 83만원
  },
  videoPlayer: {
    introVideo: '/jsp/home/page/taxIntro/introduce_video.flv',
    interviewVideo: '/jsp/home/page/taxIntro/interviewBringCoffee.flv',
  }
};
```
