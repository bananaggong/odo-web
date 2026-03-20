"use client";

import { useState } from "react";
import styles from "./YouTubeSection.module.css";

const GENRES = [
  { label: "카페",     url: "https://www.youtube.com/embed/ntVJYQtyQ0s" },
  { label: "헬스장",   url: "https://www.youtube.com/embed/0BaVbhGVAHU" },
  { label: "옷가게",   url: "https://www.youtube.com/embed/7Oa0vSUNVoM" },
  { label: "무인매장", url: "https://www.youtube.com/embed/tKkOjC4vrMo" },
  { label: "미용실",   url: "https://www.youtube.com/embed/97NezhZ9uzs" },
];

export default function YouTubeSection() {
  const [activeUrl, setActiveUrl] = useState(GENRES[0].url);

  return (
    <section className={styles.section} id="hero">
      <div className={styles.container}>
        {/* 좌: 영상 */}
        <div className={styles.videoPanel}>
          <div className={styles.ytRatio}>
            <iframe
              key={activeUrl}
              src={`${activeUrl}?rel=0&autoplay=1`}
              title="ODO Playlist Preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {/* 우: 텍스트 + 장르 버튼 */}
        <div className={styles.infoPanel}>
          <div>
            <span className={styles.badge}>ODO Playlist Preview</span>
            <h2 className={styles.heading}>
              이런 음악이<br />매장에서 재생됩니다
            </h2>
            <p className={styles.desc}>
              카페·식당·헬스장 등 어떤 공간에도 어울리는 플레이리스트를 미리 들어보세요.
            </p>
          </div>

          <div className={styles.genreRow}>
            {GENRES.map((g) => (
              <button
                key={g.url}
                className={`${styles.genreBtn} ${activeUrl === g.url ? styles.genreBtnActive : ""}`}
                onClick={() => setActiveUrl(g.url)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
