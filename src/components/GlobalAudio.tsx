"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export default function GlobalAudio() {
  const reducedMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  /* Fade volume helper */
  const fadeVolume = useCallback((target: number, durationMs = 800) => {
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
  }, []);

  /* Auto-play ambient sound after first user interaction */
  useEffect(() => {
    const startAudio = () => {
      if (hasInteracted) return;
      setHasInteracted(true);
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0;
        audio
          .play()
          .then(() => {
            setIsMuted(false);
            fadeVolume(0.45, 1200);
          })
          .catch(() => {
            /* blocked by browser policy */
          });
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
      audio
        .play()
        .then(() => {
          fadeVolume(0.45, 600);
          setIsMuted(false);
        })
        .catch(() => {});
    } else {
      fadeVolume(0, 500);
      setTimeout(() => {
        audio.pause();
        setIsMuted(true);
      }, 520);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/assets/ambient.mp3" loop preload="auto" />

      <motion.button
        className={`sound-toggle${isMuted ? " is-muted" : ""}`}
        onClick={toggleSound}
        aria-label={isMuted ? "Unmute ambient sound" : "Mute ambient sound"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        whileHover={reducedMotion ? undefined : { scale: 1.08 }}
        whileTap={reducedMotion ? undefined : { scale: 0.95 }}
      >
        <span className="sound-label">{isMuted ? "PLAY MUSIC" : "MUTE"}</span>
        {isMuted ? (
          <svg viewBox="0 0 24 24">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </motion.button>
    </>
  );
}
