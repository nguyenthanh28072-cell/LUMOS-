"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { HOUSES_DATA } from "../data/houses";

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDepartmentId?: string;
}

export default function EnrollmentModal({
  isOpen,
  onClose,
  initialDepartmentId = "hoc-tap-nckh",
}: EnrollmentModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    className: "",
    selectedDepartments: [initialDepartmentId],
    understandingReason: "",
    strengthsWeaknesses: "",
    messageToLcd: "",
  });

  const [errors, setErrors] = useState<{ studentId?: string; className?: string; departments?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validation functions
  const validateStudentId = (id: string): boolean => {
    // 8-9 digits, starting with 2015 - 2026 (HUST format: year + 4-5 digits)
    const mssvRegex = /^(201[5-9]|202[0-6])\d{4,5}$/;
    return mssvRegex.test(id.trim());
  };

  const validateClassName = (cls: string): boolean => {
    // Major codes: MI1, MI2, MI-E22 (or MIE22), TROY-IT (or TROYIT) + class no + K-year
    const classRegex = /^(MI1|MI2|MI-?E22|TROY-?IT)[\s\-]*\d{1,2}[\s\-]*K\d{2}$/i;
    return classRegex.test(cls.trim());
  };

  const toggleDepartment = (deptId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedDepartments.includes(deptId);
      let updated: string[];
      if (exists) {
        // Keep at least one selected
        updated = prev.selectedDepartments.length > 1
          ? prev.selectedDepartments.filter((id) => id !== deptId)
          : prev.selectedDepartments;
      } else {
        updated = [...prev.selectedDepartments, deptId];
      }
      return { ...prev, selectedDepartments: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { studentId?: string; className?: string; departments?: string } = {};

    if (!validateStudentId(formData.studentId)) {
      newErrors.studentId =
        "MSSV chưa đúng định dạng HUST (8 - 9 chữ số bắt đầu bằng năm nhập học, VD: 2024xxxxx, 2026xxxxx).";
    }

    if (!validateClassName(formData.className)) {
      newErrors.className =
        "Lớp chưa đúng định dạng (Mã ngành - Lớp K[Khóa], VD: MI2 - 01 K69 hoặc MI2 01 K69). Chỉ chấp nhận mã ngành: MI1, MI2, MI-E22, TROY-IT.";
    }

    if (formData.selectedDepartments.length === 0) {
      newErrors.departments = "Vui lòng chọn ít nhất 1 mảng muốn gia nhập.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const selectedDeptObjs = HOUSES_DATA.filter((h) =>
        formData.selectedDepartments.includes(h.id)
      );

      await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          studentId: formData.studentId,
          className: formData.className,
          selectedDepartments: formData.selectedDepartments,
          departmentTitles: selectedDeptObjs.map((d) => d.fullTitle),
          understandingReason: formData.understandingReason,
          strengthsWeaknesses: formData.strengthsWeaknesses,
          messageToLcd: formData.messageToLcd,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Enrollment submit error:", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: "",
      studentId: "",
      className: "",
      selectedDepartments: [initialDepartmentId],
      understandingReason: "",
      strengthsWeaknesses: "",
      messageToLcd: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop" onClick={onClose}>
          <motion.div
            className="enroll-modal enroll-modal-expanded"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Image Layer with ~30% blur */}
            <div className="modal-backdrop-bg" aria-hidden="true" />
            <div className="modal-backdrop-overlay" aria-hidden="true" />
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>

            {!isSubmitted ? (
              <>
                <div className="modal-header">
                  <span className="sparkle">✦</span>
                  <h3>ĐƠN ĐĂNG KÝ TUYỂN THÀNH VIÊN</h3>
                  <p>LCĐ - LCHSV KHOA TOÁN - TIN • ĐẠI HỌC BÁCH KHOA HÀ NỘI</p>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                  {/* Field 1: Họ và tên */}
                  <div className="form-group">
                    <label>
                      1. Họ và tên sinh viên <span className="req-star">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>

                  {/* Field 2: Mã số sinh viên */}
                  <div className="form-group">
                    <label>
                      2. Mã số sinh viên (MSSV) <span className="req-star">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: 2024xxxxx hoặc 2026xxxxx"
                      value={formData.studentId}
                      onChange={(e) => {
                        setFormData({ ...formData, studentId: e.target.value });
                        if (errors.studentId) setErrors({ ...errors, studentId: undefined });
                      }}
                    />
                    <span className="field-hint">Đảm bảo 8 - 9 chữ số chuẩn HUST (bắt đầu bằng năm nhập học, VD: 2024xxxxx, 2026xxxxx).</span>
                    {errors.studentId && <p className="field-error-text">{errors.studentId}</p>}
                  </div>

                  {/* Field 3: Lớp sinh hoạt */}
                  <div className="form-group">
                    <label>
                      3. Lớp SH (Mã ngành - Lớp K[Khóa]) <span className="req-star">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: MI2 - 01 K69 hoặc MI2 01 K69"
                      value={formData.className}
                      onChange={(e) => {
                        setFormData({ ...formData, className: e.target.value });
                        if (errors.className) setErrors({ ...errors, className: undefined });
                      }}
                    />
                    <span className="field-hint">
                      Mã ngành hợp lệ: <strong>MI1</strong>, <strong>MI2</strong>, <strong>MI-E22</strong>, <strong>TROY-IT</strong> (có hoặc không có dấu gạch ngang đều được).
                    </span>
                    {errors.className && <p className="field-error-text">{errors.className}</p>}
                  </div>

                  {/* Field 4: Mảng muốn gia nhập (Multi-select) */}
                  <div className="form-group">
                    <label>
                      4. Mảng muốn gia nhập? (Có thể chọn nhiều mảng) <span className="req-star">*</span>
                    </label>
                    <div className="dept-select-grid">
                      {HOUSES_DATA.map((house) => {
                        const isSelected = formData.selectedDepartments.includes(house.id);
                        return (
                          <div
                            key={house.id}
                            className={`dept-option-pill ${isSelected ? "is-selected" : ""}`}
                            onClick={() => toggleDepartment(house.id)}
                            style={
                              {
                                "--dept-color": house.color,
                                "--dept-glow": house.glowColor,
                              } as React.CSSProperties
                            }
                          >
                            <span className="dept-checkbox">{isSelected ? "✓" : "+"}</span>
                            <span className="dept-icon">{house.icon}</span>
                            <div className="dept-text">
                              <span className="dept-house">{house.houseName.toUpperCase()}</span>
                              <span className="dept-title">{house.title}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {errors.departments && <p className="field-error-text">{errors.departments}</p>}
                  </div>

                  {/* Field 5: Hiểu biết & Lý do gia nhập */}
                  <div className="form-group">
                    <label>
                      5. Hiểu biết về Liên chi và lý do mong muốn gia nhập LCĐ - LCHSV Khoa Toán - Tin? <span className="req-star">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Chia sẻ hiểu biết của bạn về các hoạt động của Liên chi và lý do bạn muốn trở thành một phần của đại gia đình Toán - Tin..."
                      value={formData.understandingReason}
                      onChange={(e) =>
                        setFormData({ ...formData, understandingReason: e.target.value })
                      }
                    />
                  </div>

                  {/* Field 6: Điểm mạnh và điểm yếu */}
                  <div className="form-group">
                    <label>
                      6. Điểm mạnh và điểm yếu của bản thân? <span className="req-star">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Hãy nói về những thế mạnh (kỹ năng, tính cách, kinh nghiệm) và điểm yếu bạn đang cố gắng hoàn thiện..."
                      value={formData.strengthsWeaknesses}
                      onChange={(e) =>
                        setFormData({ ...formData, strengthsWeaknesses: e.target.value })
                      }
                    />
                  </div>

                  {/* Field 7: Lời nhắn gửi */}
                  <div className="form-group">
                    <label>7. Có điều gì muốn gửi đến LCĐ - LCHSV Khoa Toán - Tin không?</label>
                    <textarea
                      rows={2}
                      placeholder="Những kỳ vọng, câu hỏi hoặc lời nhắn đáng yêu bạn gửi tới Anh/Chị trong Ban Quản lý..."
                      value={formData.messageToLcd}
                      onChange={(e) => setFormData({ ...formData, messageToLcd: e.target.value })}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="submit-enroll-btn"
                    disabled={isSubmitting}
                    whileHover={isSubmitting ? undefined : { scale: 1.02 }}
                    whileTap={isSubmitting ? undefined : { scale: 0.98 }}
                  >
                    <span>{isSubmitting ? "ĐANG XỬ LÝ NỘP ĐƠN..." : "XÁC NHẬN GỬI ĐƠN ĐĂNG KÝ"}</span> ✦
                  </motion.button>
                </form>
              </>
            ) : (
              <div className="modal-success">
                <span className="success-icon">✨</span>
                <h3>ĐƠN ĐĂNG KÝ ĐÃ ĐƯỢC GỬI!</h3>
                <p>
                  Chúc mừng <strong>{formData.fullName}</strong> (MSSV: <em>{formData.studentId}</em> - Lớp: <em>{formData.className}</em>)!
                </p>
                <div className="submitted-depts-summary">
                  <p className="summary-label">Các mảng bạn đăng ký gia nhập:</p>
                  <ul>
                    {HOUSES_DATA.filter((h) =>
                      formData.selectedDepartments.includes(h.id)
                    ).map((h) => (
                      <li key={h.id} style={{ color: h.color }}>
                        {h.icon} {h.fullTitle}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="success-sub">
                  Ban Cán sự LCĐ - LCHSV Khoa Toán - Tin đã nhận được đơn của bạn và sẽ sớm liên hệ qua MSSV & Email.
                </p>
                <button className="done-btn" onClick={resetForm}>
                  HOÀN TẤT & TRỞ VỀ ✦
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
