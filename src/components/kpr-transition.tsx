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
  const card2Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // ── Card 1 Entry ──
    // Scales up from 0.9 to 1.0 and corners sharpen as the section scrolls into view.
    gsap.fromTo(card1Ref.current,
      { scale: 0.9, borderRadius: "48px" },
      {
        scale: 1,
        borderRadius: "0px",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top-=80 bottom",
          end: "top 15%",
          scrub: true,
        }
      }
    );

    // ── Card 1 Exit (Timeline) ──
    // A single timeline with two phases avoids conflicting tweens on the same properties.
    // Phase 1 (first 60% of scroll): gentle ramp into the rotation starting angle.
    // Phase 2 (last 40% of scroll): accelerates into the full carousel rotation.
    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: card1Ref.current,
        start: "85% bottom",
        end: "bottom top",
        scrub: true,
      }
    });

    exitTl.to(card1Ref.current, {
      scale: 0.96,
      borderRadius: "20px",
      rotateX: -1,
      transformPerspective: 1000,
      y: -15,
      duration: 0.6,
    });

    exitTl.to(card1Ref.current, {
      scale: 0.88,
      borderRadius: "48px",
      rotateX: -4,
      transformPerspective: 1000,
      y: -50,
      duration: 0.4,
    });

    // ── Card 2 Entry ──
    // Solution section scales up and flattens as it scrolls into view.
    gsap.fromTo(card2Ref.current,
      { scale: 0.88, borderRadius: "48px", rotateX: 2, transformPerspective: 1000 },
      {
        scale: 1,
        borderRadius: "0px",
        rotateX: 0,
        scrollTrigger: {
          trigger: card2Ref.current,
          start: "top-=200 bottom",
          end: "top top",
          scrub: true,
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
      <div className="relative w-full z-10 -mt-16 -mb-28">
        <div
          className="relative w-full overflow-hidden origin-bottom bg-black/90 backdrop-blur-xl border border-white/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_80px_rgba(0,238,255,0.04),0_0_80px_rgba(153,0,255,0.04)] transform-gpu z-10"
          ref={card1Ref}
        >
          <GlassFlow />
        </div>
      </div>

      <div id="end-of-problem-marker" className="absolute w-full h-px opacity-0 pointer-events-none" />

      {/* The Cinematic Video Gap */}
      <div className="relative w-full aspect-[21/9] md:aspect-video max-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-black z-0 pointer-events-none">
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
      <div className="relative w-full z-10 -mt-40">
        <div
          className="relative w-full overflow-hidden origin-top bg-black/90 backdrop-blur-xl border border-white/[0.06] shadow-[0_-20px_50px_rgba(0,0,0,0.5),0_0_80px_rgba(0,238,255,0.04),0_0_80px_rgba(153,0,255,0.04)] transform-gpu z-10"
          ref={card2Ref}
        >
          <Solution />
        </div>
      </div>

    </div>
  );
}
