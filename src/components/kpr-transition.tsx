"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassFlow from "./glass-flow";
import Solution from "./solution";

gsap.registerPlugin(ScrollTrigger);

export default function KprTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card1WrapperRef = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card2WrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Symmetric constants shared by both cards
    const PERSPECTIVE = 800;
    const PIN_DISTANCE = 300;
    const FLAT_RADIUS = "24px";
    const RAMP  = { scale: 0.95, radius: "40px", angle: 3, y: 15 };
    const PEAK  = { scale: 0.8,  radius: "64px", angle: 10, y: 70 };

    // ── CARD 1 (Problem) ─────────────────────────────────────────────

    // Entry: scale up and soften corners as section scrolls into view.
    // immediateRender: true ensures card starts at scale 0.9 before any scroll.
    gsap.fromTo(card1Ref.current,
      { scale: 0.9, borderRadius: PEAK.radius },
      {
        scale: 1,
        borderRadius: FLAT_RADIUS,
        force3D: true,
        immediateRender: true,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top-=80 bottom",
          end: "top 15%",
          scrub: 0.6,
        }
      }
    );

    // Pinned ramp: freeze scroll, gradually introduce tilt.
    // gsap.to() avoids competing `from` values that override the entry.
    // invalidateOnRefresh re-captures start values when the trigger activates,
    // so it correctly picks up the entry's end state (scale 1, radius 24px).
    gsap.to(card1Ref.current, {
      scale: RAMP.scale,
      borderRadius: RAMP.radius,
      rotateX: -RAMP.angle,
      y: -RAMP.y,
      transformPerspective: PERSPECTIVE,
      force3D: true,
      scrollTrigger: {
        trigger: card1Ref.current,
        start: "bottom bottom",
        end: `+=${PIN_DISTANCE}`,
        pin: card1WrapperRef.current,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.6,
        invalidateOnRefresh: true,
      }
    });

    // Exit: continue rotation after unpin
    gsap.to(card1Ref.current, {
      scale: PEAK.scale,
      borderRadius: PEAK.radius,
      rotateX: -PEAK.angle,
      y: -PEAK.y,
      transformPerspective: PERSPECTIVE,
      force3D: true,
      scrollTrigger: {
        trigger: card1Ref.current,
        start: "bottom bottom",
        end: "bottom top",
        scrub: 0.6,
        invalidateOnRefresh: true,
      }
    });

    // ── CARD 2 (Solution) — Mirror ───────────────────────────────────

    // Entry: scroll in with rotation, reducing from peak toward ramp
    gsap.fromTo(card2Ref.current,
      { scale: PEAK.scale, borderRadius: PEAK.radius, rotateX: PEAK.angle, transformPerspective: PERSPECTIVE },
      {
        scale: RAMP.scale,
        borderRadius: RAMP.radius,
        rotateX: RAMP.angle,
        transformPerspective: PERSPECTIVE,
        force3D: true,
        immediateRender: true,
        scrollTrigger: {
          trigger: card2WrapperRef.current,
          start: "top-=200 bottom",
          end: "top 20%",
          scrub: 0.6,
        }
      }
    );

    // Pinned flatten: freeze scroll, settle from ramp to flat.
    // gsap.to() with invalidateOnRefresh captures the entry's end state.
    gsap.to(card2Ref.current, {
      scale: 1,
      borderRadius: FLAT_RADIUS,
      rotateX: 0,
      force3D: true,
      scrollTrigger: {
        trigger: card2Ref.current,
        start: "top top",
        end: `+=${PIN_DISTANCE}`,
        pin: card2WrapperRef.current,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.6,
        invalidateOnRefresh: true,
      }
    });

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative w-full z-10"
    >
      {/* Card 1: Problem Section */}
      <div ref={card1WrapperRef} className="relative w-full z-10 -mt-16 -mb-40">
        <div
          className="relative w-full overflow-hidden origin-bottom border-x border-b border-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_30px_60px_-15px_rgba(0,238,255,0.08),0_30px_60px_-15px_rgba(153,0,255,0.08),20px_0_40px_-12px_rgba(255,255,255,0.04),-20px_0_40px_-12px_rgba(255,255,255,0.04),0_4px_20px_-4px_rgba(255,255,255,0.12)] z-10"
          ref={card1Ref}
          style={{ transform: "scale(0.9)", borderRadius: "64px" }}
        >
          <GlassFlow />
        </div>
      </div>

      <div id="end-of-problem-marker" className="w-full h-px opacity-0 pointer-events-none relative z-0" />

      {/* The Cinematic Video Gap */}
      <div className="relative isolate w-full aspect-[21/9] md:aspect-video max-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-black z-0 pointer-events-none">
        <video
          src="/images/nebula_cloud_V2.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-150"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80" />
        <h1 className="relative z-10 text-[18vw] font-black tracking-tighter text-white/35 uppercase select-none mix-blend-overlay">
          NEBULOS
        </h1>
      </div>

      {/* Card 2: Solution Section */}
      <div ref={card2WrapperRef} className="relative w-full z-10 -mt-40">
        <div
          className="relative w-full overflow-hidden origin-top border-x border-t border-white/[0.1] border-t-white/[0.15] shadow-[0_-20px_50px_rgba(0,0,0,0.5),0_0_60px_rgba(0,238,255,0.06),0_0_60px_rgba(153,0,255,0.06),20px_0_40px_-12px_rgba(255,255,255,0.04),-20px_0_40px_-12px_rgba(255,255,255,0.04),0_-4px_20px_-4px_rgba(255,255,255,0.12)] z-10"
          ref={card2Ref}
        >
          <Solution />
        </div>
      </div>

    </div>
  );
}
