"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect} from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, role, adminScope, loading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loading) return;
    if (pathname === "/admin/login") return;
    if (role === "franchise_admin") {
      const allowed = pathname.startsWith("/admin/franchise/") || pathname.startsWith("/admin/dashboard/");
      if (!allowed) {
        router.replace(`/admin/franchise/${adminScope}`);
      }
    }
  }, [role, adminScope, loading, mounted, pathname, router]);

  // 마운트 전이거나 auth 로딩 중이면 로딩 화면 출력 (권한 확인 전 페이지 노출 방지)
  if (!mounted || (loading && pathname !== "/admin/login")) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#1f2937',
        color: 'white'
      }}>
        Loading...
      </div>
    );
  }
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#111827" }}>
        {children}
      </div>
    );
  }

  // 권한 없는 페이지 접근 시 children 렌더링 자체를 차단
  const franchiseAdminAllowed = pathname.startsWith("/admin/franchise/") || pathname.startsWith("/admin/dashboard/");
  if (role === "franchise_admin" && !franchiseAdminAllowed) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1f2937', color: 'white' }}>
        Loading...
      </div>
    );
  }
  
  const allMenuItems = [
    { name: "매장 통계", href: "/admin/dashboard", icon: "📊", adminOnly: true },
    { name: "데이터 검증", href: "/admin/validator", icon: "🚨", adminOnly: true },
    { name: "프랜차이즈 통계", href: "/admin/franchise", icon: "🏪", adminOnly: true },
    { name: "환경설정", href: "/admin/settings", icon: "⚙️", adminOnly: true },
  ];
  const franchiseAdminMenu = adminScope
    ? [{ name: "매장 현황", href: `/admin/franchise/${adminScope}`, icon: "🏪", adminOnly: false }]
    : [];
  const menuItems = role === "franchise_admin" ? franchiseAdminMenu : allMenuItems;

  return (
    <div className="admin-container">
      <aside className={`admin-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <h1 className="logo-text" onClick={() => {
              router.push(role === "franchise_admin" ? `/admin/franchise/${adminScope}` : '/admin/dashboard');
              setMobileMenuOpen(false);
            }} style={{ cursor: 'pointer' }}>ODO Admin
          </h1>
          <button 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`nav-link ${isActive ? "active" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button 
            onClick={() => router.push('/')} 
            className="exit-btn"
          >
            서비스 메인으로
          </button>
          <div className="logout-area">
            <button onClick={logout} className="logout-btn">
              로그아웃
            </button>
          </div>
        </div>
      </aside>
       
      {/* ⬜️ 메인 콘텐츠 */}
      <main className="admin-content">
        <div className="mobile-top-bar">
          <button className="mobile-toggle-btn" onClick={() => setMobileMenuOpen(true)}>☰</button>
          <span style={{ fontWeight: 'bold' }}>ODO Admin</span>
          <div style={{ width: 24 }}></div>
        </div>
        <div className="content-inner">
          {children}
        </div>
      </main>

      <style jsx>{`
      
  .admin-container {
  display: flex;
  min-height: 100vh;
  /* 아이폰 하단 홈 바 영역만큼 패딩 추가 */
  padding-bottom: env(safe-area-inset-bottom);
  background-color: #f9fafb;
}

.admin-sidebar {
  width: 260px;
  background-color: #1f2937;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 2000;
  
  /* ✅ 아이폰 상단 노치 대응 */
  padding-top: env(safe-area-inset-top);
  /* ✅ 아이폰 하단 홈바 대응 */
  padding-bottom: env(safe-area-inset-bottom);
  
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

  .sidebar-header {
    padding: 24px;
    border-bottom: 1px solid #374151;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo-text { font-size: 20px; font-weight: bold; margin: 0; color: #f3f4f6; }
  .sidebar-nav { flex: 1; padding: 20px 10px; overflow-y: auto; }
  .sidebar-nav ul { list-style: none; padding: 0; margin: 0; }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px; /* 모바일 터치를 위해 높이 증가 */
    border-radius: 8px;
    font-size: 15px;
    color: #9ca3af;
    text-decoration: none;
    transition: all 0.2s;
  }

  .nav-link.active { color: #60a5fa; background-color: rgba(59, 130, 246, 0.1); font-weight: bold; }

  .sidebar-footer { padding: 20px; border-top: 1px solid #374151; display: flex; flex-direction: column; gap: 10px; }
  .exit-btn { width: 100%; padding: 12px; background-color: #374151; border: 1px solid #4b5563; border-radius: 8px; color: white; cursor: pointer; }
  .logout-btn { width: 100%; padding: 10px; background: transparent; border: none; color: #9ca3af; cursor: pointer; text-decoration: underline; }

  .admin-content {
  flex: 1;
  margin-left: 260px;
  min-height: 100vh;
  background-color: #f9fafb;
  /* ✅ 하단 바에 가려지지 않게 여백 추가 */
  padding-bottom: env(safe-area-inset-bottom);
}
  .content-inner { padding: 24px; flex: 1; }
  .mobile-top-bar { display: none; }

  /* 📱 모바일 최적화 핵심 스타일 */
  @media (max-width: 768px) {

    .admin-content {
      margin-left: 0; /* 모바일에서는 여백 제거 */
    }

    .mobile-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    /* ✅ 노치 영역만큼 높이 확보 */
    height: calc(60px + env(safe-area-inset-top));
    padding-top: env(safe-area-inset-top);
    
    background-color: #1f2937;
    color: white;
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .admin-sidebar {
    width: 100%; /* 모바일에서는 가득 차게 설정하는 것이 더 깔끔할 수 있습니다 */
    transform: ${mobileMenuOpen ? "translateX(0)" : "translateX(-100%)"};
  }

    .mobile-toggle-btn {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
    }

    /* 메뉴가 열렸을 때 배경을 어둡게 차단하는 가상 요소 (선택 사항) */
    .admin-container::after {
      content: "";
      display: ${mobileMenuOpen ? "block" : "none"};
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1500;
    }
  }
    @media screen and (max-width: 768px) {
    input, select, textarea, button {
      font-size: 16px !important; 
    }
  }
      `
      }</style>
    </div>
  );
}

<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></meta>