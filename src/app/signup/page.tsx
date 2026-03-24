"use client";

import { useState, useEffect, Suspense } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import Script from "next/script";

/**
 * Last.fm 유저가 실제로 존재하는지 검증하는 함수
 */
async function verifyLastFmUser(username: string): Promise<boolean> {
  const cleanUsername = username.trim();
  if (!cleanUsername || cleanUsername === ";" || cleanUsername === "*") {
    return false;
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_LASTFM_API_KEY; 
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${cleanUsername}&api_key=${apiKey}&format=json`;

    const response = await axios.get(url);
    if (response.data.error) {
      return false;
    }
    return true; 
  } catch (error) {
    return false;
  }
}

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get("source");

  const [googleUser, setGoogleUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    id: "",           
    storeName: "",
    ownerName: ""
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 [추가된 부분 2] 환경변수에서 사이트 키 가져오기
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setGoogleUser(user);
        console.log("현재 로그인된 사용자:", user.email);
      } else {
        alert("로그인 정보가 없습니다. 로그인 페이지로 이동합니다.");
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleUser) return;

    setLoading(true);
    setError("");

    try {
      // 🔥 [추가된 부분 3] 폼 제출 시 가장 먼저 reCAPTCHA 토큰을 발급받고 백엔드에 검사 맡기기
      if (siteKey) {
        try {
          // @ts-ignore - TypeScript 에러 방지용
          const token = await window.grecaptcha.enterprise.execute(siteKey, { action: 'signup' });
          
          // 백엔드 검증 API 호출 (봇이면 여기서 에러가 발생하여 catch로 넘어감)
          await axios.post('/api/verify-recaptcha', { token });
        } catch (recaptchaError) {
          console.error("reCAPTCHA 에러:", recaptchaError);
          setError("비정상적인 접근(매크로/봇)이 감지되어 가입이 차단되었습니다.");
          setLoading(false);
          return; // 봇 판정 시 즉시 함수 종료 (DB 저장 차단)
        }
      }

      // 1. Last.fm에 실제로 존재하는 아이디인지 검증 (기존 로직 유지)
      const docId = formData.id.trim();
      const isValidLastFmUser = await verifyLastFmUser(docId);
      
      if (!isValidLastFmUser) {
        setError("존재하지 않는 Last.fm 아이디입니다. 대소문자와 오타를 확인해주세요!");
        setLoading(false);
        return; 
      }

      // 🚨 2. 이미 등록된 Last.fm 아이디인지 체크 (서버 API를 통한 안전한 중복 방지)
      // 프론트엔드에서 getDoc을 쓰지 않고, 내 UID(googleUser.uid)를 들고 안전하게 서버에 물어봅니다.
      const checkResponse = await axios.get(`/api/check-lastfm-id?id=${encodeURIComponent(docId)}&myUid=${googleUser.uid}`);
      const checkData = checkResponse.data;

      if (checkData.exists && checkData.isDuplicate) {
        setError("이미 다른 사용자가 등록한 Last.fm 아이디입니다.");
        setLoading(false);
        return;
      }

      // 3. Firestore DB에 매장 정보 저장
      await setDoc(doc(db, "monitored_users", docId), {
        uid: googleUser.uid,
        email: googleUser.email,
        lastfm_username: docId,
        store_name: formData.storeName,
        owner_name: formData.ownerName,
        role: "user",
        active: true,
        created_at: new Date().toISOString(),
        franchise: source || "personal",
        source: source || null,
      }, { merge: true });

      alert("매장 정보 등록이 완료되었습니다! 마이페이지로 이동합니다.");
      router.push("/mypage");

    } catch (err: any) {
      console.error("등록 에러:", err);
      setError("정보 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!googleUser) {
    return <div style={{ padding: 50, textAlign: "center", color: "white" }}>로딩 중...</div>;
  }

  // 🔥 [추가된 부분 4] 최상단에 Script를 넣기 위해 전체를 빈 태그(<>)로 감싸줍니다.
  return (
    <>
      {/* 구글 reCAPTCHA 스크립트 로드 */}
      {siteKey && (
        <Script 
          src={`https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`} 
        />
      )}

      <div style={{ maxWidth: "400px", margin: "50px auto", padding: "30px", background: "#1f2937", borderRadius: "12px", color: "white" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px", textAlign: "center" }}>
          추가 정보 입력
        </h1>
        <p style={{ textAlign: "center", color: "#9ca3af", marginBottom: "30px", fontSize: "14px" }}>
          안녕하세요, <span style={{color:"#fff", fontWeight:"bold"}}>{googleUser.displayName || "점주"}</span>님!<br/>
          서비스 이용을 위해 매장 정보를 입력해주세요.
        </p>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          
          {/* 아이디 */}
          <div>
            <label style={{display:"block", marginBottom:"5px", fontSize:"14px", color:"#9ca3af"}}>Last.fm 아이디 <span style={{color:"#ef4444"}}>*</span></label>
            <input 
              type="text" 
              placeholder="예: lastfm_username" 
              value={formData.id}
              onChange={(e) => setFormData({...formData, id: e.target.value})}
              required
              style={inputStyle}
            />
            <p style={{fontSize:"11px", color:"#6b7280", marginTop:"4px"}}>* 실제 사용 중인 Last.fm 계정 아이디를 입력하세요.</p>
          </div>

          {/* 매장명 */}
          <div>
            <label style={{display:"block", marginBottom:"5px", fontSize:"14px", color:"#9ca3af"}}>매장명</label>
            <input 
              type="text" 
              placeholder="예: ㅇㅇ ㅇㅇ점" 
              value={formData.storeName}
              onChange={(e) => setFormData({...formData, storeName: e.target.value})}
              required
              style={inputStyle}
            />
          </div>

          {/* 점주명 */}
          <div>
            <label style={{display:"block", marginBottom:"5px", fontSize:"14px", color:"#9ca3af"}}>점주명</label>
            <input 
              type="text" 
              placeholder="예: 홍길동" 
              value={formData.ownerName}
              onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
              required
              style={inputStyle}
            />
          </div>

          {/* 이메일 (읽기 전용) */}
          <div>
             <label style={{display:"block", marginBottom:"5px", fontSize:"14px", color:"#9ca3af"}}>연동된 이메일</label>
             <input 
               type="text" 
               value={googleUser.email || ""} 
               disabled 
               style={{...inputStyle, background: "#333", color: "#888", cursor: "not-allowed"}} 
             />
          </div>

          {error && <div style={{ color: "#ef4444", fontSize: "14px", textAlign: "center", background: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "6px" }}>{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            style={{ ...buttonStyle, background: loading ? "#6b7280" : "#3b82f6" }}
          >
            {/* 🔥 [추가된 부분 5] 버튼 텍스트 변경 */}
            {loading ? "보안 검사 및 저장 중..." : "정보 등록 완료"}
          </button>
        </form>
      </div>
    </>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpContent />
    </Suspense>
  );
}

const inputStyle = {
  width: "100%", padding: "12px", background: "#374151", border: "1px solid #4b5563", borderRadius: "6px", color: "white", outline: "none", fontSize: "15px"
};

const buttonStyle = {
  width: "100%", padding: "12px", border: "none", borderRadius: "6px", color: "white", fontWeight: "bold", fontSize: "15px", cursor: "pointer", transition: "opacity 0.2s"
};