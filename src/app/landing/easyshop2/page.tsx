// app/landing/easyshop2/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import FaqAccordion from "./FaqAccordion";

export const metadata: Metadata = {
  title: "ODO | 이지샵 파트너 혜택",
  description: "이지샵 사업자를 위한 매장 음악 혜택 서비스 — 틀 때마다 혜택이 쌓입니다.",
};

const HOW_TO = [
  {
    step: "STEP 1",
    title: "YouTube Music 준비",
    desc: "ODO 플레이리스트는 YouTube Music으로 재생됩니다. 개인·매장 계정 모두 가능하며 별도 기기 구매는 불필요합니다.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#39A628" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    step: "STEP 2",
    title: "최초 1회 설정 (Last.fm 연동)",
    desc: "크롬 확장 프로그램을 최초 1회 설치하면 이후 조작 없이 자동으로 작동합니다. 재생 이력이 정산의 기준 자료로 활용됩니다.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#39A628" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
  {
    step: "STEP 3",
    title: "플레이리스트 재생",
    desc: "ODO에서 매장에 맞는 플레이리스트를 선택하고 재생하세요. 틀어준 만큼 혜택이 쌓입니다.",
    icon: (
      <svg viewBox="0 0 24 24" fill="#39A628" width="20" height="20" aria-hidden="true">
        <path d="M5 3l14 9L5 21V3z" />
      </svg>
    ),
  },
];

const GRID_CELLS = [
  { num: "01", title: "추가 비용 없음", desc: "이지샵 이용 중이라면 별도 비용 없이 혜택을 받을 수 있습니다." },
  { num: "02", title: "월 최대 3만원", desc: "재생 시간에 따라 월 최대 3만원 상당 혜택이 적립됩니다." },
  { num: "03", title: "저작권 걱정 없음", desc: "AI 큐레이션 음원으로 매장 저작권 문제를 해결합니다." },
  { num: "04", title: "광고 없는 재생", desc: "매장 분위기를 해치는 광고 없이 쾌적하게 재생됩니다." },
];

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSf0yLS-x-d6LwdpYxA4G2k3V6xDYsAQR_rU13lNxZSwybKD6g/viewform";

export default function EasyshopLanding2() {
  return (
    <>
      {/* Pretendard 폰트 로드 */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/pretendard@latest/dist/web/static/pretendard.css"
        crossOrigin="anonymous"
      />

      <div className={styles.page}>
        {/* ── S1: Hero ── */}
        <section className={styles.s1}>
          <img
            src="/images/pos.png"
            alt="매장 음악 사용 예시"
            className={styles.heroImage}
          />
          <div className={styles.heroDim} aria-hidden="true" />
          <div className={styles.heroBody}>
            <h1 className={styles.heroHeadline}>
              이지샵 사업자라면
              <br />
              음악을 틀 때마다
              <br />
              <span className={styles.heroAccent}>혜택이 쌓입니다</span>
            </h1>
            <p className={styles.heroSub}>
              추가 비용 없이, 이지샵 회원 전용으로
              <br />
              월 최대 3만원 상당 혜택을 받으세요.
            </p>
            <a
              className={styles.btnYellow}
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              무료로 시작하기
            </a>
          </div>
        </section>

        {/* ── S2: Feature Tags + 4-Grid ── */}
        <section className={styles.s2}>
          <div className={styles.tagList}>
            {["매장 전용", "광고 없음", "저작권 클리어", "이지샵 전용 혜택"].map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>

          <div className={styles.gridWrapper}>
            <div className={styles.grid2x2}>
              {GRID_CELLS.map((cell) => (
                <div key={cell.num} className={styles.gridCell}>
                  <span className={styles.cellNum}>{cell.num}</span>
                  <p className={styles.cellTitle}>{cell.title}</p>
                  <p className={styles.cellDesc}>{cell.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── S3: YouTube Embed ── */}
        <section className={styles.s3}>
          <p className={styles.s3Label}>이런 음악이 매장에서 재생됩니다</p>
          <div className={styles.ytWrap}>
            <iframe
              src="https://www.youtube.com/embed/ntVJYQtyQ0s?rel=0"
              title="매장 음악 샘플 재생"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className={styles.ytFrame}
            />
          </div>
        </section>

        {/* ── S4: Mockup ── */}
        <section className={styles.s4}>
          <h2 className={styles.sectionTitle}>매장 어디서든 간편하게</h2>
          <p className={styles.sectionSub}>
            노트북, PC, 태블릿 어디서나 음악을 재생하고 혜택을 받으세요.
          </p>
          <div className={styles.mockupWrap}>
            <img
              src="/images/landing.jpg"
              alt="서비스 화면 예시"
              className={styles.mockupImg}
            />
          </div>
        </section>

        {/* ── S5: How to ── */}
        <section className={styles.s5}>
          <h2 className={styles.sectionTitle}>이용 방법</h2>
          <div className={styles.howToList}>
            {HOW_TO.map((item) => (
              <div key={item.step} className={styles.howToItem}>
                <div className={styles.iconBox}>{item.icon}</div>
                <div className={styles.howToText}>
                  <span className={styles.stepNum}>{item.step}</span>
                  <p className={styles.stepTitle}>{item.title}</p>
                  <p className={styles.stepDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.howToCtaRow}>
            <Link className={styles.btnGreenLink} href="/howto">
              자세한 설정 안내 보기
            </Link>
          </div>
        </section>

        {/* ── S6: FAQ ── */}
        <section className={styles.s6}>
          <h2 className={styles.sectionTitle}>자주 묻는 질문</h2>
          <FaqAccordion />
          <div className={styles.faqCtaRow}>
            <Link className={styles.btnGreenLink} href="/howto">
              FAQ 더 보기
            </Link>
          </div>
        </section>

        {/* ── S7: CTA ── */}
        <section className={styles.s7}>
          <h2 className={styles.s7Title}>지금 바로 시작해보세요</h2>
          <p className={styles.s7Sub}>
            이지샵 사업자 전용 혜택, 지금 신청하면 바로 이용 가능합니다
          </p>
          <div className={styles.s7BtnRow}>
            <a
              className={styles.s7BtnYellow}
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              무료로 시작하기
            </a>
            <Link className={styles.s7BtnWhite} href="/howto">
              이용 방법 보기
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
