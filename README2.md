# ODO Web — 공식 기술 문서

> 매장 음악 플레이리스트 관리 및 수익 정산 플랫폼

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [시스템 아키텍처](#2-시스템-아키텍처)
3. [기술 스택](#3-기술-스택)
4. [프로젝트 구조](#4-프로젝트-구조)
5. [환경 설정](#5-환경-설정)
6. [설치 및 실행](#6-설치-및-실행)
7. [데이터베이스 스키마](#7-데이터베이스-스키마)
8. [API 명세](#8-api-명세)
9. [인증 및 권한](#9-인증-및-권한)
10. [주요 기능](#10-주요-기능)
11. [비즈니스 로직](#11-비즈니스-로직)
12. [컴포넌트 구조](#12-컴포넌트-구조)
13. [배포 가이드](#13-배포-가이드)
14. [개발 가이드라인](#14-개발-가이드라인)

---

## 1. 프로젝트 개요

**ODO(오디오)**는 매장 음악 방송 서비스로, 매장주(점주)가 ODO가 선별한 플레이리스트를 재생하고 그 재생 횟수에 따라 수익을 정산받을 수 있는 플랫폼입니다.

### 핵심 가치 제안

- 장르·업종별로 큐레이션된 상업 음악 플레이리스트 제공
- Last.fm API를 통한 실시간 재생 이력 추적
- 재생 횟수 기반 수익 정산 (단계별 구간제)
- 가맹점(세븐일레븐) / 개인 매장별 차등 수익 구조

### 대상 사용자

| 역할 | 접근 범위 | 사용 화면 |
|------|-----------|-----------|
| **관리자(Admin)** | 전체 사용자 데이터, 플레이리스트·아티스트 관리 | `/admin/*` |
| **점주(User)** | 본인 매장 통계, 플레이리스트 열람 | `/mypage`, `/playlists` |
| **비회원** | 메인 화면, 소개 페이지 | `/`, `/landing`, `/help` |

---

## 2. 시스템 아키텍처

```
┌──────────────────────────────────────────────────────────┐
│                      클라이언트 (Browser)                  │
│   Next.js App Router (React 19 / TypeScript)              │
│   ├─ 사용자 페이지 (mypage, playlists, signup)            │
│   └─ 관리자 포털 (admin/dashboard, settings)              │
└─────────────────────────┬────────────────────────────────┘
                          │ HTTPS
┌─────────────────────────▼────────────────────────────────┐
│                Next.js API Routes (서버)                   │
│   ├─ /api/lastfm/scrape      (Last.fm 데이터 수집)        │
│   ├─ /api/cron/sync          (야간 자동 동기화)            │
│   ├─ /api/stats              (통계 조회)                   │
│   ├─ /api/check-lastfm-id    (ID 검증)                    │
│   └─ /api/verify-recaptcha   (봇 탐지)                    │
└──────┬──────────────────────────────────┬────────────────┘
       │                                  │
┌──────▼───────┐                 ┌────────▼──────────────┐
│  Firebase    │                 │   외부 API             │
│  Firestore   │                 │   ├─ Last.fm API       │
│  Auth        │                 │   ├─ reCAPTCHA v3      │
│  Storage     │                 │   └─ Google OAuth      │
└──────────────┘                 └───────────────────────┘
```

### 데이터 흐름

1. **회원가입**: 구글 로그인 → Last.fm ID 검증 → reCAPTCHA → Firestore 저장
2. **재생 추적**: Last.fm 재생 → API 수집 → Firestore `listening_history`
3. **정산**: 야간 크론잡 → `daily_stats` 집계 → 관리자 대시보드 표시

---

## 3. 기술 스택

### 프론트엔드

| 항목 | 기술 | 버전 | 용도 |
|------|------|------|------|
| 프레임워크 | Next.js | 16.1.1 | App Router, SSR/SSG |
| UI 라이브러리 | React | 19.2.3 | 컴포넌트 기반 UI |
| 언어 | TypeScript | 5.9.3 | 정적 타입 체크 |
| 스타일링 | CSS Modules + Inline CSS | — | 컴포넌트 스코프 스타일 |
| 차트 | Recharts | 3.7.0 | 통계 시각화 |
| 차트 | Chart.js + react-chartjs-2 | 4.5.1 | 대시보드 차트 |
| 애니메이션 | Framer Motion | 12.24.7 | 페이지 전환, 카드 애니메이션 |
| 3D | Three.js + @react-three/fiber | 0.182.0 | 3D 그래픽 (선택적) |
| 드래그앤드롭 | @hello-pangea/dnd | 18.0.1 | 플레이리스트 순서 변경 |
| HTTP 클라이언트 | Axios | 1.13.4 | API 통신 |
| 쿠키 | js-cookie | 3.0.5 | 세션 관리 |

### 백엔드

| 항목 | 기술 | 버전 | 용도 |
|------|------|------|------|
| API 서버 | Next.js API Routes | — | RESTful 엔드포인트 |
| 데이터베이스 | Firebase Firestore | 12.9.0 | NoSQL 문서형 DB |
| 인증 | Firebase Auth | — | Google OAuth |
| 파일 스토리지 | Firebase Storage | — | 이미지 저장 |
| 서버 SDK | Firebase Admin | 13.6.1 | 서버사이드 DB 접근 |

### 외부 서비스

| 서비스 | 용도 |
|--------|------|
| **Last.fm API** | 사용자 음악 재생 이력 수집 |
| **Google OAuth 2.0** | 소셜 로그인 |
| **reCAPTCHA v3 Enterprise** | 회원가입 봇 탐지 |
| **YouTube API** | 플레이리스트 영상 정보 |
| **Vercel** | 배포 및 서버리스 함수 실행 |

---

## 4. 프로젝트 구조

```
odo-web/
├── src/
│   ├── app/                            # Next.js App Router
│   │   ├── layout.tsx                  # 루트 레이아웃 (폰트, 메타데이터)
│   │   ├── page.tsx                    # 홈 페이지 (/)
│   │   ├── globals.css                 # 전역 스타일
│   │   ├── fonts.ts                    # Paperlogy 폰트 설정
│   │   │
│   │   ├── admin/                      # 관리자 전용 페이지
│   │   │   ├── login/                  # 관리자 로그인
│   │   │   ├── dashboard/              # 메인 대시보드
│   │   │   │   └── [userId]/           # 개별 사용자 상세
│   │   │   ├── settings/               # 플레이리스트·아티스트 설정
│   │   │   ├── franchise/              # 가맹점 관리
│   │   │   └── validator/              # 데이터 검증 도구
│   │   │
│   │   ├── api/                        # Next.js API 라우트
│   │   │   ├── stats/                  # 전체 통계 조회
│   │   │   ├── check-lastfm-id/        # Last.fm ID 검증
│   │   │   ├── lastfm/scrape/          # Last.fm 데이터 수집
│   │   │   ├── verify-recaptcha/       # reCAPTCHA 검증
│   │   │   └── cron/sync/              # 야간 자동 동기화
│   │   │
│   │   ├── login/                      # 사용자 로그인 (Google OAuth)
│   │   ├── signup/                     # 회원가입
│   │   ├── mypage/                     # 개인 대시보드
│   │   ├── playlists/                  # 플레이리스트 목록
│   │   ├── setup/                      # 초기 설정 가이드
│   │   ├── landing/                    # 마케팅 랜딩 페이지
│   │   ├── help/                       # 도움말
│   │   ├── howto/                      # 사용 방법 가이드
│   │   ├── privacy/                    # 개인정보처리방침
│   │   └── terms/                      # 이용약관
│   │
│   ├── components/                     # 재사용 React 컴포넌트
│   │   ├── AdminDashboard.tsx          # 관리자 대시보드 (메인)
│   │   ├── AdminUserCard.tsx           # 사용자 카드 (관리자용)
│   │   ├── AdminUserDetailModal.tsx    # 사용자 상세 모달
│   │   ├── PlaylistCard.tsx            # 플레이리스트 카드
│   │   ├── PlaylistModal.tsx           # 플레이리스트 상세 모달
│   │   ├── PlaylistManager.tsx         # 플레이리스트 관리 도구
│   │   ├── PlaylistsClient.tsx         # 플레이리스트 목록 페이지
│   │   ├── UserDashboard.tsx           # 사용자 대시보드
│   │   ├── UserStats.tsx               # 사용자 통계
│   │   ├── HomeClient.tsx              # 홈 메인 컴포넌트
│   │   ├── SiteHeader.tsx              # 네비게이션 헤더
│   │   ├── SiteFooter.tsx              # 푸터
│   │   ├── ClientLayout.tsx            # 조건부 레이아웃
│   │   ├── EventBanner.tsx             # 이벤트 배너 캐러셀
│   │   ├── Carousel.tsx                # 공용 캐러셀
│   │   ├── Chips.tsx                   # 필터 태그 컴포넌트
│   │   ├── ManualDataFetcher.tsx       # 수동 데이터 수집 도구
│   │   └── howto/                      # 사용 방법 하위 컴포넌트
│   │
│   └── lib/                            # 유틸리티 및 설정
│       ├── firebase.ts                 # Firebase 클라이언트 SDK 초기화
│       ├── firebase-admin.ts           # Firebase Admin SDK 초기화
│       ├── auth-context.tsx            # 인증 Context (AuthProvider)
│       ├── types.ts                    # TypeScript 타입 정의
│       ├── playlists.ts                # 플레이리스트 상수 데이터
│       ├── revenue.ts                  # 수익 계산 로직
│       ├── banners.ts                  # 배너 이미지 설정
│       ├── date-utils.ts               # 날짜 유틸리티 (KST 처리)
│       ├── stats-constants.ts          # 통계 상수
│       └── faqs.ts                     # FAQ 데이터
│
├── public/
│   ├── images/                         # 플레이리스트 커버 이미지
│   ├── fonts/                          # Paperlogy 폰트 파일
│   ├── odo.png                         # OG 이미지
│   └── LAST.FM 설치 가이드.pdf         # 사용자 가이드 PDF
│
├── data/
│   └── playlists.xlsx                  # 플레이리스트 원본 데이터
│
├── seed-web.js                         # Firestore 데이터 시딩 스크립트
├── seed-artists.js                     # 아티스트 데이터 시딩
├── playlists.js                        # 플레이리스트 업로드 유틸
├── artists.csv                         # 화이트리스트 아티스트 CSV
├── stores.csv                          # 매장 데이터 CSV
├── next.config.ts                      # Next.js 설정
├── tsconfig.json                       # TypeScript 설정
└── eslint.config.mjs                   # ESLint 설정
```

---

## 5. 환경 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경변수를 설정합니다.

# Vercel & Firebase 기본 설정
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDMZLM_o4RS8jWzoiHCoVgMb7zltk9PgZY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=odo-openboard.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=odo-openboard
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=odo-openboard.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=330874188553
NEXT_PUBLIC_FIREBASE_APP_ID=1:330874188553:web:a0fc1884b49d0b28a759d8
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSyANkRqfjabShaErcQoEvH6YKwGlRyJGXHs
LASTFM_API_KEY=02916f36df91356e1d57abdf5a575519

NEXT_PUBLIC_LASTFM_API_KEY=02916f36df91356e1d57abdf5a575519

# Admin SDK 설정 (서버 사이드)
FIREBASE_PROJECT_ID=odo-openboard
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@odo-openboard.iam.gserviceaccount.com

# 아래와 같이 따옴표로 감싸고 내부 \n을 유지하거나, 실제 줄바꿈으로 바꿉니다.
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCoqVs9eL+/+UI9\nwU6aZOJRQDwyIY6VbGDqTo69xj+H1ELNhv4e5NM+7hvC2sUezlJqhr/FjWTrD6e/\n3AYE0jKa8iZ7X7hfE1LCC05w25YGOD9Le6sv5yiFNnhVsxBvD1Hxzn3sI+MmaUaT\nqwWgp//bmzBwKOrwl6DbUkMcS/FByPP5VEo5/GqIcqIjw9rBsgPFCVPibkTer0ym\nMxkqkH7do4WdZkY86wuwPNUjkRbX8ghceCkLp0bsP+LHRx2Ct4izbqYu86CgKqiU\nfRNmqGLoOfLwmSVUOrzc3yjLd3aeU0xDWEod8kA88gx+wZvyBcT0FWxvssak093r\n6IMlV/IBAgMBAAECggEAA+Q7y4Iqpcspf5VU74s0abdaSm8LnRVjVhH/yU+PgWxy\nqc8tXrG5iivs5Y3RnpXtnX9yfiRE2aO36o84C8cK0QoHIDise8lUb3oFXRAY4AmV\n7PNanjrAXnR9wrCrswoV+yNZJmTR6xpGPTEPo3w9vc7X8iGrj6BKO7frRTYRCBJQ\nk7xrDZrXSZAFVxBoeW0ZHnD5rdR/OLEgfBzJRcADgLYtCZhclUngI1Tay+au1JPb\nsmms2rl/z99p0uS29LQlwbFtV8agTve8o9h6QYYtTPEyx4i7hNDwXF64n/hCYY4K\njDiPyhLv2tfuzVScHxCVl9vsEmshdiXvobz5ncs9HQKBgQDRU7hAEuL2C5qgP4Hq\n2b1V8JSre1b6QmKCSoFaFp9qU8uOqZUd5Iff7UH4hSRB3yZw840Uq7AFj6FA8ZHq\n6k6fA1OaFFiEVwYuxuGXTrMgCEkMUFuaUu1AmLYa1apOzMaWFBjb2WaOqJc/mHZQ\nrHyFlNh6Wrhii4XbJr4MzBRGjQKBgQDORHjA5Sce1wRtNhgO1K02z/oV4/9U+xzp\nJgFCkqncv/9n/fCusvMCoAkYDhpuD6313BSXi4OSj6qwgvxcU6EyUwgtwUAwSgTX\nZpurdW9sn7PZymN3Q676zjU3bwhdM7P/05e+0hFLe9oephbUYu0N1/GnOmQpG7Jp\nqeLl4QgmRQKBgQCu7wkuutnjh2UMgKZhDuB03p5QBL52XF4Yxoz9LaTB5g9aRQxy\nM9b9YzjbqODZD9T/VfpUCPsMWrEHJhqsuG1F5DDMti4XQubO1rQWj9WQcnwhh1JW\nUPEnJ7ggCunN+sIHD/qKWE+l7uyfYBmYZ92UgQS8k+49pJ4TvHfdF/vlzQKBgEtG\nZ78VobI6i+4DOMJo0RHY0o6clzj/L2zSptERzxW1p9LetLA8tDy4BLmXpAOYi0bX\nW1h23Lxm28bw9oIHLyO7c5enF/LHgH7Pfm4TPGeq3KrVlnkW5Uu4Z2lkhuvki4MI\nSC+mYBNpDo/y0xANTi+oKBN8VsM9zV2MVzbHaf71AoGAYHp/k6ZrlL+sHn4OJTNE\n4ZiL5rWEVvC6PHXFYQMgUUSdbLP9IKdYSpU6OgSd+DcCW1uLI32XhFF+ZoY8NbtM\nV6oTY5p4DnWlfj/cP8LitW/m1gO+mQ42/FwOaBbtGvu+zzhylTJIYFOhYFk9eOdc\nqQfB/dzFycN3t2lNzUR8nM0=\n-----END PRIVATE KEY-----\n"


RECAPTCHA_SECRET_KEY=6Ldh-nUsAAAAAAetU2gGkbX7ZOjQthbM1QCI_gnC
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Ldh-nUsAAAAAOjcpcEVUJ4VddiIkcHDdEVX5jdd
> **주의:** `FIREBASE_PRIVATE_KEY`는 개행 문자(`\n`)를 그대로 유지해야 합니다. 따옴표로 감싸서 저장하세요.

### Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com)에서 프로젝트 생성
2. **Firestore Database** 활성화 (프로덕션 모드)
3. **Authentication** → Google 공급자 활성화
4. **Storage** 버킷 활성화
5. 서비스 계정 키 생성 → `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL` 입력

### Firestore 보안 규칙 예시

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 관리자만 모든 데이터 접근
    match /admins/{email} {
      allow read: if request.auth != null;
    }
    // 사용자는 본인 데이터만
    match /monitored_users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    // 관리자만 쓰기
    match /daily_stats/{id} {
      allow read: if request.auth != null;
      allow write: if false; // 서버 사이드만
    }
  }
}
```

---

## 6. 설치 및 실행

### 요구사항

- **Node.js** >= 18.x
- **npm** >= 9.x
- Firebase 프로젝트 (Firestore, Auth, Storage)

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd odo-web

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일 편집
```

### 개발 서버 실행

```bash
npm run dev
# http://localhost:3000
```

### 프로덕션 빌드

```bash
npm run build
npm start
```

### 데이터베이스 초기화

```bash
# 아티스트 화이트리스트 시딩 (artists.csv 기반)
node seed-artists.js

# 매장(사용자) 데이터 시딩
node seed-web.js

# 플레이리스트 데이터 업로드
node playlists.js
```

---

## 7. 데이터베이스 스키마

Firebase Firestore를 사용하며, 컬렉션 구조는 다음과 같습니다.

### 컬렉션 목록

```
Firestore
├── playlists/              # 플레이리스트 목록
├── monitored_users/        # 등록된 점주 계정
├── listening_history/      # 실시간 재생 이력
├── daily_stats/            # 일별 집계 통계
├── monitored_artists/      # 화이트리스트 아티스트
└── admins/                 # 관리자 계정
```

---

### `playlists` 컬렉션

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `string` | 문서 ID (예: `p1`, `p2`) |
| `title` | `string` | 플레이리스트 이름 |
| `genre` | `string` | 장르 (Jazz/Lounge, Acoustic, R&B 등) |
| `industry` | `string` | 업종 (Cafe, Restaurant, Gym 등) |
| `energy` | `"LOW" \| "MED" \| "HIGH"` | 에너지 레벨 |
| `vocal` | `"LOW" \| "MED" \| "HIGH"` | 보컬 존재감 |
| `duration` | `string` | 재생 시간 (예: "1시간 15분") |
| `tracks` | `number` | 트랙 수 |
| `tags` | `string[]` | 검색 태그 |
| `usecase` | `string` | 사용 시나리오 설명 |
| `ytmUrl` | `string` | YouTube Music 플레이리스트 URL |
| `image` | `string` | 커버 이미지 경로 |
| `coverUrl` | `string?` | 외부 커버 이미지 URL |

---

### `monitored_users` 컬렉션

> 문서 ID = Firebase Auth UID

| 필드 | 타입 | 설명 |
|------|------|------|
| `uid` | `string` | Firebase Auth UID |
| `lastfm_username` | `string` | Last.fm 계정 ID |
| `owner_name` | `string` | 점주 이름 |
| `store_name` | `string` | 매장 이름 |
| `franchise` | `"seveneleven" \| "personal"` | 가맹 유형 |
| `email` | `string?` | 이메일 주소 |
| `createdAt` | `Timestamp?` | 등록일시 |

---

### `listening_history` 컬렉션

> 문서 ID = 자동 생성

| 필드 | 타입 | 설명 |
|------|------|------|
| `userId` | `string` | Last.fm 사용자명 |
| `timestamp` | `Timestamp` | 재생 시각 (UTC) |
| `artist` | `string` | 아티스트명 |
| `track` | `string` | 트랙명 |
| `album` | `string?` | 앨범명 |

---

### `daily_stats` 컬렉션

> 문서 ID = `{YYYY-MM-DD}_{lastfm_username}`

| 필드 | 타입 | 설명 |
|------|------|------|
| `date` | `string` | 날짜 (KST, `YYYY-MM-DD`) |
| `lastfm_username` | `string` | Last.fm 사용자명 |
| `play_count` | `number` | 당일 유효 재생 수 |
| `store_name` | `string` | 매장 이름 |
| `owner_name` | `string` | 점주 이름 |
| `franchise` | `string` | 가맹 유형 |

---

### `monitored_artists` 컬렉션

> 문서 ID = 아티스트 이름

화이트리스트 아티스트. 이 컬렉션에 포함된 아티스트의 재생만 집계에 반영됩니다.

---

### `admins` 컬렉션

> 문서 ID = 이메일 주소 (예: `admin@odo.com`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `role` | `"admin"` | 관리자 역할 |

---

## 8. API 명세

### GET `/api/stats`

전체 플랫폼 통계를 반환합니다.

**응답**
```json
{
  "totalPlays": 1234567,
  "totalUsers": 250,
  "todayPlays": 5432
}
```

---

### GET `/api/check-lastfm-id`

Last.fm ID 유효성 및 중복 여부를 검사합니다.

**쿼리 파라미터**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `id` | `string` | O | 검사할 Last.fm 사용자명 |
| `myUid` | `string` | X | 현재 사용자 UID (중복 제외용) |

**응답**
```json
{
  "exists": true,
  "isDuplicate": false
}
```

| 필드 | 설명 |
|------|------|
| `exists` | Last.fm에 해당 ID가 존재하는지 여부 |
| `isDuplicate` | 이미 다른 계정에 등록된 ID인지 여부 |

---

### GET `/api/lastfm/scrape`

특정 사용자의 Last.fm 재생 이력을 수집하여 Firestore에 저장합니다.

**쿼리 파라미터**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `userId` | `string` | O | Firebase UID |
| `from` | `number` | X | 시작 타임스탬프 (Unix) |
| `to` | `number` | X | 종료 타임스탬프 (Unix) |

**응답**
```json
{
  "success": true,
  "count": 142
}
```

---

### POST `/api/verify-recaptcha`

reCAPTCHA v3 토큰을 서버사이드에서 검증합니다.

**요청 Body**
```json
{
  "token": "03AGdBq2..."
}
```

**응답**
```json
{
  "success": true,
  "score": 0.9
}
```

> `score`가 `0.5` 미만이면 봇으로 판단하여 회원가입을 차단합니다.

---

### GET `/api/cron/sync`

야간 자동 데이터 동기화를 실행합니다. 전일 KST 00:00 ~ 23:59의 재생 이력을 집계하여 `daily_stats`에 저장합니다.

> Vercel Cron Job으로 매일 자정 이후 자동 실행됩니다.

**응답**
```json
{
  "success": true,
  "synced": 145,
  "date": "2026-03-12"
}
```

---

## 9. 인증 및 권한

### 인증 흐름

```
1. 구글 로그인 버튼 클릭
       ↓
2. Firebase Auth → Google OAuth 팝업
       ↓
3. AuthContext: onAuthStateChanged 감지
       ↓
4. Firestore admins 컬렉션 확인
   ├─ 관리자 → /admin/dashboard 리디렉션
   └─ 일반 확인 → monitored_users 컬렉션 확인
         ├─ 등록된 점주 → /mypage 리디렉션
         └─ 미등록 → /signup 리디렉션
```

### AuthContext

`src/lib/auth-context.tsx`에서 관리하며 전체 앱에 인증 상태를 제공합니다.

```typescript
interface AuthContextType {
  user: User | null;          // Firebase User 객체
  role: "admin" | "user" | null;
  loading: boolean;
  logout: () => Promise<void>;
}
```

### 권한별 접근 범위

| 경로 | 비회원 | 점주 | 관리자 |
|------|--------|------|--------|
| `/` | O | O | O |
| `/login` | O | O | O |
| `/signup` | O | - | - |
| `/mypage` | - | O | - |
| `/playlists` | - | O | O |
| `/admin/*` | - | - | O |

### 보안 기능

- **reCAPTCHA v3 Enterprise**: 회원가입 시 봇 탐지 (점수 기반, 0.5 이하 차단)
- **서버사이드 UID 비교**: Last.fm ID 중복 검사 시 UID를 클라이언트에 노출하지 않음
- **Firebase Admin SDK**: 민감한 DB 작업은 서버 전용 SDK 사용
- **쿠키 세션**: 관리자 로그인 상태를 `admin_logged_in` 쿠키로 추적

---

## 10. 주요 기능

### 플레이리스트 관리

14개 이상의 큐레이션 플레이리스트를 제공합니다.

**필터 옵션:**

| 필터 | 옵션 |
|------|------|
| 장르 | Jazz/Lounge, Acoustic, R&B, Pop, Classical, Electronic, World |
| 업종 | Cafe, Restaurant, Bar, Gym, Retail, Hotel, Salon |
| 에너지 | LOW, MED, HIGH |
| 보컬 | LOW(연주곡), MED, HIGH(보컬 강조) |

**기능:**
- 실시간 필터링 및 검색
- 플레이리스트 상세 모달 (트랙리스트, YouTube Music 링크)
- 관리자: 드래그앤드롭 순서 변경, 추가/삭제

### 회원가입 프로세스

```
1. 구글 계정으로 로그인
2. Last.fm 계정 ID 입력 → 서버 검증
3. 매장 정보 입력 (매장명, 점주명, 가맹 유형)
4. reCAPTCHA 통과
5. Firestore monitored_users 등록
```

### 사용자 대시보드 (마이페이지)

- **기간 선택**: 일별 / 주별 / 월별 조회
- **핵심 지표**: 총 재생 수, 달성률(목표 7,500회 기준), 예상 수익
- **차트**: 기간별 재생 추이 그래프
- **누적 통계**: 전체 기간 합산

### 관리자 대시보드

- **사용자 목록**: 전체 점주 검색, 필터링, 정렬
- **통계 차트**: 일별/월별 플랫폼 전체 재생 추이
- **개별 상세**: 특정 점주의 상세 통계, 이력 조회
- **데이터 내보내기**: Excel/CSV 다운로드
- **수동 수집**: 특정 사용자 데이터 즉시 동기화

### 관리자 설정 페이지

- **플레이리스트 관리**: 추가, 수정, 삭제, 순서 변경
- **아티스트 관리**: 화이트리스트 아티스트 추가/삭제
- **정산 관리**: 수익 정산 내역 조회

---

## 11. 비즈니스 로직

### 수익 정산 구조

재생 횟수 구간에 따라 일별 수익이 책정됩니다.

**재생 구간 임계값:**
```
2,500회 / 5,000회 / 7,500회
```

**가맹 유형별 수익 (일별 기준):**

| 구간 | 세븐일레븐 가맹점 | 개인 매장 |
|------|------------------|-----------|
| 0 ~ 2,499회 | ₩0 | ₩0 |
| 2,500 ~ 4,999회 | ₩7,300 | ₩10,000 |
| 5,000 ~ 7,499회 | ₩14,300 | ₩20,000 |
| 7,500회 이상 | ₩22,000 | ₩30,000 |

**수익 계산 로직** (`src/lib/revenue.ts`):
```typescript
function calculateRevenue(
  playCount: number,
  franchise: "seveneleven" | "personal"
): number {
  const thresholds = [2500, 5000, 7500];
  const revenues = {
    seveneleven: [0, 7300, 14300, 22000],
    personal: [0, 10000, 20000, 30000],
  };

  let tier = 0;
  for (const threshold of thresholds) {
    if (playCount >= threshold) tier++;
    else break;
  }
  return revenues[franchise][tier];
}
```

### 재생 유효성 검증

모든 재생이 수익에 반영되지 않습니다. 다음 조건을 충족해야 유효한 재생으로 인정됩니다:

1. **화이트리스트 아티스트**: `monitored_artists` 컬렉션에 등록된 아티스트의 곡만 인정
2. **중복 제거**: 동일 트랙의 연속 재생은 1회로 처리
3. **일일 상한선**: 사용자당 하루 최대 10회 제한 (어뷰징 방지)

### 데이터 동기화 (Cron Job)

매일 자정 Vercel Cron Job으로 실행됩니다.

```
전일 KST 00:00 ~ 23:59 구간 조회
          ↓
Last.fm API에서 전체 점주 재생 이력 수집
          ↓
화이트리스트 아티스트 필터링
          ↓
중복 제거 및 집계
          ↓
daily_stats 컬렉션에 upsert
```

**KST 처리**: 서버는 UTC 기준이므로 `date-utils.ts`에서 +9시간 오프셋 처리

---

## 12. 컴포넌트 구조

### 레이아웃 계층

```
RootLayout (layout.tsx)
├─ AuthProvider (auth-context.tsx)
│   └─ ClientLayout (ClientLayout.tsx)
│       ├─ SiteHeader (조건부: 관리자 페이지 제외)
│       ├─ {children}
│       └─ SiteFooter (조건부: 관리자 페이지 제외)
```

### 주요 컴포넌트 상세

#### `HomeClient.tsx`
- 장르·업종별 플레이리스트 추천 섹션
- 실시간 통계 표시 (총 재생 수, 사용자 수)
- `EventBanner` 이벤트 캐러셀 포함

#### `AdminDashboard.tsx`
- 전체 사용자 목록 (검색, 필터, 정렬)
- 날짜 범위 선택기
- Recharts 기반 통계 차트
- Excel 내보내기 기능
- 개별 사용자 상세 모달 (`AdminUserDetailModal.tsx`)

#### `UserDashboard.tsx`
- 개인 재생 통계 시각화
- 수익 계산 및 달성률 표시
- 기간 선택 (일별 / 주별 / 월별)

#### `PlaylistsClient.tsx`
- 필터 패널 (Chips 컴포넌트 활용)
- 그리드 레이아웃의 플레이리스트 카드 목록
- 플레이리스트 상세 모달 트리거

#### `ManualDataFetcher.tsx`
- 관리자용 수동 데이터 수집 인터페이스
- 특정 사용자 또는 전체 동기화 트리거

### 상태 관리 패턴

```
전역 상태: AuthContext (인증 정보)
컴포넌트 상태: useState (폼, 모달, 필터)
캐시: sessionStorage (대시보드 데이터)
세션: js-cookie (관리자 로그인 상태)
서버 데이터: Firebase Firestore 실시간 리스너
```

---

## 13. 배포 가이드

### Vercel 배포 (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

**Vercel 환경변수 설정:**
Vercel 대시보드 → 프로젝트 → Settings → Environment Variables에서 `.env.local`의 모든 변수를 등록합니다.

### Vercel Cron Job 설정

`vercel.json` 파일을 생성합니다:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync",
      "schedule": "0 15 * * *"
    }
  ]
}
```

> UTC 15:00 = KST 00:00 (자정)

### Next.js 이미지 도메인 설정

`next.config.ts`에서 외부 이미지 도메인을 허용합니다:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'yt3.ggpht.com' },
      { protocol: 'https', hostname: 'yt3.googleusercontent.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'lastfm.freetls.fastly.net' },
    ],
  },
};
```

---

## 14. 개발 가이드라인

### 코드 규칙

- **언어**: TypeScript (strict 모드)
- **컴포넌트 네이밍**: PascalCase (예: `PlaylistCard.tsx`)
- **경로 별칭**: `@/` → `src/` (예: `import { User } from '@/lib/types'`)
- **클라이언트 컴포넌트**: 파일명에 `Client` 접미사 또는 `"use client"` 지시어
- **서버 컴포넌트**: 기본값 (App Router)

### 폴더별 역할

| 폴더 | 역할 |
|------|------|
| `src/app/` | 페이지 라우팅 (Next.js App Router) |
| `src/components/` | 재사용 가능한 UI 컴포넌트 |
| `src/lib/` | 유틸리티, 타입, 상수, Firebase 초기화 |

### Firebase SDK 사용 원칙

| 환경 | SDK | 파일 |
|------|-----|------|
| 클라이언트 컴포넌트 | Firebase Client SDK | `src/lib/firebase.ts` |
| API 라우트 (서버) | Firebase Admin SDK | `src/lib/firebase-admin.ts` |

> Admin SDK는 절대 클라이언트 컴포넌트에서 import하지 마세요.

### 타임존 처리

모든 날짜 계산은 **KST(UTC+9)**를 기준으로 합니다. `src/lib/date-utils.ts`를 사용하세요.

```typescript
import { toKSTDate, formatKSTDate } from '@/lib/date-utils';
```

### 타입 정의

공유 타입은 `src/lib/types.ts`에서 관리합니다.

```typescript
// 주요 타입
interface MonitoredUser { ... }
interface Playlist { ... }
interface DailyStat { ... }
interface ListeningHistory { ... }
```

---

## 부록

### 지원 브라우저

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 폰트

커스텀 폰트 **Paperlogy**를 `public/fonts/`에서 로컬 서빙합니다. (`src/app/fonts.ts`)

### 플레이리스트 장르 목록

```
Jazz/Lounge | Acoustic | R&B/Soul | Pop | Classical |
Electronic | World Music | Bossa Nova | Indie | K-Pop
```

### 지원 업종

```
Cafe | Restaurant | Bar/Pub | Gym/Fitness | Retail |
Hotel/Lobby | Hair Salon | Bookstore
```

---

*이 문서는 ODO Web 프로젝트의 공식 기술 문서입니다. 최종 업데이트: 2026-03-13*
