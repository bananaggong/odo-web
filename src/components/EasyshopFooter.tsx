// src/components/EasyshopFooter.tsx
import Link from "next/link";
import styles from "./EasyshopFooter.module.css";

export default function EasyshopFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* 상단: 로고 + 링크 */}
        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.brandEs}>이지샵</span>
            <span className={styles.brandSep}>×</span>
            <span className={styles.brandOdo}>ODO</span>
          </div>

          <div className={styles.links}>
            <Link href="/terms">이용약관</Link>
            <span className={styles.div}>|</span>
            <Link href="/privacy">개인정보처리방침</Link>
            <span className={styles.div}>|</span>
            <Link href="/howto">서비스 이용안내</Link>
            <span className={styles.div}>|</span>
            <a href="mailto:contact@grapes.my">고객센터</a>
            <span className={styles.div}>|</span>
            <a href="https://pf.kakao.com/_xeuxjxjn/chat" target="_blank" rel="noopener noreferrer">카카오톡 문의</a>
          </div>
        </div>

        {/* 구분선 */}
        <div className={styles.divider} />

        {/* 회사 정보 */}
        <div className={styles.info}>
          <p>(주)그레이프스 · 대표이사 홍영주 · 사업자등록번호 387-81-03198</p>
          <p>주소: 서울시 광진구 천호대로 579 502 · 전화: 070-8983-2616 · 이메일: contact@grapes.my</p>
        </div>

        {/* 서비스 고지 */}
        <div className={styles.notice}>
          <p>
            본 서비스는 AI 생성 음원 큐레이션 정보를 제공하며, 재생은 YouTube Music을 통해 이루어집니다.
            Copyright © GRAPES. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
