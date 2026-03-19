"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./EasyshopHeader.module.css";

export default function EasyshopHeader() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY || 0;
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const diff = currentY - lastYRef.current;
          setScrolled(currentY > 10);
          if (currentY < 12) {
            setHidden(false);
          } else if (Math.abs(diff) > 8) {
            setHidden(diff > 0);
            if (diff > 0) setOpen(false);
          }
          lastYRef.current = currentY;
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.headerWrap} ${hidden ? styles.headerHidden : ""} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.headerBar}>
        <div className={styles.inner}>
          {/* 로고 */}
          <Link className={styles.brand} href="/landing/easyshop">
            <span className={styles.brandEs}>이지샵</span>
            <span className={styles.brandSep}>×</span>
            <span className={styles.brandOdo}>ODO</span>
          </Link>

          {/* PC 네비 */}
          <nav className={styles.nav}>
            <a href="#howto">서비스 소개</a>
            <a href="#hero">음원 체험</a>
            <Link href="/howto">이용 방법 / FAQ</Link>
          </nav>

          {/* 우측 CTA */}
          <div className={styles.right}>
            <a
              className={styles.ctaBtn}
              href="https://docs.google.com/forms/d/e/1FAIpQLSf0yLS-x-d6LwdpYxA4G2k3V6xDYsAQR_rU13lNxZSwybKD6g/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >
              무료로 시작하기
            </a>

            <button
              className={styles.hamburger}
              onClick={() => setOpen(!open)}
              aria-label="메뉴 열기"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 패널 */}
      {open && (
        <>
          <div className={styles.mobileDim} onClick={() => setOpen(false)} />
          <div className={styles.mobilePanel}>
            <a href="#howto" onClick={() => setOpen(false)}>서비스 소개</a>
            <a href="#hero" onClick={() => setOpen(false)}>음원 체험</a>
            <Link href="/howto" onClick={() => setOpen(false)}>이용 방법 / FAQ</Link>
            <hr className={styles.mobileDivider} />
            <a
              className={styles.mobileCta}
              href="https://docs.google.com/forms/d/e/1FAIpQLSf0yLS-x-d6LwdpYxA4G2k3V6xDYsAQR_rU13lNxZSwybKD6g/viewform"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              무료로 시작하기
            </a>
          </div>
        </>
      )}
    </header>
  );
}
