// 파일 경로: app/api/lastfm/scrape/route.ts
import { NextResponse } from "next/server";
import admin from "firebase-admin";
import axios from "axios";
import http from "http";
import https from "https";

// 1. Firebase Admin 초기화 (Next.js 환경에서는 중복 초기화 에러 방지가 필수입니다)
if (!admin.apps.length) {
  admin.initializeApp({
    // 환경 변수 설정 등 프로젝트에 맞는 인증 방식이 필요할 수 있습니다.
  });
}
const db = admin.firestore();

// Last.fm API 키 (Next.js 환경 변수 `.env.local`에 LASTFM_API_KEY를 설정하는 것을 권장합니다)
const LASTFM_API_KEY = process.env.LASTFM_API_KEY || "216273c8ac319bbc4e9ec633fc69199e";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const axiosInstance = axios.create({
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  timeout: 10000,
});

/**
 * 특정 사용자의 청취 기록을 가져와 Firestore에 저장하는 핵심 함수 (기존 코드 재활용)
 */
async function scrapeAndSaveUser(userId: string, from: number, to: number, targetDate: string) {
  try {
    let currentPage = 1;
    let totalPages = 1;
    let savedCount = 0;
    let skipCount = 0;
    
    const MAX_BATCH_SIZE = 450;
    let batch = db.batch();
    let currentBatchSize = 0;

    const url = "https://ws.audioscrobbler.com/2.0/";

    while (currentPage <= totalPages) {
      const apiParams = {
        method: "user.getrecenttracks",
        user: userId.trim(),
        api_key: LASTFM_API_KEY,
        format: "json",
        from: Math.floor(from),
        to: Math.floor(to),
        limit: 200,
        page: currentPage
      };

      let success = false;
      let retryCount = 0;
      const maxRetries = 3;
      let response: any;

      while (!success && retryCount < maxRetries) {
        try {
          response = await axiosInstance.get(url, { params: apiParams });
          if (response.data.error) throw new Error(response.data.message);
          success = true;
        } catch (err) {
          retryCount++;
          if (retryCount >= maxRetries) throw err;
          await delay(2000 * Math.pow(1.5, retryCount));
        }
      }

      if (!response) break;

      const recentTracks = response.data.recenttracks;
      const tracks = recentTracks?.track;
      if (!tracks || (Array.isArray(tracks) && tracks.length === 0)) break;

      if (recentTracks["@attr"]?.totalPages) {
        totalPages = parseInt(recentTracks["@attr"].totalPages, 10);
      }

      const trackArray = Array.isArray(tracks) ? tracks : [tracks];
      const completedTracks = trackArray.filter((t: any) => !t["@attr"]?.nowplaying);

      for (const track of completedTracks) {
        const timestamp = parseInt(track.date?.uts);
        if (!timestamp) {
          skipCount++;
          continue;
        }

        const docId = `${userId}_${timestamp}`;
        const docRef = db.collection("listening_history").doc(docId);
        
        batch.set(docRef, {
          userId: userId,
          date: targetDate,
          timestamp: admin.firestore.Timestamp.fromMillis(timestamp * 1000),
          artist: track.artist?.["#text"] || track.artist?.name || "Unknown Artist",
          track: track.name || "Unknown Track",
          album: track.album?.["#text"] || "Unknown Album",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        
        savedCount++;
        currentBatchSize++;

        if (currentBatchSize >= MAX_BATCH_SIZE) {
          await batch.commit();
          batch = db.batch(); 
          currentBatchSize = 0;
        }
      }
      
      currentPage++; 
      await delay(300); 
    }

    if (currentBatchSize > 0) {
      await batch.commit();
    }

    return { success: true, saved: savedCount, skipped: skipCount };
  } catch (error: any) {
    console.error(`❌ Scraper Error [${userId}]:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 2. Next.js POST API 핸들러
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, startDate, endDate } = body;

    if (!username || !startDate || !endDate) {
      return NextResponse.json({ success: false, message: "파라미터가 누락되었습니다." }, { status: 400 });
    }

    const startOfDayKST = new Date(startDate + "T00:00:00+09:00");
    const endOfDayKST = new Date(endDate + "T23:59:59+09:00");
    const fromTimestamp = Math.floor(startOfDayKST.getTime() / 1000);
    const toTimestamp = Math.floor(endOfDayKST.getTime() / 1000);

    // 스크래핑 함수 실행
    const result = await scrapeAndSaveUser(username, fromTimestamp, toTimestamp, `${startDate}_to_${endDate}`);

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: `데이터 수집 완료 (저장: ${result.saved}곡)` 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: "수집 실패", 
        error: result.error 
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "서버 오류", error: error.message }, { status: 500 });
  }
}