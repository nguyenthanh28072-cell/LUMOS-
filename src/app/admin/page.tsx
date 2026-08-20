"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HOUSES_DATA } from "../../data/houses";
import ThemeToggle from "../../components/ThemeToggle";

interface EnrollmentItem {
  id: string;
  fullName?: string;
  name?: string;
  studentId?: string;
  className?: string;
  selectedDepartments?: string[];
  departmentTitles?: string[];
  understandingReason?: string;
  strengthsWeaknesses?: string;
  messageToLcd?: string;
  skill?: string;
  timestamp: string;
}

export default function AdminPage() {
  const [data, setData] = useState<EnrollmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<EnrollmentItem | null>(null);

  const fetchData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/admin/enrollments");
      const json = await res.json();
      if (json.success) {
        // Reverse array so latest submissions appear first
        setData((json.data || []).reverse());
        setLastSyncTime(new Date().toLocaleTimeString("vi-VN"));
      }
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);

    // Auto-update every 5 seconds for new submissions
    const interval = setInterval(() => {
      fetchData(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredData = data.filter((item) => {
    const name = (item.fullName || item.name || "").toLowerCase();
    const mssv = (item.studentId || "").toLowerCase();
    const cls = (item.className || "").toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch = name.includes(query) || mssv.includes(query) || cls.includes(query);

    const matchesDept =
      selectedDeptFilter === "all" ||
      (item.selectedDepartments && item.selectedDepartments.includes(selectedDeptFilter));

    return matchesSearch && matchesDept;
  });

  const exportToCSV = () => {
    if (data.length === 0) return;

    // Headers for Excel UTF-8
    const headers = [
      "STT",
      "Họ và tên",
      "Mã số sinh viên (MSSV)",
      "Lớp SH",
      "Mảng muốn gia nhập",
      "Hiểu biết & Lý do gia nhập",
      "Điểm mạnh & Điểm yếu",
      "Lời nhắn gửi LCĐ",
      "Thời gian nộp",
    ];

    const rows = filteredData.map((item, idx) => {
      const depts = (item.departmentTitles || []).join(" | ");
      return [
        idx + 1,
        `"${(item.fullName || item.name || "").replace(/"/g, '""')}"`,
        `"${(item.studentId || "").replace(/"/g, '""')}"`,
        `"${(item.className || "").replace(/"/g, '""')}"`,
        `"${depts.replace(/"/g, '""')}"`,
        `"${(item.understandingReason || "").replace(/"/g, '""')}"`,
        `"${(item.strengthsWeaknesses || "").replace(/"/g, '""')}"`,
        `"${(item.messageToLcd || "").replace(/"/g, '""')}"`,
        `"${new Date(item.timestamp).toLocaleString("vi-VN")}"`,
      ];
    });

    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `DS_Dang_Ky_LUMOS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="lumos-page admin-page-wrapper">
      <header className="lumos-header">
        <div className="brand-logo">
          <Link href="/" className="back-home-link">
            <span>←</span> TRANG CHỦ LUMOS
          </Link>
        </div>
        <div className="admin-title">
          <span>✦</span> BẢNG QUẢN LÝ ĐƠN ĐĂNG KÝ TUYỂN
          {lastSyncTime && (
            <span className="live-sync-badge" title="Tự động cập nhật dữ liệu mỗi 5 giây">
              ● TỰ ĐỘNG CẬP NHẬT ({lastSyncTime})
            </span>
          )}
        </div>
        <div className="header-actions">
          <ThemeToggle />
          <button className="replay-btn" onClick={() => fetchData(true)} title="Tải lại dữ liệu">
            <span>LÀM MỚI</span> ↺
          </button>
          <button className="enroll-nav-btn" onClick={exportToCSV} title="Xuất dữ liệu Excel">
            <span>XUẤT EXCEL / CSV</span> 📥
          </button>
        </div>
      </header>

      <section className="admin-container">
        {/* Metric Cards */}
        <div className="admin-stats-row">
          <div className="stat-card">
            <span className="stat-num">{data.length}</span>
            <span className="stat-label">TỔNG SỐ ĐƠN ĐÃ NỘP</span>
          </div>
          {HOUSES_DATA.map((h) => {
            const count = data.filter(
              (d) => d.selectedDepartments && d.selectedDepartments.includes(h.id)
            ).length;
            return (
              <div
                key={h.id}
                className="stat-card"
                style={{ borderColor: h.color, "--stat-color": h.color } as React.CSSProperties}
              >
                <span className="stat-num" style={{ color: h.color }}>
                  {count}
                </span>
                <span className="stat-label">{h.houseName.toUpperCase()} • {h.title}</span>
              </div>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <div className="admin-filter-bar">
          <input
            type="text"
            className="admin-search-input"
            placeholder="🔍 Tìm theo Họ tên, MSSV (2024xxxxx, 2026xxxxx), Lớp SH (MI2 - 01 K69)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="dept-filter-pills">
            <button
              className={`filter-pill ${selectedDeptFilter === "all" ? "is-active" : ""}`}
              onClick={() => setSelectedDeptFilter("all")}
            >
              TẤT CẢ ({data.length})
            </button>
            {HOUSES_DATA.map((h) => (
              <button
                key={h.id}
                className={`filter-pill ${selectedDeptFilter === h.id ? "is-active" : ""}`}
                onClick={() => setSelectedDeptFilter(h.id)}
                style={{
                  borderColor: selectedDeptFilter === h.id ? h.color : undefined,
                  color: selectedDeptFilter === h.id ? h.color : undefined,
                }}
              >
                {h.icon} {h.houseName}
              </button>
            ))}
          </div>
        </div>

        {/* Table View */}
        {loading ? (
          <div className="admin-loading">Đang tải danh sách đơn đăng ký...</div>
        ) : filteredData.length === 0 ? (
          <div className="admin-empty">
            <span className="empty-icon">📭</span>
            <p>Chưa có đơn đăng ký nào khớp với tìm kiếm.</p>
          </div>
        ) : (
          <div className="table-responsive-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>HỌ VÀ TÊN</th>
                  <th>MSSV</th>
                  <th>LỚP SH</th>
                  <th>MẢNG ĐĂNG KÝ</th>
                  <th>LÝ DO GIA NHẬP</th>
                  <th>THỜI GIAN</th>
                  <th>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr key={item.id || idx} onClick={() => setSelectedItem(item)}>
                    <td>{idx + 1}</td>
                    <td className="font-highlight">
                      <strong>{item.fullName || item.name || "N/A"}</strong>
                    </td>
                    <td>
                      <code className="mssv-badge">{item.studentId || "N/A"}</code>
                    </td>
                    <td>{item.className || "N/A"}</td>
                    <td>
                      <div className="table-depts-tags">
                        {(item.selectedDepartments || []).map((deptId) => {
                          const h = HOUSES_DATA.find((house) => house.id === deptId);
                          if (!h) return null;
                          return (
                            <span
                              key={deptId}
                              className="dept-tag-badge"
                              style={{ color: h.color, borderColor: h.color }}
                            >
                              {h.icon} {h.houseName}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="text-truncate-2">
                      {item.understandingReason || item.skill || "N/A"}
                    </td>
                    <td className="date-col">
                      {new Date(item.timestamp).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>
                      <button className="view-detail-btn">XEM CHI TIẾT 👁️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Detail Popup Modal */}
      {selectedItem && (
        <div className="modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="enroll-modal enroll-modal-expanded" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedItem(null)}>
              ✕
            </button>
            <div className="modal-header">
              <span className="sparkle">✦</span>
              <h3>CHI TIẾT ĐƠN ĐĂNG KÝ</h3>
              <p>ID ĐƠN: {selectedItem.id}</p>
            </div>

            <div className="detail-popup-content">
              <div className="detail-info-row">
                <span className="info-label">1. Họ và tên:</span>
                <span className="info-val font-highlight">{selectedItem.fullName || selectedItem.name}</span>
              </div>
              <div className="detail-info-row">
                <span className="info-label">2. Mã số sinh viên (MSSV):</span>
                <span className="info-val"><code className="mssv-badge">{selectedItem.studentId}</code></span>
              </div>
              <div className="detail-info-row">
                <span className="info-label">3. Lớp sinh hoạt:</span>
                <span className="info-val">{selectedItem.className}</span>
              </div>
              <div className="detail-info-row">
                <span className="info-label">4. Các mảng đăng ký gia nhập:</span>
                <div className="info-val table-depts-tags">
                  {(selectedItem.departmentTitles || selectedItem.selectedDepartments || []).map(
                    (titleOrId, i) => (
                      <div key={i} className="dept-tag-large">
                        • {titleOrId}
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="detail-info-row text-block">
                <span className="info-label">5. Hiểu biết & Lý do gia nhập:</span>
                <p className="info-text">{selectedItem.understandingReason || selectedItem.skill}</p>
              </div>
              <div className="detail-info-row text-block">
                <span className="info-label">6. Điểm mạnh & Điểm yếu của bản thân:</span>
                <p className="info-text">{selectedItem.strengthsWeaknesses || "N/A"}</p>
              </div>
              <div className="detail-info-row text-block">
                <span className="info-label">7. Lời nhắn gửi đến LCĐ - LCHSV Khoa Toán - Tin:</span>
                <p className="info-text">{selectedItem.messageToLcd || "Không có"}</p>
              </div>
              <div className="detail-info-row">
                <span className="info-label">Thời gian nộp đơn:</span>
                <span className="info-val">{new Date(selectedItem.timestamp).toLocaleString("vi-VN")}</span>
              </div>
            </div>

            <button className="done-btn" onClick={() => setSelectedItem(null)}>
              ĐÓNG CỬA SỔ ✦
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
