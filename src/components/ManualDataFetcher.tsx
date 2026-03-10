"use client";

import { useState } from "react";

// 컴포넌트 내부에서 사용할 스타일 정의
const formLabelStyle = { display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: "600", color: "#4b5563" };
const inputStyle = { flex: 1, padding: "12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "15px", outline: "none", width: "100%", boxSizing: "border-box" as const };
const primaryBtnStyle = { background: "#3b82f6", color: "white", border: "none", padding: "10px 24px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "15px", transition: "background 0.2s" };

export default function ManualDataFetcher() {
  const [username, setUsername] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleFetch = async () => {
    if (!username.trim()) return alert("Last.fm 유저 이름을 입력해주세요.");
    if (!startDate || !endDate) return alert("시작일과 종료일을 모두 선택해주세요.");
    if (new Date(startDate) > new Date(endDate)) return alert("시작일은 종료일보다 이전이어야 합니다.");

    setLoading(true);
    setResult(null);

    try {
      // 프로젝트 내부의 API 라우트를 호출합니다.
      const response = await fetch("/api/lastfm/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          startDate,
          endDate,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult({ success: true, message: data.message });
      } else {
        setResult({ success: false, message: data.message || "오류가 발생했습니다." });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setResult({ success: false, message: "서버와 통신하는 중 문제가 발생했습니다." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ color: "#444", marginBottom: "20px" }}>
        <h3>특정 유저 기간별 데이터 스크래핑</h3>
        <p style={{ fontSize: "13px", color: "#666", marginTop: "5px" }}>
          지정한 Last.fm 유저의 특정 기간 청취 기록을 강제로 스크래핑합니다.<br/>
          (기존에 저장된 데이터가 있다면 덮어쓰기되어 중복 저장되지 않습니다.)
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", background: "#f9fafb", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
        
        <div>
          <label style={formLabelStyle}>Last.fm 유저 이름</label>
          <input 
            type="text" 
            placeholder="예: username123" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={inputStyle} 
          />
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <label style={formLabelStyle}>시작일</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              style={inputStyle} 
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={formLabelStyle}>종료일</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              style={inputStyle} 
            />
          </div>
        </div>

        <button 
          onClick={handleFetch} 
          disabled={loading} 
          style={{ ...primaryBtnStyle, marginTop: "10px", background: loading ? "#9ca3af" : "#3b82f6" }}
        >
          {loading ? "데이터 수집 중... (시간이 걸릴 수 있습니다)" : "🚀 데이터 수집 시작"}
        </button>

        {result && (
          <div style={{ 
            marginTop: "10px", 
            padding: "15px", 
            borderRadius: "6px", 
            background: result.success ? "#ecfdf5" : "#fef2f2",
            color: result.success ? "#065f46" : "#991b1b",
            border: `1px solid ${result.success ? "#a7f3d0" : "#fecaca"}`,
            fontWeight: "bold",
            fontSize: "14px"
          }}>
            {result.success ? "✅ " : "❌ "} {result.message}
          </div>
        )}

      </div>
    </div>
  );
}