"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MainLayout from "@/components/MainLayout";
import EasyshopHeader from "@/components/EasyshopHeader";
import EasyshopFooter from "@/components/EasyshopFooter";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAdmin = pathname?.startsWith("/admin");
  const isEasyshop = pathname === "/landing/easyshop";
  const isEasyshop2 = pathname === "/landing/easyshop2";

  if (isAdmin) {
    return <>{children}</>;
  }

  if (isEasyshop || isEasyshop2) {
    return (
      <>
        <EasyshopHeader />
        {/* 헤더 높이(73px)만큼 본문 밀기 */}
        <div style={{ paddingTop: "73px" }}>
          {children}
        </div>
        <EasyshopFooter />
        {/* 이지샵 톤 플로팅 버튼 (초록) */}
        <a
          href="https://pf.kakao.com/_xeuxjxjn/chat"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "56px",
            height: "56px",
            backgroundColor: "#39A628",
            color: "white",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(57,166,40,0.4)",
            zIndex: 9999,
            textDecoration: "none",
            cursor: "pointer",
          }}
          aria-label="고객센터 문의하기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "28px", height: "28px" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
          </svg>
        </a>
      </>
    );
  }

  // 일반 유저는 기존 레이아웃 유지
  return (
    <>
      <SiteHeader />
      <MainLayout>
        {children}
      </MainLayout>
      <SiteFooter />
      {/* 플로팅 고객센터 버튼 */}
      <a
        href="https://pf.kakao.com/_xeuxjxjn/chat"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          backgroundColor: "#2563EB",
          color: "white",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          zIndex: 9999,
          textDecoration: "none",
          cursor: "pointer",
        }}
        aria-label="고객센터 문의하기"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "28px", height: "28px" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
        </svg>
      </a>
    </>
  );
}