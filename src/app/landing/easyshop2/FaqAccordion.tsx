"use client";

import { useState } from "react";
import styles from "./page.module.css";

const FAQS = [
  {
    q: "음악을 틀면 비용이 더 발생하나요?",
    a: "아니요. 추가 비용 없이, 재생된 만큼 정산금을 받습니다.",
  },
  {
    q: "얼마나 받을 수 있나요?",
    a: "월 최대 약 3만원 수준입니다. 재생 시간과 조건에 따라 달라질 수 있습니다.",
  },
  {
    q: "어떤 음악이 재생되나요?",
    a: "AI가 큐레이션한 매장 전용 음원입니다. 광고 없이 저작권이 클리어된 음악으로 구성되어 있습니다.",
  },
  {
    q: "이지샵 회원이 아니어도 이용 가능한가요?",
    a: "현재 이지샵 파트너 사업자에 한해 제공되는 전용 혜택입니다.",
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={styles.faqList}>
      {FAQS.map((item, i) => (
        <div
          key={i}
          className={[
            styles.faqItem,
            i === 0 ? styles.faqFirst : "",
            i === FAQS.length - 1 ? styles.faqLast : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <button
            className={styles.faqQRow}
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className={styles.faqQText}>{item.q}</span>
            <span className={styles.faqToggle} aria-hidden="true">
              {open === i ? "−" : "+"}
            </span>
          </button>
          {open === i && <p className={styles.faqAText}>{item.a}</p>}
        </div>
      ))}
    </div>
  );
}
