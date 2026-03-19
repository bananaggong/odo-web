import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import ClientLayout from "@/components/ClientLayout"; 
import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // 👈 핀치 줌(손가락 확대) 방지
  themeColor: "#1f2937", // 👈 아이폰 상단 상태바 색상 (아까 배경색과 통일)
};

export const metadata = {
  title: "ODO - 매장용 플레이리스트",
  description: "점주 운영형 플레이리스트 선택 콘솔 (Prototype)",
  openGraph: {
    title: "ODO - 매장용 플레이리스트",
    description: "점주 운영형 플레이리스트 선택 콘솔 (Prototype)",
    type: "website",
    url: "https://onedayofmusic.com/odo.png",
    images: [
      {
        url: "https://onedayofmusic.com/odo.png",
        width: 1200,
        height: 630,
        alt: "ODO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ODO - 매장용 플레이리스트",
    description: "점주 운영형 플레이리스트 선택 콘솔 (Prototype)",
    images: ["https://onedayofmusic.com/odo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 실제 사용하시는 고객센터 링크로 변경해주세요
  const customerServiceUrl = "https://your-customer-service-url.com"; 

  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          {/* 👇 여기서 ClientLayout이 "관리자냐 아니냐"를 판단해서 화면을 그려줍니다 */}
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>

      </body>
    </html>
  );
}