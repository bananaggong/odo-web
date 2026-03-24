"use client";

import { useState, useEffect, Suspense } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // ✅ AuthContext에서 유저 정보와 로딩 상태를 가져옵니다.
  const { user, role, loading } = useAuth();

  // ✅ 유저 상태(role)가 변할 때마다 감지해서 알맞은 페이지로 이동시킵니다.
  useEffect(() => {
    // 아직 DB 확인 중이면 가만히 기다립니다.
    if (loading) return; 

    // 로그인 완료 및 DB 확인이 끝난 상태
    if (user && isLoggingIn) {
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "user") {
        router.push("/mypage");
      } else if (role === null) {
        // 관리자도 아니고 매장 데이터도 없음 -> 신규 회원!
        if (confirm("등록된 매장 정보가 없습니다.\n회원가입 페이지로 이동하여 추가 정보를 입력하시겠습니까?")) {
          const signupUrl = source ? `/agree?source=${encodeURIComponent(source)}` : "/agree";
          router.push(signupUrl);
        } else {
          signOut(auth);
          setIsLoggingIn(false);
        }
      }
    }
  }, [user, role, loading, isLoggingIn, router]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      // 여기서 로그인만 시킵니다. DB 조회는 AuthContext가 알아서 합니다!
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("구글 로그인 실패:", err);
      setError("로그인 창이 닫혔거나 오류가 발생했습니다.");
      setIsLoggingIn(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "calc(100vh - 200px)", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center", position: "relative" 
    }}>
      <div style={{ 
        maxWidth: "400px", width: "90%", padding: "40px 30px", 
        background: "#1f2937", borderRadius: "16px", color: "white",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)", textAlign: "center"
      }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>ODO 로그인</h1>
        <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "40px" }}>
          매장 관리를 위해 로그인해 주세요.
        </p>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading || isLoggingIn}
          style={{
            width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid #d1d5db",
            background: "white", color: "#1f2937", fontSize: "15px", fontWeight: "bold",
            cursor: (loading || isLoggingIn) ? "wait" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
            transition: "background 0.2s"
          }}
        >
          {isLoggingIn ? (
             <span>🔄 로그인 처리 중...</span>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.715H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.159 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Google 계정으로 계속하기
            </>
          )}
        </button>

        {error && (
          <div style={{ marginTop: "20px", color: "#fca5a5", fontSize: "13px", background: "rgba(239,68,68,0.1)", padding: "10px", borderRadius: "6px" }}>
            {error}
          </div>
        )}
      </div>

      <div style={{ position: "absolute", bottom: "-140px", right: "40px", textAlign: "right", zIndex: 10 }}>
        <Link
          href="/admin/login"
          style={{ color: "#4b5563", fontSize: "11px", textDecoration: "none", opacity: 0.6, transition: "opacity 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
        >
          Administrator Access
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}