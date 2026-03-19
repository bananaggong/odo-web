# 01 — 사이트맵

> [사실]: DOM에서 직접 확인된 URL / [추정]: 패턴으로 유추

---

## URL 패턴 규칙

```
https://www.easyshop.co.kr/{섹션}/{액션}.kicc[?_method={메서드}]

섹션 명명 규칙: tax + {기능명} (camelCase)
액션 파일: {섹션명} + {서브기능} + .kicc
```

---

## 전체 라우트 트리

```
www.easyshop.co.kr
│
├── / → /taxIntro/taxIntro.kicc          [홈 랜딩]
│
├── /taxBooks/                            [자동장부]
│   └── taxBooks.kicc
│
├── /taxTlwa/                             [기장대행]
│   └── taxTlwaIntro.kicc
│
├── /taxLeaseBiz/                         [임대사업자]
│   └── taxLeaseBizIntro.kicc
│
├── /taxVan/                              [카드매출관리]
│   └── taxVanTrx.kicc
│   └── taxVanAccount/
│       └── taxVanAccountOrix.kicc
│
├── /taxCustCntr/                         [고객지원]
│   ├── taxCustCntrMain.kicc              [메인]
│   ├── taxCustCntrFst.kicc              [첫 방문 시 궁금한 점]
│   ├── onairEdu.kicc                    [생방송교육]
│   ├── potcast.kicc                     [팟캐스트]
│   ├── taxCustCntrRvw.kicc              [이용후기]
│   ├── taxCustCntrHelp.kicc             [도움말]
│   ├── taxCustCntrOff.kicc              [오프라인 교육]
│   ├── taxCustCntrRfroom.kicc           [자료실]
│   ├── taxCustCntrNotice.kicc           [공지사항]
│   ├── taxCustCntrNews.kicc             [뉴스]
│   │
│   ├── taxCustCntrBstx/                 [기초 세무 정보]
│   │   ├── taxCustCntrBooks.kicc        [간편장부/복식부기]
│   │   ├── taxCustCntrIdvtx.kicc        [개인사업자 세무]
│   │   ├── taxCustCntrIdvtxdedu.kicc    [개인사업자 세액공제]
│   │   ├── taxCustCntrCortx.kicc        [법인사업자 세무]
│   │   ├── taxCustCntrTxknd.kicc        [업종별 세무]
│   │   └── taxCustCntrTx.kicc           [세무이야기]
│   │
│   └── taxCustCntrGuide/                [자동장부 가이드]
│       ├── taxCustCntrSt.kicc           [시작하기/장부쓰기]
│       ├── taxCustCntrBiz.kicc          [수집내역/실적관리]
│       ├── taxCustCntrTaxRpt.kicc       [세무신고하기]
│       ├── taxCustCntrPay.kicc          [급여/4대보험]
│       └── taxCustCntrEleTax.kicc       [전자세금계산서]
│
├── /taxLogn/                             [인증/로그인]
│   └── taxLognLogin.kicc               [로그인]
│
├── /taxMebs/                             [회원관리]
│   └── taxMebsMbership.kicc            [회원가입]
│       ?_method=embeddedNameCheckForm   [본인인증 단계]
│
└── /comm/                               [공통 API]
    ├── GHLog.kicc                       [방문 로그]
    └── BanerLog.kicc                    [배너 클릭 로그]
```

---

## 페이지별 상세

### `/taxIntro/taxIntro.kicc` — 홈 랜딩

**역할**: 서비스 전체 소개 + 로그인 진입점
**섹션 구성**:
| 섹션 클래스 | 내용 |
|---|---|
| `section.visual1` | 히어로 + 로그인 폼 + CTA |
| `section.visual2` | 핵심 기능 이미지+텍스트 |
| `section.visual_advantages` | 이지샵 장점 리스트 |
| `section.visual-tax-self` | 셀프세무신고 vs 기장대행 비교 |
| 리뷰 섹션 | 실제 사장님 후기 (6개) |
| 고객센터 안내 | 원격교육, 온라인상담, 동영상강의 |
| 카드매출관리 앱 | 앱 다운로드 배너 |
| 푸터 | 회사정보 + 링크 |

