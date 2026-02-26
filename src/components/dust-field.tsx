"use client";

import React, { useRef, useEffect, useCallback } from "react";

/* ─── Types ─────────────────────────────────────────────────────────── */

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  phase: number;
  speed: number;
  drift: number;
}

interface DustFieldProps {
  pointerRef: React.RefObject<{ nx: number; ny: number }>;
  depthProxyRef: React.RefObject<{
    dustOpacity: number;
    pointerInfluence: number;
  }>;
  enabled: boolean;
  className?: string;
}

/* ─── Constants ─────────────────────────────────────────────────────── */

const BASE_COUNT = 80;
const LOW_END_COUNT = 40;
const NEAR_PLANE_PARALLAX = 55;

/* ─── Component ─────────────────────────────────────────────────────── */

export default function DustField({
  pointerRef,
  depthProxyRef,
  enabled,
  className,
}: DustFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const isVisibleRef = useRef(true);
  const isTabVisibleRef = useRef(true);
  const startTimeRef = useRef(0);

  const initParticles = useCallback(() => {
    const count =
      typeof navigator !== "undefined" && navigator.hardwareConcurrency <= 4
        ? LOW_END_COUNT
        : BASE_COUNT;

    particlesRef.current = Array.from({ length: count }, () => {
      const rawX = Math.random();
      const x = rawX * rawX * 0.7 + Math.random() * 0.3;

      return {
        x: Math.min(x, 1),
        y: Math.random(),
        size: 1 + Math.random() * 3,
        opacity: x > 0.6 ? 0.02 + Math.random() * 0.04 : 0.04 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
        drift: 8 + Math.random() * 16,
      };
    });
  }, []);

  const renderLoop = useCallback(() => {
    if (!isVisibleRef.current || !isTabVisibleRef.current) {
      rafRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const now = performance.now() * 0.001;
    if (startTimeRef.current === 0) startTimeRef.current = now;
    const t = now - startTimeRef.current;

    const w = canvas.width;
    const h = canvas.height;

    const { nx, ny } = pointerRef.current ?? { nx: 0, ny: 0 };
    const proxy = depthProxyRef.current ?? { dustOpacity: 0, pointerInfluence: 0 };
    const globalOpacity = proxy.dustOpacity;
    const influence = proxy.pointerInfluence;

    ctx.clearRect(0, 0, w, h);

    if (globalOpacity <= 0.001) {
      rafRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    ctx.globalCompositeOperation = "lighter";

    particlesRef.current.forEach((p) => {
      const period = (1 / p.speed) * 18;
      const driftX = Math.sin(t / period + p.phase) * p.drift;
      const driftY = Math.cos(t / period * 0.7 + p.phase * 1.3) * p.drift * 0.6;

      const parallaxX = nx * NEAR_PLANE_PARALLAX * influence;
      const parallaxY = ny * NEAR_PLANE_PARALLAX * 0.7 * influence;

      const px = p.x * w + driftX + parallaxX;
      const py = p.y * h + driftY + parallaxY;

      const r = p.size * (typeof window !== "undefined" && window.devicePixelRatio > 1 ? 1.5 : 1);
      const alpha = p.opacity * globalOpacity;

      if (alpha < 0.002) return;

      const grad = ctx.createRadialGradient(px, py, 0, px, py, r * 2);
      grad.addColorStop(0, `rgba(200, 230, 255, ${alpha})`);
      grad.addColorStop(0.4, `rgba(150, 210, 255, ${alpha * 0.6})`);
      grad.addColorStop(1, `rgba(100, 180, 255, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, r * 2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalCompositeOperation = "source-over";

    rafRef.current = requestAnimationFrame(renderLoop);
  }, [pointerRef, depthProxyRef]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    initParticles();
    handleResize();

    const resizeObs = new ResizeObserver(handleResize);
    resizeObs.observe(canvas);

    const intObs = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    intObs.observe(canvas);

    const onVis = () => {
      isTabVisibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);

    startTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObs.disconnect();
      intObs.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [enabled, initParticles, handleResize, renderLoop]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
