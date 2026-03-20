// app/landing/easyshop/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "ODO | Easyshop",
  description: "이지샵 사업자를 위한 매장 음악 혜택 서비스",
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
          <div className={styles.pillStage}>
            <span className={`${styles.pillsm} ${styles.p1}`}>매장 전용</span>
            <span className={`${styles.pillsm} ${styles.p2}`}>광고 없음</span>
            <span className={`${styles.pillsm} ${styles.p3}`}>저작권 클리어</span>
          </div>
            {/* 혜택 Pills */}
            <div className={styles.benefitWrap}>
              <div className={styles.benefitGrid}>
                <div className={styles.benefitLeft}>
                  <PillBox>월 최대 3만원 상당 혜택</PillBox>
                </div>
                <div className={styles.benefitRight}>
                  <PillBox>추가 비용 없음</PillBox>
                </div>
              </div>

              <div className={styles.spacer} />

              <div className={styles.closing}>음악은 틀지만, 남는 건 없었습니다</div>

                {/* 4칸 그리드 */}
                <div className={styles.featureGridSection}>
                  <div className={styles.featureGridWrapper}>
                    <div className={styles.featureGrid}>
                      <div className={styles.featureCell}>
                        <span className={styles.featureCellNum}>1</span>
                        <p className={styles.featureCellTitle}>매장에서 틀어도 저작권 문제 없는 음악만 제공합니다.</p>
                        <p className={styles.featureCellDesc}>※ ODO 음원으로만 구성되어 있습니다.</p>
                      </div>
                      <div className={styles.featureCell}>
                        <span className={styles.featureCellNum}>2</span>
                        <p className={styles.featureCellTitle}>매장 분위기에 맞는 플레이리스트를 바로 골라 재생할 수 있습니다.</p>
                      </div>
                      <div className={styles.featureCell}>
                        <span className={styles.featureCellNum}>3</span>
                        <p className={styles.featureCellTitle}>매장에서 음악을 재생한 만큼 정산금을 지급받습니다.</p>
                      </div>
                      <div className={styles.featureCell}>
                        <span className={styles.featureCellNum}>4</span>
                        <p className={styles.featureCellTitle}>처음 한 번만 설정하고 이후에는 플레이리스트만 재생하세요.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </section>

          {/* YouTube 섹션 */}
          <section className={styles.heroSection} id="hero">
            <div className={styles.closing}>이런 음악이 매장에서 재생됩니다</div>
            <div className={styles.statementStage}>
              <div className={styles.ytEmbed}>
                <div className={styles.ytRatio}>
                  <iframe
                    src="https://www.youtube.com/embed/ntVJYQtyQ0s?rel=0"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </section>



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
                    <div className={styles.stepTitle}>YouTube Music 준비</div>
                    
                  </div>

                  <div className={styles.stepCard}>
                    <div className={styles.stepNo}>STEP 2</div>
                    <div className={styles.stepTitle}>최초 1회 설정 (Last.fm 연동)</div>
                  </div>

                  <div className={styles.stepCard}>
                    <div className={styles.stepNo}>STEP 3</div>
                    <div className={styles.stepTitle}>플레이리스트 재생</div>
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
                    <h3 className={styles.faqQText}>얼마나 받을 수 있나요?</h3>
                  </div>
                  <p className={styles.faqAText}>월 최대 약 3만원 수준입니다.</p>
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
              <span className={styles.ctaCardPill}>지금 어떤 상황이세요?</span>
              <div className={styles.ctaCardGrid}>
                {/* 카드 1: 미해당 */}
                <div className={styles.ctaCard}>
                  <span className={styles.ctaCardEmoji}>🛒</span>
                  <p className={styles.ctaCardText}>"아직 이지샵 회원이 아니에요"</p>
                  <a
                    className={styles.ctaCardBtnYellow}
                    href="https://www.easyshop.co.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    이지샵 가입하러 가기
                  </a>
                  <p className={styles.ctaCardSub}>* 이지샵 가입 후 ODO 신청까지 5분이면 충분해요</p>
                  <p className={styles.ctaCardSub}>* 이지샵 회원은 ODO를 무료로 이용할 수 있어요</p>
                </div>

                {/* 카드 2: 해당 */}
                <div className={styles.ctaCard}>
                  <span className={styles.ctaCardEmoji}>🎵</span>
                  <p className={styles.ctaCardText}>"이미 이지샵 회원이에요"</p>
                  <a
                    className={styles.ctaCardBtnGreen}
                    href="https://docs.google.com/forms/d/e/1FAIpQLSf0yLS-x-d6LwdpYxA4G2k3V6xDYsAQR_rU13lNxZSwybKD6g/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ODO 무료로 시작하기
                  </a>
                </div>
              </div>
            </div>
          </section>

          <div className={styles.statementStage}>
            <div className={styles.statementInner}>
              <h2 className={styles.h2}>
                매장 음악을
                <br />
                불편 없이 정리하고
                <br />
                틀어준 만큼 돌려받으세요
              </h2>
            </div>
          </div>

          <div id="cta" style={{ height: 1 }} />
          <div className={styles.applyCtaRow}>
            <a
              className={styles.applyBtn}
              href="https://docs.google.com/forms/d/e/1FAIpQLSf0yLS-x-d6LwdpYxA4G2k3V6xDYsAQR_rU13lNxZSwybKD6g/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >
              ODO 무료로 시작하기
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