---

### `/taxBooks/taxBooks.kicc` — 자동장부

**역할**: 자동장부 서비스 소개 + 가입 유도
**핵심 내용**:
- 무료 혜택 5종 (장부, 전자세금계산서, 이지체크, 세무상담, 도서)
- 비용 절감 계산기 (외부세무사 222만원 vs 이지샵 24만원)
- 기능별 섹션 (카드내역 자동분류, 전자장부, 거래수집, 급여, 세무신고)
- 교육 프로그램 안내

---

### `/taxTlwa/taxTlwaIntro.kicc` — 기장대행

**역할**: 제휴세무사 기장대행 서비스 소개
**핵심 내용**:
- 기장비용 비교표
- 서비스 프로세스 (4단계 슬라이드)
- CTA: "회원가입하고 견적 확인하기"
- 랜딩 URL: `/taxMebs/taxMebsMbership.kicc?_method=embeddedNameCheckForm`

---

### `/taxLeaseBiz/taxLeaseBizIntro.kicc` — 임대사업자

**역할**: 임대사업자 전용 특화 서비스
**서브 탭 4개**:
- 자산관리
- 임대관리
- 경영관리
- 세금관리

**요금**: 간편장부 15,400원/월, 복식부기 24,200원/월

---

### `/taxVan/taxVanTrx.kicc` — 카드매출관리

**역할**: 카드사 정산 내역 실시간 조회
**핵심 기능**:
1. 실시간 거래내역 조회
2. 카드사별 입금예정내역
3. 전표보기
4. 부가세 참조자료

---

### `/taxLogn/taxLognLogin.kicc` — 로그인

**역할**: 회원 인증 진입
**폼**: user_id + password + saveIdCheck
**에러**: CSS `.error` 클래스 + 커스텀 alert 재정의

---

### `/taxMebs/taxMebsMbership.kicc` — 회원가입

**역할**: 신규 회원 가입 (2단계)
- Step 1: 본인인증 (휴대폰/KB인증서)
- Step 2: 약관동의 + 사업자 정보 입력

---

### `/taxCustCntr/taxCustCntrMain.kicc` — 고객지원

**역할**: 고객 지원 허브
**서브 구조**: 첫방문 / 기초세무정보(6) / 자동장부가이드(5) / 기타(5)
**BEST 5 섹션**: 자주 묻는 5개 질문-답변 카드 노출

---

## 내비게이션 구조 (GNB)

```
[로고] | 자동장부 | 기장대행 | 임대사업자 | 고객지원 | 카드매출관리 | [로그인] [인증서업로드]
```

- 로그인 링크: `.point` 클래스 (강조 스타일)
- 활성 메뉴: [사실 미확인] 현재 페이지 강조 방식 추가 확인 필요

---

## 외부 연결 링크

| 서비스 | URL |
|---|---|
| 모바일 앱 (Android) | `https://play.google.com/store/apps/details?id=kr.co.kicc.easyshop` |
| 모바일 앱 (iOS) | `https://apps.apple.com/kr/app/easyshop-mobile/id486312603` |
| LG U+ 제휴 | `http://www.uplus.co.kr/biz/...` |
| 한의사협회 랜딩 [추정] | `/taxAssocKrMedIntro/...` |

---

## 미발견 경로 (추정)

- `/taxBooks/` 하위 — 실제 장부 작성 화면 (로그인 필요)
- `/taxRport/` — 세무신고 화면 (로그인 필요)
- `/taxPayroll/` — 급여관리 화면 (로그인 필요)
- `/taxAdmin/` — 관리자 페이지 (추정, 접근 불가)
