"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { calculateRevenue } from "@/lib/revenue";
import { formatYMD, getDefaultDateRange } from "@/lib/date-utils";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, 
  PieChart, Pie, Cell 
} from 'recharts';
import * as XLSX from 'xlsx';

export default function FranchiseStatsPage() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKeyword, setFilterKeyword] = useState("");
  const [adminScope, setAdminScope] = useState<string>("all");

  const [dateRange, setDateRange] = useState(getDefaultDateRange);

  const [franchiseData, setFranchiseData] = useState<any[]>([]);
  const [totalStats, setTotalStats] = useState({ revenue: 0, plays: 0, stores: 0 });

  useEffect(() => {
    const init = async () => {
      let scope = "all";
      if (user?.email) {
        const adminSnap = await getDoc(doc(db, "admins", user.email));
        if (adminSnap.exists()) {
          scope = adminSnap.data().scope || "all";
        }
      }
      setAdminScope(scope);
      fetchFranchiseData(scope);
    };
    if (user !== null) init();
  }, [user]);

  const handleDownload = (type: 'xlsx' | 'csv') => {
    if (franchiseData.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }
    const exportData = franchiseData.map(item => ({
      "브랜드명": item.name,
      "매장 수": item.stores,
      "총 유효 재생": item.plays,
      "매장당 평균 재생": item.stores > 0 ? Math.floor(item.plays / item.stores) : 0,
      "총 정산금": item.revenue
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FranchiseSummary");

    if (type === 'xlsx') {
      XLSX.writeFile(workbook, `프랜차이즈_집계_${dateRange.start}_${dateRange.end}.xlsx`);
    } else {
      const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob(["\uFEFF" + csvOutput], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `프랜차이즈_집계_${dateRange.start}_${dateRange.end}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const fetchFranchiseData = async (scope?: string) => {
    const effectiveScope = scope ?? adminScope;
    setLoading(true);
    setLoadingStatus("데이터 집계 중...");
    try {
      const usersSnap = await getDocs(collection(db, "monitored_users"));
      const userMap: Record<string, string> = {};
      usersSnap.forEach(doc => {
        const d = doc.data();
        if (d.lastfm_username) userMap[d.lastfm_username] = d.franchise || 'personal';
      });

      const statsColl = collection(db, "daily_stats");
      const qStats = query(statsColl, where("date", ">=", dateRange.start), where("date", "<=", dateRange.end));
      const statsSnap = await getDocs(qStats);
      const userAggregates: Record<string, number> = {};

      statsSnap.forEach(doc => {
        const d = doc.data();
        const uid = d.lastfm_username || d.userId;
        const count = d.play_count !== undefined ? d.play_count : (d.playCount || 0);
        if (uid) userAggregates[uid] = (userAggregates[uid] || 0) + count;
      });

      const allFranchiseKeys = effectiveScope === "all"
        ? ['seveneleven', 'personal', 'easyshop']
        : [effectiveScope];

      const franchiseStats: Record<string, { name: string, stores: number, plays: number, revenue: number, id: string }> = {};
      const franchiseNames: Record<string, string> = { seveneleven: '세븐일레븐', personal: '개인/기타', easyshop: '이지샵' };
      allFranchiseKeys.forEach(key => {
        franchiseStats[key] = { id: key, name: franchiseNames[key] || key, stores: 0, plays: 0, revenue: 0 };
      });

      Object.entries(userAggregates).forEach(([uid, plays]) => {
        const franchiseKey = userMap[uid] || 'personal';
        if (!franchiseStats[franchiseKey]) return;
        franchiseStats[franchiseKey].stores += 1;
        franchiseStats[franchiseKey].plays += plays;
        franchiseStats[franchiseKey].revenue += calculateRevenue(franchiseKey, plays);
      });

      const resultData = Object.values(franchiseStats);
      setFranchiseData(resultData);
      setTotalStats(resultData.reduce((acc, cur) => ({
        revenue: acc.revenue + cur.revenue,
        plays: acc.plays + cur.plays,
        stores: acc.stores + cur.stores
      }), { revenue: 0, plays: 0, stores: 0 }));

    } catch (e) {
      console.error(e);
      setLoadingStatus("데이터 로드 실패");
    } finally {
      setLoading(false);
    }
  };

  const filteredFranchiseData = franchiseData.filter(item => 
    item.name.toLowerCase().includes(filterKeyword.toLowerCase())
  );

  return (
    <div className="page-container">
      {/* 상단 헤더 & 조회 */}
      <div className="filter-section">
        <div className="filter-left">
          <h2 className="title">🏢 프랜차이즈 통계</h2>
          <div className="date-inputs">
            <input type="date" value={dateRange.start} onChange={(e)=>setDateRange({...dateRange, start:e.target.value})} className="input-field" />
            <span className="separator">~</span>
            <input type="date" value={dateRange.end} onChange={(e)=>setDateRange({...dateRange, end:e.target.value})} className="input-field" />
            <button onClick={() => fetchFranchiseData()} className="primary-btn">조회</button>
          </div>
        </div>
      </div>

      {/* 1. 종합 요약 카드 */}
      <div className="stats-grid">
        <StatCard label="총 정산 예정 금액" value={totalStats.revenue} unit="원" color="#10b981" subText="모든 브랜드 합계" />
        <StatCard label="총 재생 수" value={totalStats.plays} unit="곡" color="#3b82f6" subText="유효 재생 기준" />
        <StatCard label="전체 매장 수" value={totalStats.stores} unit="개" subText="집계된 매장 수" />
      </div>

      {loading && <div className="loading-bar">⏳ {loadingStatus}</div>}

      {/* 2. 시각화 차트 */}
      <div className="charts-grid">
        <div className="chart-box">
          <h3 className="chart-title">📊 브랜드별 정산금 비교</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={franchiseData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                <XAxis type="number" tickFormatter={(val) => val.toLocaleString()} />
                <YAxis dataKey="name" type="category" width={100} tick={{fontWeight:'bold'}} />
                <Tooltip formatter={(val:any) => `${val.toLocaleString()} 원`} cursor={{fill: '#f5f5f5'}} />
                <Legend />
                <Bar dataKey="revenue" name="정산금" barSize={40}>
                  {franchiseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.id === 'seveneleven' ? '#008060' : entry.id === 'easyshop' ? '#f59e0b' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-box">
          <h3 className="chart-title">🥧 매장 점유율</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={franchiseData} cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                  paddingAngle={5} dataKey="stores" nameKey="name"
                >
                  {franchiseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.id === 'seveneleven' ? '#008060' : entry.id === 'easyshop' ? '#f59e0b' : '#6366f1'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. 상세 테이블 */}
      <div className="table-section">
        <div className="table-header">
            <h3 className="chart-title">📋 브랜드별 상세 현황</h3>
            <div className="table-controls">
                <div className="download-group">
                  <button onClick={() => handleDownload('xlsx')}>Excel</button>
                  <button onClick={() => handleDownload('csv')}>CSV</button>
                </div>
                <div className="search-group">
                    <input 
                        type="text" placeholder="브랜드명 검색..." value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') setFilterKeyword(searchTerm); }}
                        className="input-field"
                    />
                    <button onClick={() => setFilterKeyword(searchTerm)} className="primary-btn">검색</button>
                </div>
            </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>브랜드명</th>
                <th>매장 수</th>
                <th>총 유효 재생</th>
                <th>평균 재생</th>
                <th>총 정산금</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredFranchiseData.map((item, idx) => (
                <tr key={idx}>
                  <td className="brand-td">
                    <span className="dot" style={{ background: item.id === 'seveneleven' ? '#008060' : item.id === 'easyshop' ? '#f59e0b' : '#6366f1' }}></span>
                    {item.name}
                  </td>
                  <td>{item.stores.toLocaleString()} 개</td>
                  <td>{item.plays.toLocaleString()} 곡</td>
                  <td>{item.stores > 0 ? Math.floor(item.plays / item.stores).toLocaleString() : 0} 곡</td>
                  <td className="bold-td">{item.revenue.toLocaleString()} 원</td>
                  <td>
                    <button onClick={() => router.push(`/admin/franchise/${item.id}`)} className="detail-btn">
                      상세보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .page-container { padding: 20px; max-width: 1200px; margin: 0 auto; }
        .filter-section { background: white; padding: 20px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 24px; }
        .filter-left { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 15px; }
        .title { font-size: 20px; font-weight: bold; margin: 0; }
        .date-inputs { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; margin-bottom: 30px; }
        
        .chart-box { background: white; padding: 20px; border-radius: 12px; border: 1px solid #eee; }
        .chart-title { font-size: 16px; font-weight: bold; margin-bottom: 20px; color: #1f2937; }
        .chart-wrapper { width: 100%; height: 300px; }
        
        .table-section { background: white; padding: 20px; border-radius: 12px; border: 1px solid #eee; }
        .table-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 15px; margin-bottom: 20px; }
        .table-controls { display: flex; flex-wrap: wrap; gap: 12px; }
        
        .table-wrapper { width: 100%; overflow-x: auto; } /* 모바일에서 테이블 짤림 방지 */
        table { width: 100%; border-collapse: collapse; min-width: 600px; }
        th { padding: 12px; text-align: left; background: #f9fafb; border-bottom: 2px solid #eee; color: #4b5563; font-size: 14px; }
        td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; color: #374151; }
        
        .brand-td { display: flex; align-items: center; gap: 8px; font-weight: bold; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .bold-td { font-weight: bold; }
        
        .input-field { border: 1px solid #ddd; borderRadius: 6px; padding: 8px 12px; font-size: 14px; outline: none; }
        .primary-btn { background: #1f2937; color: white; border: none; padding: 8px 16px; borderRadius: 6px; cursor: pointer; font-weight: bold; }
        .detail-btn { padding: 6px 12px; border-radius: 6px; border: 1px solid #ddd; background: white; cursor: pointer; font-size: 12px; font-weight: bold; }
        
        .download-group { display: flex; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; }
        .download-group button { background: white; border: none; padding: 8px 12px; font-size: 13px; cursor: pointer; border-right: 1px solid #ddd; }
        .download-group button:last-child { border-right: none; }
        .loading-bar { text-align: center; padding: 20px; color: #6b7280; font-weight: 500; }

        @media (max-width: 768px) {
          .stats-grid, .charts-grid { grid-template-columns: 1fr; }
          .filter-left { flex-direction: column; align-items: flex-start; }
          .date-inputs { width: 100%; }
          .date-inputs input { flex: 1; }
        }
      `}</style>
    </div>
  );
}

function StatCard({ label, value, unit, color = "#333", subText }: any) {
  return (
    <div className="stat-card">
      <div className="label">{label}</div>
      <div className="value" style={{ color }}>
        {value.toLocaleString()} <span className="unit">{unit}</span>
      </div>
      <div className="subtext">{subText}</div>
      <style jsx>{`
        .stat-card { background: white; padding: 24px; border-radius: 12px; border: 1px solid #eee; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .label { color: #6b7280; font-size: 14px; margin-bottom: 8px; }
        .value { font-size: 28px; font-weight: bold; margin-bottom: 4px; }
        .unit { font-size: 16px; color: #9ca3af; font-weight: normal; }
        .subtext { font-size: 13px; color: #9ca3af; }
      `}</style>
    </div>
  );
}