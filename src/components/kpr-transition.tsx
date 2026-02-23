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
  const cover1Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Card 1 enters from 0.9 width and rough corners, then expands to 1.0 and sharp corners
    gsap.fromTo(card1Ref.current,
      { scale: 0.9, borderRadius: "48px" },
      {
        scale: 1,
        borderRadius: "0px",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "top top",
          scrub: true,
        }
      }
    );

    // The KPR-Verse Stacked scroll gap logic:
    // Card 1 shrinks back down, corners round off, and rotates to create the carousel inflection angle
    gsap.to(card1Ref.current, {
      scale: 0.88,
      borderRadius: "48px",
      rotateX: -4,
      transformPerspective: 1000,
      y: -50,
      scrollTrigger: {
        trigger: card1Ref.current,
        start: "bottom bottom", 
        end: "bottom top", 
        scrub: true,
      }
    });

    // Fade in a solid black backdrop exactly behind Card 1 to hide peaking background videos
    gsap.fromTo(cover1Ref.current,
      { opacity: 0 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: card1Ref.current,
          start: "bottom bottom",
          end: "bottom 50%", // aggressively hide the background early
          scrub: true,
        }
      }
    );

    // Card 2 enters from bottom, scaled down, then grows to fill the horizontal bounds
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
      {/* Card 1: Problem Section with Cover for Peaking */}
      <div className="relative w-full z-10">
        <div 
          ref={cover1Ref} 
          className="absolute inset-0 bg-black pointer-events-none z-0" 
        />
        <div 
          className="relative w-full overflow-hidden origin-bottom shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform-gpu z-10" 
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
      <div
        className="relative w-full overflow-hidden origin-bottom -mt-40 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] border-t-[#00eeff]/25 shadow-[0_-20px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] transform-gpu z-10"
        ref={card2Ref}
      >
        <Solution />
      </div>

    </div>
  );
}
