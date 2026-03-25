// app/landing/easyshop/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import styles from "./page.module.css";
import YouTubeSection from "./YouTubeSection";

export const metadata: Metadata = {
  title: "ODO | EASYSHOP",
  description: "EASYSHOP 사업자를 위한 매장 음악 혜택 서비스",
};

function PillBox({ children }: { children: React.ReactNode }) {
  return (
    <span className={`${styles.pill} ${styles.pillStatic} ${styles.pillEqual}`}>
      {children}
    </span>
  );
}

export default function EasyshopLandingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.stageScroll}>
        <main className={styles.main}>
          {/* HERO */}
          <div className={styles.heroCard}>
            <div className={styles.heroMedia}>
              <img
                src="/images/pos-hero.png"
                alt="hero"
                className={styles.heroImg}
              />
              <div className={styles.heroDim} />
            </div>
            <div className={styles.heroOverlay}>
              <h1 className={styles.heroHeadline}>
                매장 음악이<br /><span className={styles.accent}>포인트</span>가 됩니다
              </h1>
              <p className={styles.heroSub}>
                ODO 플레이리스트를 재생하면<br />
                들은 만큼 포인트로 돌아옵니다
              </p>
              <div className={styles.heroCtas}>
                <a className={styles.heroCtaYellow} href="#cta">
                  포인트 받으러가기
                </a>
              </div>
            </div>
          </div>

          {/* STATEMENT */}
          <section className={styles.statementSection} id="howto">
            <div className={styles.statementStage}>
              <div className={styles.statementInner}>
                <h2 className={styles.h2}>
                  ODO는 매장 음악을
                  <br />
                  무료로 제공하면서도
                  <br />
                  <span className={styles.accent}>듣는만큼 환급</span>해드립니다.
                </h2>

                <p className={styles.desc}>
                  <br />
                </p>
              </div>
            </div>
            {/* 혜택 블록 */}
            <div className={styles.benefitWrap}>
              <div className={styles.benefitGrid}>
                <div className={styles.benefitItem}>
                  <img src="/images/landing-point.png" alt="" className={styles.benefitImg} />
                  <p className={styles.benefitLabel}>월 최대 3만원 상당 혜택</p>
                </div>
                <div className={styles.benefitItem}>
                  <img src="/images/lading-no.png" alt="" className={styles.benefitImg} />
                  <p className={styles.benefitLabel}>추가 비용 없음</p>
                </div>
                <div className={styles.benefitItem}>
                  <img src="/images/thumbup.png" alt="" className={styles.benefitImg} />
                  <p className={styles.benefitLabel}>저작권 100% 프리</p>
                </div>
              </div>

              <div className={styles.spacer} />

              <div className={styles.closing}>음악은 틀지만, 남는 건 없었습니다</div>
            </div>
          </section>

          {/* 4-card 피처 섹션 */}
          <section className={styles.featureSection}>
            <div className={styles.featureSectionInner}>
              <div className={styles.featureCardRow}>
                <div className={styles.featureCard}>
                  <span className={styles.featureCardBadge}>1</span>
                  <p className={styles.featureCardTitle}>매장에서 틀어도 저작권 문제 없는 음악만 제공합니다.</p>
                  <p className={styles.featureCardDesc}>※ ODO 음원으로만 구성되어 있습니다.</p>
                </div>
                <div className={styles.featureCard}>
                  <span className={styles.featureCardBadge}>2</span>
                  <p className={styles.featureCardTitle}>매장에 맞는 플레이리스트를 바로 골라 재생할 수 있습니다.</p>
                  <p className={styles.featureCardDesc}>※ 주기적인 플레이리스트 업데이트</p>
                </div>
                <div className={styles.featureCard}>
                  <span className={styles.featureCardBadge}>3</span>
                  <p className={styles.featureCardTitle}>매장에서 음악을 재생한 만큼 정산금을 지급받습니다.</p>
                  <p className={styles.featureCardDesc}>※ 재생 기록을 집계하는 Last.fm 연동은 무료 서비스입니다.</p>
                </div>
                <div className={`${styles.featureCard} ${styles.featureCardAccent}`}>
                  <span className={styles.featureCardBadge}>4</span>
                  <p className={styles.featureCardTitle}>처음 한 번만 설정하고 이후에는 플레이리스트만 재생하세요.</p>
                </div>
              </div>
            </div>
          </section>

          <YouTubeSection />



          {/* 통합 이용 가이드 */}
          <section className={styles.stepWrap} aria-label="ODO 이용 가이드">
            <div className={styles.stepContainer}>
              {/* 팁 카드 */}
              <div className={styles.stepTipCard}>
                <div className={styles.stepTipKicker}>ODO 실전 Tip</div>
                <div className={styles.stepTipTitle}>
                  쉽고 간단하게,<br />ODO 서비스를 신청해보세요!
                </div>
              </div>

              {/* 2컬럼 그리드 */}
              <div className={styles.stepGrid}>
                {/* 왼쪽: 스텝 카드 3개 */}
                <div className={styles.stepLeftCol}>
                  <div className={styles.stepCard}>
                    <div className={styles.stepNo}>STEP 1</div>
                    <div className={styles.stepCardBody}>
                      <img src="/images/youtubemusic.png" alt="YouTube Music" className={styles.stepCardImg} />
                      <div className={styles.stepCardText}>
                        <div className={styles.stepTitle}>YouTube Music 준비</div>
                        <p className={styles.stepNote}>※ 유튜브 뮤직 구독이 필요함</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.stepCard}>
                    <div className={styles.stepNo}>STEP 2</div>
                    <div className={styles.stepCardBody}>
                      <img src="/images/lastfmclay.png" alt="Last.fm 연동" className={styles.stepCardImg} />
                      <div className={styles.stepTitle}>최초 1회 설정 (Last.fm 연동)</div>
                    </div>
                  </div>

                  <div className={styles.stepCard}>
                    <div className={styles.stepNo}>STEP 3</div>
                    <div className={styles.stepCardBody}>
                      <img src="/images/playlistclay.png" alt="플레이리스트 재생" className={styles.stepCardImg} />
                      <div className={styles.stepTitle}>플레이리스트 재생</div>
                    </div>
                  </div>
                </div>

                {/* 오른쪽: 이미지 */}
                <div className={styles.stepRightCard}>
                  <img
                    src="/images/mockup.png"
                    alt="매장 음악 사용 예시"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                  />
                </div>
              </div>

              {/* 안내 링크 */}
              <div className={styles.stepCtaRow}>
                <Link className={styles.faqBtn} href="/howto">
                  자세한 설정 안내 보기
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className={styles.faqSection} aria-label="자주 묻는 질문">
            <div className={styles.faqInner}>
              <h2 className={styles.faqTitle}>자주 묻는 질문</h2>

              <div className={styles.faqList}>
                <article className={styles.faqCard}>
                  <div className={styles.faqQRow}>
                    <span className={styles.faqQ}>Q.</span>
                    <h3 className={styles.faqQText}>음악을 틀면 비용이 더 발생하나요?</h3>
                  </div>
                  <p className={styles.faqAText}>
                    아니요. 추가 비용 없이, 재생된 만큼 정산금을 받습니다.
                  </p>
                </article>

                <article className={styles.faqCard}>
                  <div className={styles.faqQRow}>
                    <span className={styles.faqQ}>Q.</span>
                    <h3 className={styles.faqQText}>정말 저작권 문제가 생기지 않나요?</h3>
                  </div>
                  <p className={styles.faqAText}>ODO의 모든 음원은 자체 제작된 AI 음악으로 저작권 문제가 해결되어 있습니다. 매장에서 안심하고 재생하실 수 있습니다.</p>
                </article>

                <article className={styles.faqCard}>
                  <div className={styles.faqQRow}>
                    <span className={styles.faqQ}>Q.</span>
                    <h3 className={styles.faqQText}>얼마나 포인트를 받을 수 있나요?</h3>
                  </div>
                  <p className={styles.faqAText}>
                    재생 시간과 재생 횟수에 따라 포인트가 적립됩니다. 적립된 포인트는 상품·기프티콘으로 교환하실 수 있으며, 세부 비율은 이지샵 내 마이페이지에서 확인하실 수 있습니다.
                  </p>
                </article>

                <article className={styles.faqCard}>
                  <div className={styles.faqQRow}>
                    <span className={styles.faqQ}>Q.</span>
                    <h3 className={styles.faqQText}>설정이 어렵지 않나요?</h3>
                  </div>
                  <p className={styles.faqAText}>
                    처음 한 번만 크롬 확장 프로그램을 설치하면 이후에는 별도 조작 없이 자동으로 작동합니다. 설치 시간은 5분 이내입니다.
                  </p>
                </article>
              </div>

              <div className={styles.faqCtaRow}>
                <Link className={styles.faqBtn} href="/howto">
                  FAQ 더 보기
                </Link>
              </div>
            </div>
          </section>

          {/* CTA 카드 섹션 */}
          <section className={styles.ctaCardSection}>
            <div className={styles.ctaCardOuter}>
              <h2 className={styles.ctaHeading}>
                YouTube Music 구독 여부에 따라<br />
                바로 시작할 수 있습니다
              </h2>

              <div className={styles.ctaCardGrid}>
                {/* 카드 1: 미회원 */}
                <div className={`${styles.ctaCard} ${styles.ctaCardYellow}`}>
                  <div className={styles.ctaCardTop}>
                    <img src="/images/clayman1.png" alt="" className={styles.ctaCardImg} />
                    <div className={styles.ctaCardQuote}>
                      <span className={styles.ctaCardQuoteMark}>❝</span>
                      <p className={styles.ctaCardText}>아직 유튜브 뮤직<br />이용 중이 아니에요</p>
                      <span className={styles.ctaCardQuoteMarkClose}>❞</span>
                    </div>
                  </div>
                  <a
                    className={styles.ctaCardBtnYellow}
                    href="https://music.youtube.com/playlist?list=PLcuymYOCldOyXhX1wrDoMbztUnAeu1spl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    유튜브 뮤직 가입하러 가기
                  </a>
                  <p className={styles.ctaCardSub}></p>
                </div>

                {/* 카드 2: 기회원 */}
                <div className={`${styles.ctaCard} ${styles.ctaCardGreen}`}>
                  <div className={styles.ctaCardTop}>
                    <img src="/images/clayman2.png" alt="" className={styles.ctaCardImg} />
                    <div className={styles.ctaCardQuote}>
                      <span className={styles.ctaCardQuoteMark}>❝</span>
                      <p className={styles.ctaCardText}>이미 유튜브 뮤직<br />회원이에요</p>
                      <span className={styles.ctaCardQuoteMarkClose}>❞</span>
                    </div>
                  </div>
                  <Link
                    className={styles.ctaCardBtnGreen}
                    href="/login?source=easyshop"
                  >
                    ODO 시작하기
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
