"use client";

import { useState, useEffect, Suspense } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function AgreeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get("source");

  const [user, setUser] = useState<any>(null);
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else {
        alert("로그인 정보가 없습니다. 로그인 페이지로 이동합니다.");
        router.push("/login");
      }
    });
    return () => unsub();
  }, [router]);

  const allChecked = terms && privacy && marketing;

  const handleAll = (v: boolean) => {
    setTerms(v);
    setPrivacy(v);
    setMarketing(v);
  };

  const canProceed = terms && privacy;

  const handleSubmit = () => {
    const url = source
      ? `/signup?source=${encodeURIComponent(source)}&marketing=${marketing}`
      : `/signup?marketing=${marketing}`;
    router.push(url);
  };

  if (!user) {
    return <div style={{ padding: 50, textAlign: "center", color: "white" }}>로딩 중...</div>;
  }

  return (
    <div style={{
      minHeight: "calc(100vh - 200px)", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
    }}>
      <div style={{
        maxWidth: 420, width: "90%", padding: "36px 30px",
        background: "#1f2937", borderRadius: 16, color: "white",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
      }}>
        <h1 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 6, textAlign: "center" }}>
          서비스 이용 약관 동의
        </h1>
        <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 28, textAlign: "center" }}>
          서비스 이용을 위해 아래 약관에 동의해 주세요.
        </p>

        {/* 전체 동의 */}
        <label style={allRowStyle}>
          <input
            type="checkbox"
            checked={allChecked}
            onChange={(e) => handleAll(e.target.checked)}
            style={checkboxStyle}
          />
          <span style={{ fontWeight: "bold", fontSize: 15, color: "#fff" }}>전체 동의</span>
        </label>

        <hr style={{ border: "none", borderTop: "1px solid #374151", margin: "14px 0" }} />

        {/* 이용약관 */}
        <label style={rowStyle}>
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            style={checkboxStyle}
          />
          <span style={labelTextStyle}>
            <span style={requiredBadge}>[필수]</span> 이용약관 동의
          </span>
          <Link href="/terms" target="_blank" style={linkStyle}>내용보기</Link>
        </label>

        {/* 개인정보 처리방침 */}
        <label style={rowStyle}>
          <input
            type="checkbox"
            checked={privacy}
            onChange={(e) => setPrivacy(e.target.checked)}
            style={checkboxStyle}
          />
          <span style={labelTextStyle}>
            <span style={requiredBadge}>[필수]</span> 개인정보 처리방침 동의
          </span>
          <Link href="/privacy" target="_blank" style={linkStyle}>내용보기</Link>
        </label>

        {/* 마케팅 */}
        <label style={rowStyle}>
          <input
            type="checkbox"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
            style={checkboxStyle}
          />
          <span style={{ ...labelTextStyle, flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={optionalBadge}>[선택]</span> 마케팅 정보 수신 동의
            </span>
            <span style={{ fontSize: 11, color: "#4b5563" }}>이벤트·프로모션 안내</span>
          </span>
        </label>

        <button
          onClick={handleSubmit}
          disabled={!canProceed}
          style={{
            marginTop: 28, width: "100%", padding: "13px",
            border: "none", borderRadius: 8, fontWeight: "bold", fontSize: 15,
            cursor: canProceed ? "pointer" : "not-allowed",
            background: canProceed ? "#3b82f6" : "#374151",
            color: canProceed ? "white" : "#6b7280",
            transition: "background 0.2s",
          }}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default function AgreePage() {
  return (
    <Suspense>
      <AgreeContent />
    </Suspense>
  );
}

const allRowStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
  padding: "6px 0",
};

const rowStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
  padding: "10px 0", borderBottom: "1px solid #2d3748",
};

const checkboxStyle: React.CSSProperties = {
  width: 18, height: 18, accentColor: "#3b82f6", cursor: "pointer", flexShrink: 0,
};

const labelTextStyle: React.CSSProperties = {
  flex: 1, fontSize: 14, color: "#d1d5db", display: "flex", alignItems: "center", gap: 5,
};

const requiredBadge: React.CSSProperties = {
  color: "#3b82f6", fontWeight: "bold", fontSize: 12,
};

const optionalBadge: React.CSSProperties = {
  color: "#6b7280", fontWeight: "bold", fontSize: 12,
};

const linkStyle: React.CSSProperties = {
  fontSize: 12, color: "#6b7280", textDecoration: "underline", whiteSpace: "nowrap",
};
