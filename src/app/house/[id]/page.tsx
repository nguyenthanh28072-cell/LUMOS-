"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { HOUSES_DATA } from "../../../data/houses";
import EnrollmentModal from "../../../components/EnrollmentModal";
import ThemeToggle from "../../../components/ThemeToggle";

export default function HouseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reducedMotion = useReducedMotion();

  const houseId = params?.id as string;
  const house = HOUSES_DATA.find((h) => h.id === houseId) || HOUSES_DATA[0];

  // Enrollment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", skill: "Frontend & Shaders" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          selectedGuild: house.id,
          guildTitle: house.fullTitle,
          skill: formData.skill,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Enrollment submission error:", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <main
      className="lumos-page house-detail-page-wrapper"
      style={
        {
          "--house-color": house.color,
          "--house-glow": house.glowColor,
          "--house-bg": house.bgGlow,
        } as React.CSSProperties
      }
    >
      {/* Background atmosphere */}
      <div className="page-border-glow" aria-hidden="true" />
      <div className="background house-page-bg" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="atmosphere" aria-hidden="true" style={{ background: house.glowColor }} />

      {/* Header Navigation */}
      <header className="lumos-header">
        <div className="brand-logo">
          <Link href="/#guilds" className="back-home-link">
            <span>←</span> QUAY LẠI CÁC MẢNG HOẠT ĐỘNG
          </Link>
        </div>
        <nav className="nav-links">
          {HOUSES_DATA.map((h) => (
            <Link
              key={h.id}
              href={`/house/${h.id}`}
              className={h.id === house.id ? "active-nav-house" : ""}
              style={{ color: h.id === house.id ? h.color : undefined }}
            >
              {h.houseName.toUpperCase()}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <button className="enroll-nav-btn" onClick={() => setIsModalOpen(true)}>
            <span>ĐĂNG KÝ NGAY</span> ✦
          </button>
        </div>
      </header>

      {/* House Banner Section */}
      <section className="house-hero-section">
        <motion.div
          className="house-hero-hat-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="hat-img-wrapper large-hat"
            animate={
              reducedMotion
                ? undefined
                : {
                    y: [-6, -18, -6],
                    rotate: [-3, 3, -3],
                  }
            }
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img src="/assets/sorting_hat.png" alt={`Sorting Hat ${house.houseName}`} className="sorting-hat-img" />
          </motion.div>
          <div className="hat-aura large-aura" />
        </motion.div>

        <motion.div
          className="house-hero-text"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="hat-house-badge large-badge" style={{ color: house.color, borderColor: house.color }}>
            HOUSE OF {house.houseName.toUpperCase()}
          </span>
          <h1 className="house-hero-title">{house.fullTitle}</h1>
          <p className="house-hero-icon-tag">{house.icon} CHUYÊN MẢNG HOẠT ĐỘNG</p>
        </motion.div>
      </section>

      {/* House Detail Content Container */}
      <section className="house-content-section">
        <motion.div
          className="house-detail-card standalone-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          <div className="house-detail-header">
            <div className="house-detail-title-group">
              <span className="house-detail-icon">{house.icon}</span>
              <div>
                <h3 className="house-detail-full-title">{house.fullTitle}</h3>
                <span className="house-detail-subtitle" style={{ color: house.color }}>
                  LIÊN CHI ĐOÀN - LIÊN CHI HỘI SINH VIÊN KHOA TOÁN - TIN
                </span>
              </div>
            </div>
            <button
              className="house-enroll-btn"
              onClick={() => setIsModalOpen(true)}
              style={{
                borderColor: house.color,
                background: `linear-gradient(135deg, ${house.glowColor}, rgba(7, 19, 33, 0.9))`,
              }}
            >
              <span>GIA NHẬP {house.houseName.toUpperCase()}</span> ✦
            </button>
          </div>

          <div
            className="house-detail-divider"
            style={{
              background: `linear-gradient(90deg, transparent, ${house.color}, transparent)`,
            }}
          />

          <div className="house-detail-body">
            {/* Intro */}
            <p className="house-detail-intro">
              <strong style={{ color: house.color }}>{house.fullTitle}:</strong> {house.intro}
            </p>

            {/* Sections if any */}
            {house.sections &&
              house.sections.map((sec, idx) => (
                <div key={idx} className="house-detail-section">
                  <h4 className="house-section-title">{sec.title}</h4>
                  <ul className="house-section-list">
                    {sec.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}

            {/* Paragraphs if any */}
            {house.paragraphs &&
              house.paragraphs.map((p, idx) => (
                <p key={idx} className="house-detail-paragraph">
                  {p}
                </p>
              ))}

            {/* Sub Header for Slytherin if any */}
            {house.subHeader && (
              <div className="house-sub-header">
                <p>{house.subHeader}</p>
              </div>
            )}

            {/* Sub Teams for Slytherin */}
            {house.subTeams && (
              <div className="house-subteams-grid">
                {house.subTeams.map((team, idx) => (
                  <div key={idx} className="subteam-card">
                    <h4 className="subteam-title">{team.title}</h4>
                    <p className="subteam-desc">{team.desc}</p>
                    {team.reqHeader && <p className="subteam-req-header">{team.reqHeader}</p>}
                    {team.requirements && (
                      <ul className="subteam-req-list">
                        {team.requirements.map((req, rIdx) => (
                          <li key={rIdx}>{req}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Page Footer Navigation */}
          <div className="house-page-footer">
            <Link href="/#guilds" className="back-footer-btn">
              <span>← QUAY LẠI CÁC MẢNG HOẠT ĐỘNG</span>
            </Link>
            <button className="accept-cta-btn" onClick={() => setIsModalOpen(true)}>
              <span>ĐĂNG KÝ GIA NHẬP {house.houseName.toUpperCase()}</span>
              <b>✦</b>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialDepartmentId={house.id}
      />
    </main>
  );
}
