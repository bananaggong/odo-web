"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { calculateRevenue } from "@/lib/revenue";
import { formatYMD, getDatesInRange, getDefaultDateRange } from "@/lib/date-utils";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import * as XLSX from 'xlsx';

export default function FranchiseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const franchiseId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKeyword, setFilterKeyword] = useState("");

  const franchiseName = franchiseId === 'seveneleven' ? '세븐일레븐' : '개인/기타';
  const themeColor = franchiseId === 'seveneleven' ? '#008060' : '#6366f1';

  const [dateRange, setDateRange] = useState(getDefaultDateRange);

  const [summary, setSummary] = useState({ totalRevenue: 0, totalPlays: 0, activeStores: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [storeList, setStoreList] = useState<any[]>([]);

  const handleDownload = (type: 'xlsx' | 'csv') => {
    if (filteredStoreList.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }
    const exportData = filteredStoreList.map((store, idx) => ({
      "순위": `${idx + 1}위`,
      "매장명": store.name,
      "아이디(ID)": store.id,
      "기간 내 총 재생": store.plays,
      "일 평균": store.avg,
      "예상 정산금": store.revenue
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FranchiseDetail");

    if (type === 'xlsx') {
      XLSX.writeFile(workbook, `${franchiseName}_상세리포트_${dateRange.start}_${dateRange.end}.xlsx`);
    } else {
      const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob(["\uFEFF" + csvOutput], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${franchiseName}_상세리포트_${dateRange.start}_${dateRange.end}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const filteredStoreList = storeList.filter(store => 
    store.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
    store.id.toLowerCase().includes(filterKeyword.toLowerCase())
  );

  useEffect(() => {
    fetchDetailData();
  }, [dateRange]);

  const fetchDetailData = async () => {
    setLoading(true);
    setLoadingStatus("데이터 분석 중...");
    try {
      const usersSnap = await getDocs(collection(db, "monitored_users"));
      const userMap: Record<string, any> = {};
      usersSnap.forEach(doc => {
        const d = doc.data();
        if (d.lastfm_username && (d.franchise || 'personal') === franchiseId) {
          userMap[d.lastfm_username] = { name: d.store_name || "이름 없음", uid: d.uid };
        }
      });

      const qStats = query(collection(db, "daily_stats"), where("date", ">=", dateRange.start), where("date", "<=", dateRange.end));
      const statsSnap = await getDocs(qStats);

      const dailyAggregates: Record<string, number> = {};
      const userAggregates: Record<string, number> = {};
      const allDates = getDatesInRange(new Date(dateRange.start), new Date(dateRange.end));
      allDates.forEach(d => dailyAggregates[d] = 0);

      statsSnap.forEach(doc => {
        const d = doc.data();
        const uid = d.lastfm_username || d.userId;
        const count = d.play_count ?? d.playCount ?? 0;
        if (uid && (userMap[uid] || d.franchise === franchiseId)) {
            if (dailyAggregates[d.date] !== undefined) dailyAggregates[d.date] += count;
            userAggregates[uid] = (userAggregates[uid] || 0) + count;
        }
      });

      const finalChartData = allDates.map(date => ({ name: date.slice(5), plays: dailyAggregates[date] }));
      let grandTotalRevenue = 0;
      let grandTotalPlays = 0;

      const finalStoreList = Object.keys(userAggregates).map(uid => {
        const totalPlays = userAggregates[uid];
        const revenue = calculateRevenue(franchiseId, totalPlays);
        grandTotalRevenue += revenue;
        grandTotalPlays += totalPlays;
        return {
            id: uid,
            firebaseUid: userMap[uid]?.uid || uid,
            name: userMap[uid]?.name || "Unknown Store",
            plays: totalPlays,
            revenue: revenue,
            avg: Math.floor(totalPlays / (allDates.length || 1))
        };
      }).sort((a, b) => b.plays - a.plays);

      setSummary({ totalRevenue: grandTotalRevenue, totalPlays: grandTotalPlays, activeStores: finalStoreList.length });
      setChartData(finalChartData);
      setStoreList(finalStoreList);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="page-container">
      <div className="header-nav">
        <button onClick={() => router.back()} className="back-btn">
          ← 전체 통계로 돌아가기
        </button>
        <div className="filter-section">
            <div className="filter-row">
                <h2 className="page-title" style={{ color: themeColor }}>{franchiseName} 상세 리포트</h2>
                <div className="date-controls">
                    <input type="date" value={dateRange.start} onChange={(e)=>setDateRange({...dateRange, start:e.target.value})} className="input-field" />
                    <span className="sep">~</span>
                    <input type="date" value={dateRange.end} onChange={(e)=>setDateRange({...dateRange, end:e.target.value})} className="input-field" />
                    <button onClick={fetchDetailData} className="primary-btn">조회</button>
                </div>
            </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="총 정산 금액" value={summary.totalRevenue} unit="원" color={themeColor} isHighlight={true} />
        <StatCard label="총 유효 재생" value={summary.totalPlays} unit="곡" color="#3b82f6" />
        <StatCard label="활성 매장 수" value={summary.activeStores} unit="개" />
      </div>

      <div className="section-box">
        <h3 className="section-title">📈 {franchiseName} 전체 일별 추이</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fontSize: 12, fill: '#888'}} dy={10} />
              <YAxis tickLine={false} axisLine={false} tick={{fontSize: 12, fill: '#888'}} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
              <Legend />
              <Line type="monotone" dataKey="plays" name="재생수" stroke={themeColor} strokeWidth={3} dot={{r:4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="section-box">
        <div className="section-header">
            <h3 className="section-title">🏆 매장별 성과 (재생 순위)</h3>
            <div className="controls-row">
                <div className="download-group">
                  <button onClick={() => handleDownload('xlsx')}>Excel</button>
                  <button onClick={() => handleDownload('csv')}>CSV</button>
                </div>
                <div className="search-group">
                    <input 
                        type="text" placeholder="매장명 또는 ID 검색..." value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') setFilterKeyword(searchTerm); }}
                        className="input-field"
                    />
                    <button onClick={() => setFilterKeyword(searchTerm)} className="primary-btn">검색</button>
                </div>
            </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>순위</th>
                <th>매장명 (ID)</th>
                <th>기간 내 총 재생</th>
                <th>일 평균</th>
                <th>예상 정산금</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredStoreList.length > 0 ? (
                  filteredStoreList.map((store, idx) => (
                  <tr key={idx}>
                      <td className="rank-td">
                          {idx < 3 ? <span className="top-rank" style={{ background: `${themeColor}15`, color: themeColor }}>{idx + 1}위</span> : idx + 1}
                      </td>
                      <td className="store-td">
                          <div className="store-name">{store.name}</div>
                          <div className="store-id">{store.id}</div>
                      </td>
                      <td className="bold-text">{store.plays.toLocaleString()} 곡</td>
                      <td>{store.avg.toLocaleString()} 곡</td>
                      <td className="bold-text" style={{ color: themeColor }}>{store.revenue.toLocaleString()} 원</td>
                      <td>
                          <button onClick={() => router.push(`/admin/dashboard/${store.firebaseUid || store.id}`)} className="detail-btn">상세보기</button>
                      </td>
                  </tr>
                  ))
              ) : (
                  <tr><td colSpan={6} className="no-data">데이터가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .page-container { padding: 20px; max-width: 1200px; margin: 0 auto; }
        .back-btn { background: none; border: none; color: #6b7280; cursor: pointer; font-size: 14px; margin-bottom: 12px; transition: color 0.2s; }
        .back-btn:hover { color: #1f2937; }
        
        .filter-section { background: white; padding: 20px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 24px; }
        .filter-row { display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; }
        .page-title { font-size: 22px; font-weight: bold; margin: 0; }
        .date-controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .section-box { background: white; padding: 25px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 24px; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 20px; color: #1f2937; }
        .chart-wrapper { width: 100%; height: 300px; }
        
        .section-header { display: flex; justify-content: space-between; align-items: center; gap: 15px; margin-bottom: 20px; flex-wrap: wrap; }
        .controls-row { display: flex; gap: 12px; flex-wrap: wrap; }
        
        .table-responsive { width: 100%; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; min-width: 700px; }
        th { padding: 12px; text-align: left; background: #f9fafb; border-bottom: 2px solid #eee; color: #4b5563; font-size: 13px; font-weight: 600; }
        td { padding: 14px 12px; border-bottom: 1px solid #eee; font-size: 14px; color: #374151; }
        
        .rank-td { width: 80px; text-align: center; }
        .top-rank { padding: 4px 10px; border-radius: 20px; font-weight: bold; font-size: 12px; }
        .store-name { font-weight: bold; color: #111827; }
        .store-id { font-size: 11px; color: #9ca3af; margin-top: 2px; }
        .bold-text { font-weight: 600; }
        .no-data { padding: 60px; text-align: center; color: #9ca3af; }
        
        .input-field { border: 1px solid #ddd; border-radius: 6px; padding: 8px 12px; font-size: 14px; outline: none; }
        .primary-btn { background: #1f2937; color: white; border: none; padding: 8px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: opacity 0.2s; }
        .primary-btn:hover { opacity: 0.9; }
        .detail-btn { padding: 6px 12px; border-radius: 6px; border: 1px solid #ddd; background: white; cursor: pointer; font-size: 12px; font-weight: 600; color: #4b5563; }
        
        .download-group { display: flex; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; }
        .download-group button { background: white; border: none; padding: 8px 14px; font-size: 13px; cursor: pointer; border-right: 1px solid #ddd; font-weight: 500; }
        .download-group button:hover { background: #f9fafb; }
        .download-group button:last-child { border-right: none; }

        @media (max-width: 768px) {
          .filter-row, .section-header { flex-direction: column; align-items: flex-start; }
          .date-controls, .controls-row { width: 100%; }
          .date-controls input { flex: 1; }
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

function StatCard({ label, value, unit, color = "#333", isHighlight = false, subText }: any) {
  return (
    <div className={`stat-card ${isHighlight ? 'highlight' : ''}`}>
      <div className="label">{label}</div>
      <div className="value" style={{ color }}>
        {value.toLocaleString()} <span className="unit">{unit}</span>
      </div>
      {subText && <div className="subtext">{subText}</div>}
      <style jsx>{`
        .stat-card { background: white; padding: 24px; border-radius: 12px; border: 1px solid #eee; transition: transform 0.2s; }
        .stat-card.highlight { border-top: 4px solid ${color}; box-shadow: 0 4px 12px ${color}15; }
        .label { color: #6b7280; font-size: 14px; margin-bottom: 8px; }
        .value { font-size: 28px; font-weight: bold; }
        .unit { font-size: 16px; color: #9ca3af; font-weight: normal; }
        .subtext { font-size: 12px; color: #9ca3af; margin-top: 4px; }
      `}</style>
    </div>
  );
}