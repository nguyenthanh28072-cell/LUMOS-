"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { HOUSES_DATA, GUILDS } from "../data/houses";
import EnrollmentModal from "../components/EnrollmentModal";
import ThemeToggle from "../components/ThemeToggle";

// Canvas spark particle type for wand cursor trail
interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

const stars = Array.from({ length: 75 }, (_, i) => ({
  id: i,
  left: `${5 + ((i * 13) % 90)}%`,
  top: `${10 + ((i * 17) % 85)}%`,
  delay: (i % 15) * 0.25,
  duration: 4.0 + (i % 7) * 0.6,
  size: 1 + (i % 3) * 0.8,
}));



const ROADMAP_STEPS = [
  {
    step: "PHASE 01",
    title: "Vòng đơn",
    date: "12/09 - 26/09",
    desc: "Mở đơn đăng ký tuyển thành viên Liên chi đoàn - Liên chi hội sinh viên Khoa Toán - Tin.",
  },
  {
    step: "PHASE 02",
    title: "Vòng thử thách",
    date: "27/09 - 01/10",
    desc: "Thực hiện các bài thử thách chuyên môn theo từng mảng hoạt động đã đăng ký.",
  },
  {
    step: "PHASE 03",
    title: "Vòng phỏng vấn",
    date: "02/10",
    desc: "Phỏng vấn trực tiếp cùng LCĐ - LCHSV Khoa Toán - Tin.",
  },
];

