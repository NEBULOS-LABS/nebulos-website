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

    // Lock the initial visual state so the card never flashes at full width.
    // ScrollTrigger auto-disables immediateRender when the trigger hasn't
    // been reached, so gsap.set() fills the gap until the entry scrub activates.
    gsap.set(card1Ref.current, { scale: 0.9, borderRadius: PEAK.radius });

    // Entry: scales up from 0.9 → 1.0 as the section scrolls into view
    gsap.fromTo(card1Ref.current,
      { scale: 0.9, borderRadius: PEAK.radius },
      {
        scale: 1,
        borderRadius: FLAT_RADIUS,
        force3D: true,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top-=80 bottom",
          end: "top 15%",
          scrub: 0.6,
        }
      }
    );

    // Pinned ramp: scroll freezes, card gradually tilts from flat to ramp angle.
    // FROM vars intentionally omit scale/borderRadius — those are inherited from
    // the completed entry animation. Including them here would cause the pin's
    // internal layout measurement to render FROM values (scale:1) immediately,
    // overriding the entry animation's in-progress state and producing a flash.
    gsap.fromTo(card1Ref.current,
      { rotateX: 0, y: 0, transformPerspective: PERSPECTIVE },
      {
        scale: RAMP.scale,
        borderRadius: RAMP.radius,
        rotateX: -RAMP.angle,
        y: -RAMP.y,
        transformPerspective: PERSPECTIVE,
        force3D: true,
        immediateRender: false,
        scrollTrigger: {
          trigger: card1Ref.current,
          start: "bottom bottom",
          end: `+=${PIN_DISTANCE}`,
          pin: card1WrapperRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.6,
        }
      }
    );

    // Exit rotation: after unpin, card continues tilting and receding.
    // Uses the marker div (positioned after the pin-spacer in DOM) as trigger
    // to avoid overlapping with the pin animation's scroll range.
    gsap.fromTo(card1Ref.current,
      { scale: RAMP.scale, borderRadius: RAMP.radius, rotateX: -RAMP.angle, y: -RAMP.y, transformPerspective: PERSPECTIVE },
      {
        scale: PEAK.scale,
        borderRadius: PEAK.radius,
        rotateX: -PEAK.angle,
        y: -PEAK.y,
        transformPerspective: PERSPECTIVE,
        force3D: true,
        immediateRender: false,
        scrollTrigger: {
          trigger: "#end-of-problem-marker",
          start: "top bottom",
          end: "top top",
          scrub: 0.6,
        }
      }
    );

    // ── CARD 2 (Solution) — Mirror ───────────────────────────────────

    // Entry: scrolls in from peak rotation, reducing toward ramp angle
    gsap.fromTo(card2Ref.current,
      { scale: PEAK.scale, borderRadius: PEAK.radius, rotateX: PEAK.angle, transformPerspective: PERSPECTIVE },
      {
        scale: RAMP.scale,
        borderRadius: RAMP.radius,
        rotateX: RAMP.angle,
        transformPerspective: PERSPECTIVE,
        force3D: true,
        scrollTrigger: {
          trigger: card2WrapperRef.current,
          start: "top-=200 bottom",
          end: "top 20%",
          scrub: 0.6,
        }
      }
    );

    // Pinned flatten: scroll freezes, card settles from ramp angle to flat.
    // FROM vars intentionally omit scale/borderRadius — inherited from entry.
    gsap.fromTo(card2Ref.current,
      { rotateX: RAMP.angle, transformPerspective: PERSPECTIVE },
      {
        scale: 1,
        borderRadius: FLAT_RADIUS,
        rotateX: 0,
        force3D: true,
        immediateRender: false,
        scrollTrigger: {
          trigger: card2Ref.current,
          start: "top top",
          end: `+=${PIN_DISTANCE}`,
          pin: card2WrapperRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.6,
        }
      }
    );

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative w-full z-10"
    >
      {/* Card 1: Problem Section */}
      <div ref={card1WrapperRef} className="relative w-full z-10 -mt-16 -mb-40">
        <div
          className="relative w-full overflow-hidden origin-bottom border-x border-b border-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_30px_60px_-15px_rgba(0,238,255,0.08),0_30px_60px_-15px_rgba(153,0,255,0.08),20px_0_40px_-12px_rgba(255,255,255,0.04),-20px_0_40px_-12px_rgba(255,255,255,0.04),0_4px_20px_-4px_rgba(255,255,255,0.12)] transform-gpu z-10"
          style={{ transform: 'scale(0.9)', borderRadius: '64px' }}
          ref={card1Ref}
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
          className="relative w-full overflow-hidden origin-top border-x border-t border-white/[0.1] border-t-white/[0.15] shadow-[0_-20px_50px_rgba(0,0,0,0.5),0_0_60px_rgba(0,238,255,0.06),0_0_60px_rgba(153,0,255,0.06),20px_0_40px_-12px_rgba(255,255,255,0.04),-20px_0_40px_-12px_rgba(255,255,255,0.04),0_-4px_20px_-4px_rgba(255,255,255,0.12)] transform-gpu z-10"
          ref={card2Ref}
        >
          <Solution />
        </div>
      </div>

    </div>
  );
}