export default function Home() {
  const reducedMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // transitionState can be: 'intro' | 'journeyText' | 'flying' | 'delivered' | 'accepted'
  const [transitionState, setTransitionState] = useState<"intro" | "journeyText" | "flying" | "delivered" | "accepted">("intro");
  const [isEnvelopeOpening, setIsEnvelopeOpening] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      setTransitionState("accepted");
    }
  }, []);

  // Registration Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuild, setSelectedGuild] = useState<string>("hoc-tap-nckh");
  const [formData, setFormData] = useState({ name: "", email: "", skill: "Frontend & Shaders" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mouse Parallax
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  /* ─── Canvas Wand Spark Trail ─── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: SparkParticle[] = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const colors = ["#8edaff", "#bae6fd", "#e0f2fe", "#fde047", "#ffffff"];

    const addSparks = (x: number, y: number, count = 3) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 2.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.02 + Math.random() * 0.03,
        });
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      
      setMousePos({
        x: clientX / window.innerWidth,
        y: clientY / window.innerHeight,
      });

      addSparks(clientX, clientY, 2);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  /* ─── Fade volume helper ─── */
  const fadeVolume = useCallback(
    (target: number, durationMs = 800) => {
      const audio = audioRef.current;
      if (!audio) return;
      const steps = 30;
      const stepTime = durationMs / steps;
      const diff = (target - audio.volume) / steps;
      let step = 0;
      const interval = setInterval(() => {
        step++;
        audio.volume = Math.min(1, Math.max(0, audio.volume + diff));
        if (step >= steps) {
          audio.volume = target;
          clearInterval(interval);
        }
      }, stepTime);
    },
    []
  );

  /* Auto-play ambient sound after first interaction */
  useEffect(() => {
    const startAudio = () => {
      if (hasInteracted) return;
      setHasInteracted(true);
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0;
        audio.play().then(() => {
          setIsMuted(false);
          fadeVolume(0.45, 1200);
        }).catch(() => { /* blocked by browser policy */ });
      }
    };

    window.addEventListener("click", startAudio, { once: true });
    window.addEventListener("touchstart", startAudio, { once: true });
    return () => {
      window.removeEventListener("click", startAudio);
      window.removeEventListener("touchstart", startAudio);
    };
  }, [hasInteracted, fadeVolume]);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted || audio.paused) {
      audio.play().then(() => {
        fadeVolume(0.45, 600);
        setIsMuted(false);
      }).catch(() => {});
    } else {
      fadeVolume(0, 500);
      setTimeout(() => {
        audio.pause();
        setIsMuted(true);
      }, 520);
    }
  };

  const handleEnterLight = useCallback(() => {
    if (transitionState !== "intro") return;
    setTransitionState("journeyText");
    
    if (!isMuted && audioRef.current) {
      fadeVolume(0.65, 450);
    }
  }, [transitionState, isMuted, fadeVolume]);

  const handleStartFlying = useCallback(() => {
    if (transitionState !== "journeyText") return;
    setTransitionState("flying");

    if (!isMuted && audioRef.current) {
      fadeVolume(0.85, 450);
    }
  }, [transitionState, isMuted, fadeVolume]);

  const handleOpenLetter = () => {
    if (transitionState !== "delivered" || isEnvelopeOpening) return;
    setIsEnvelopeOpening(true);

    if (!isMuted && audioRef.current) {
      fadeVolume(0.75, 400);
    }

    setTimeout(() => {
      setTransitionState("accepted");
      setIsEnvelopeOpening(false);
      
      if (!isMuted) {
        fadeVolume(0.45, 1000);
      }
    }, 1200);
  };

  const handleReplayJourney = () => {
    setTransitionState("intro");
    setIsEnvelopeOpening(false);
    setIsModalOpen(false);
    setIsSubmitted(false);
  };

  /* ─── Scroll & Key Navigation Triggers ─── */
  useEffect(() => {
    let lastWheelTime = 0;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime < 800) return;

      if (e.deltaY > 20) {
        lastWheelTime = now;
        if (transitionState === "intro") {
          handleEnterLight();
        } else if (transitionState === "journeyText") {
          handleStartFlying();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        if (transitionState === "intro") {
          e.preventDefault();
          handleEnterLight();
        } else if (transitionState === "journeyText") {
          e.preventDefault();
          handleStartFlying();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [transitionState, handleEnterLight, handleStartFlying]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const guildObj = GUILDS.find((g) => g.id === selectedGuild);
      await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          selectedGuild,
          guildTitle: guildObj?.title || selectedGuild,
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
    <main className="lumos-page">
      {/* Interactive Wand Spark Trail Overlay Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 95,
        }}
      />

      {/* ─── Global background elements ─── */}
      <div className="page-border-glow" aria-hidden="true" />
      <div className="background" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="atmosphere" aria-hidden="true" />

      <div className="particles" aria-hidden="true">
        {stars.map((star) => (
          <motion.span
            key={star.id}
            className="particle"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
            }}
            animate={
              reducedMotion
                ? { opacity: 0.55 }
                : {
                    opacity: [0.08, 0.85, 0.15],
                    y: [10, -30, -60],
                    x: [0, star.id % 2 ? 8 : -8, star.id % 2 ? 2 : -2],
                    scale: [0.7, 1.25, 0.5],
                  }
            }
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ─── Transition Flash Overlay ─── */}
      {transitionState === "flying" && (
        <motion.div
          className="transition-flash"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.2, times: [0, 0.4, 0.6, 1], ease: "easeInOut" }}
        />
      )}

      <AnimatePresence mode="wait">
        {transitionState === "intro" && (
          <motion.div
            key="intro-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(15px)" }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            style={{ width: "100%", height: "100%" }}
          >
            <motion.div
              className="wand"
              aria-hidden="true"
              style={{
                x: (mousePos.x - 0.5) * 25,
                y: (mousePos.y - 0.5) * 15,
                rotate: (mousePos.x - 0.5) * 5,
              }}
              initial={reducedMotion ? false : { opacity: 0, y: 35, scale: 0.97 }}
              animate={
                reducedMotion
                  ? { opacity: 0.9 }
                  : { opacity: 0.92, scale: 1 }
              }
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.img
                src="/assets/wand_glow.png"
                alt=""
                animate={
                  reducedMotion
                    ? undefined
                    : {
                        filter: [
                          "brightness(0.95) drop-shadow(0 0 18px rgba(150,220,255,.35))",
                          "brightness(1.25) drop-shadow(0 0 42px rgba(150,220,255,.75))",
                          "brightness(1) drop-shadow(0 0 24px rgba(150,220,255,.45))",
                        ],
                      }
                }
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            <div className="magic-orbit orbit-one" aria-hidden="true" />
            <div className="magic-orbit orbit-two" aria-hidden="true" />

            <section className="hero" aria-label="Lumos landing page">
              <motion.div
                animate={transitionState !== "intro" ? { opacity: 0, y: -45, filter: "blur(10px)" } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.75, ease: "easeInOut" }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
              >
                <motion.p
                  className="eyebrow"
                  initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  THE LIGHT AWAITS
                </motion.p>

                <motion.h1
                  initial={reducedMotion ? false : { opacity: 0, letterSpacing: "0.38em", scale: 0.96 }}
                  animate={{ opacity: 1, letterSpacing: "0.16em", scale: 1 }}
                  transition={{ duration: 1.1, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
                >
                  LUMOS
                </motion.h1>

                <motion.div
                  className="subtitle"
                  initial={reducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.45 }}
                >
                  <span />
                  <p>THE LIGHT REVEALS YOUR PATH</p>
                  <span />
                </motion.div>

                <motion.button
                  className="enter-button"
                  initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.75 }}
                  whileHover={reducedMotion ? undefined : { scale: 1.035, y: -2 }}
                  whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                  onClick={handleEnterLight}
                >
                  <span>ENTER THE LIGHT</span>
                  <b>✦</b>
                </motion.button>
              </motion.div>
            </section>

          </motion.div>
        )}

        {transitionState === "journeyText" && (
          <div
            key="journey-text-screen"
            className="journey-text-container"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
            onClick={handleStartFlying}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="clickable-journey-text"
            >
              YOUR JOURNEY BEGINS HERE.
              <p className="sub-hint">CLICK ANYWHERE OR PRESS SPACE TO RECEIVE YOUR LETTER</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Flying Phase: Owl flies from top-right corner into center ─── */}
      {transitionState === "flying" && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 998, display: "grid", placeItems: "center", pointerEvents: "none" }}>
            <motion.div
              className="clickable-journey-text"
              animate={{ opacity: [1, 0.4, 0], filter: ["blur(0px)", "blur(5px)", "blur(12px)"] }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            >
              YOUR JOURNEY BEGINS HERE.
            </motion.div>
          </div>

          <motion.div
            className="owl-container interactive"
            style={{
              position: "fixed",
              left: "50%",
              top: "42%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
              cursor: "pointer",
              perspective: 1000
            }}
            initial={{ x: "48vw", y: "-42vh", scale: 0.25, rotate: 24, rotateY: -35, opacity: 0 }}
            animate={{
              x: ["48vw", "16vw", "0vw"],
              y: ["-42vh", "-8vh", "0vh"],
              scale: [0.25, 0.72, 1],
              rotate: [24, 8, 0],
              rotateY: [-35, -12, 0],
              opacity: [0, 0.92, 1]
            }}
            transition={{ duration: 3.4, times: [0, 0.58, 1], ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => setTransitionState("delivered")}
            onClick={handleOpenLetter}
          >
            <div className="owl-glow-aura" />
            <img src="/assets/new_owl.png" className="owl-img" alt="Hogwarts messenger owl carrying scroll" />
          </motion.div>
        </>
      )}

      {/* ─── Delivered Phase: Owl hovers gracefully in center holding scroll (Front-Facing) ─── */}
      {transitionState === "delivered" && (
        <div
          className="delivered-phase-container"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            perspective: 1000
          }}
        >
          <motion.div
            className={`owl-container interactive${isEnvelopeOpening ? " is-opening" : ""}`}
            style={{ position: "relative", cursor: "pointer" }}
            initial={{ opacity: 0, scale: 0.9, rotate: 0, rotateY: 0 }}
            animate={
              isEnvelopeOpening
                ? { opacity: 0, scale: 1.35, y: -60, filter: "blur(18px)" }
                : {
                    opacity: 1,
                    scale: 1,
                    y: [0, -14, 0],
                    rotate: 0,
                    rotateY: 0
                  }
            }
            transition={
              isEnvelopeOpening
                ? { duration: 1.1, ease: "easeInOut" }
                : {
                    opacity: { duration: 0.6 },
                    y: { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
                  }
            }
            onClick={handleOpenLetter}
            whileHover={isEnvelopeOpening ? undefined : { scale: 1.04 }}
            whileTap={isEnvelopeOpening ? undefined : { scale: 0.97 }}
          >
            <div className="owl-glow-aura" />
            <img src="/assets/new_owl.png" className="owl-img" alt="Hogwarts messenger owl carrying scroll" />
          </motion.div>

          <motion.div
            className="letter-prompt"
            style={{ position: "relative", bottom: "auto", left: "auto", transform: "none" }}
            initial={{ opacity: 0, y: 15 }}
            animate={isEnvelopeOpening ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span>BẠN ĐÃ NHẬN ĐƯỢC THƯ MỜI CHÍNH THỨC</span>
            <p>NHẤN VÀO CHIM CÚ HOẶC CUỘN ĐỂ MỞ THƯ</p>
          </motion.div>
        </div>
      )}

      {/* ─── Accepted Phase: Full Hogwarts Letter & Lumos 2026 Landing ─── */}
      {transitionState === "accepted" && (
        <motion.div
          key="accepted-landing"
          className="accepted-landing-wrapper"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Header Navigation */}
          <header className="lumos-header">
            <div className="brand-logo">
              <span className="sparkle">✦</span> LUMOS <span>2026</span>
            </div>
            <nav className="nav-links">
              <a href="#letter">LETTER</a>
              <a href="#guilds">HOUSES</a>
              <a href="#roadmap">ROADMAP</a>
            </nav>
            <div className="header-actions">
              <ThemeToggle />
              <button className="replay-btn" onClick={handleReplayJourney} title="Replay Owl Delivery">
                <span>REPLAY</span> ↺
              </button>
              <button className="enroll-nav-btn" onClick={() => setIsModalOpen(true)}>
                <span>ENROLL</span> ✦
              </button>
            </div>
          </header>

          {/* Section 1: Hogwarts Acceptance Letter */}
          <section id="letter" className="letter-section">
            <motion.div
              className="hogwarts-parchment-card"
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="parchment-crest">
                <span className="crest-symbol">✦</span>
                <span className="crest-sub">LIÊN CHI ĐOÀN - LIÊN CHI HỘI SINH VIÊN KHOA TOÁN - TIN</span>
              </div>

              <h2 className="letter-heading">THƯ MỜI GIA NHẬP</h2>
              <div className="divider-line" />

              <div className="letter-body">
                <p className="salutation">Gửi các bạn sinh viên!</p>
                <p>
                  Một lá thư đặc biệt vừa được gửi đến bạn.<br />
                  Không đến từ Hogwarts, mà đến từ <strong>Liên chi Đoàn - Liên chi Hội Sinh viên Khoa Toán - Tin</strong> - nơi những “phù thủy” trẻ cùng nhau học hỏi, kết nối và tạo nên những điều đáng nhớ trong những năm tháng Bách khoa.
                </p>
                <p>
                  Tại đây, mỗi người đều sở hữu một “phép thuật” riêng - có người tạo nên ý tưởng, có người biến ý tưởng thành những thiết kế, có người góp sức làm nên những chương trình, và có người mang đến nguồn năng lượng để cả tập thể cùng tiến về phía trước.
                </p>
                <p>
                  Và lần này, chúng mình đang tìm kiếm những mảnh ghép mới.
                </p>
                <p>
                  <strong>LUMOS</strong> - lời gọi mở ra một hành trình mới, nơi bạn có thể thử sức, khám phá khả năng của bản thân và gặp gỡ những người đồng hành.
                </p>
                <p>
                  Không cần phải là một phù thủy tài giỏi ngay từ đầu.<br />
                  Chỉ cần bạn sẵn sàng bước vào. ✨
                </p>

                <p style={{ fontWeight: 600, marginTop: "1rem", marginBottom: "1rem" }}>
                  📜 ĐƠN TUYỂN THÀNH VIÊN LIÊN CHI ĐOÀN – LIÊN CHI HỘI SINH VIÊN KHOA TOÁN – TIN ĐÃ CHÍNH THỨC MỞ!
                </p>

                <p>
                  Cánh cửa đã mở. Bạn đã sẵn sàng trở thành một thành viên của Liên chi chưa?
                </p>

                <p className="letter-closing">
                  Thân gửi,<br />
                  <em>LCĐ – LCHSV Khoa Toán – Tin ⚡</em>
                </p>
              </div>

              <div className="letter-actions">
                <motion.button
                  className="accept-cta-btn"
                  onClick={() => setIsModalOpen(true)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>ĐĂNG KÝ GIA NHẬP NGAY</span>
                  <b>📜</b>
                </motion.button>
              </div>
            </motion.div>
          </section>

          {/* Section 2: Guilds / Houses */}
          <section id="guilds" className="guilds-section">
            {/* Background Image Layer with ~30% blur */}
            <div className="guilds-section-bg" aria-hidden="true" />
            <div className="guilds-section-overlay" aria-hidden="true" />

            <div className="section-header">
              <span className="eyebrow">CHOOSE YOUR PATH</span>
              <h2>THE FOUR MAGICAL HOUSES</h2>
              <p>Nhấn vào từng chiếc mũ Kỳ Diệu để chuyển đến trang khám phá chi tiết của mảng đó.</p>
            </div>

            {/* 4 Sorting Hats Row Navigating to /house/[id] */}
            <div className="sorting-hats-row">
              {HOUSES_DATA.map((house, idx) => (
                <Link
                  key={house.id}
                  href={`/house/${house.id}`}
                  className="sorting-hat-card-link"
                >
                  <motion.div
                    className="sorting-hat-card"
                    whileHover={reducedMotion ? undefined : { scale: 1.06, y: -8 }}
                    whileTap={reducedMotion ? undefined : { scale: 0.95 }}
                    style={
                      {
                        "--house-color": house.color,
                        "--house-glow": house.glowColor,
                      } as React.CSSProperties
                    }
                  >
                    {/* Glowing Aura backdrop */}
                    <div className="hat-aura" />

                    {/* Floating Sorting Hat Image */}
                    <motion.div
                      className="hat-img-wrapper"
                      animate={
                        reducedMotion
                          ? undefined
                          : {
                              y: [0, -12, 0],
                              rotate: [-2, 2, -2],
                            }
                      }
                      transition={{
                        duration: 3 + idx * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: idx * 0.25,
                      }}
                    >
                      <img
                        src="/assets/sorting_hat.png"
                        alt={`Mũ Kỳ Diệu ${house.houseName}`}
                        className="sorting-hat-img"
                      />
                    </motion.div>

                    {/* House Name & Mảng Title under the hat */}
                    <div className="hat-info">
                      <span
                        className="hat-house-badge"
                        style={{ color: house.color, borderColor: house.color }}
                      >
                        {house.houseName.toUpperCase()}
                      </span>
                      <h3 className="hat-mang-title">{house.title}</h3>
                      <span className="hat-enter-tag" style={{ color: house.color }}>
                        XEM CHI TIẾT <span>→</span>
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>

          {/* Section 3: Event Roadmap */}
          <section id="roadmap" className="roadmap-section">
            <div className="section-header">
              <span className="eyebrow">THE CHRONICLES</span>
              <h2>TRIWIZARD EVENT ROADMAP</h2>
              <p>Follow the beacon as your Lumos journey unfolds across four major phases.</p>
            </div>

            <div className="roadmap-timeline">
              {ROADMAP_STEPS.map((step, idx) => (
                <motion.div
                  key={idx}
                  className="roadmap-card"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                >
                  <div className="step-tag">{step.step}</div>
                  <div className="step-date">{step.date}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="lumos-footer">
            <div className="footer-content">
              <div className="footer-brand">
                <span className="sparkle">✦</span> LUMOS 2026
                <p>The Light Reveals Your Path.</p>
              </div>
              <div className="footer-links">
                <button onClick={() => setIsModalOpen(true)}>Enroll Now</button>
                <button onClick={handleReplayJourney}>Replay Intro</button>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© 2026 LUMOS Spellcraft Academy. All rights reserved.</p>
            </div>
          </footer>
        </motion.div>
      )}

      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialDepartmentId={selectedGuild}
      />
    </main>
  );
}
