"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const magnetCoreRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<any>(null);
  const yTo = useRef<any>(null);
  const xToText = useRef<any>(null);
  const yToText = useRef<any>(null);

  useGSAP(() => {
    // Hero entry stagger animation
    gsap.fromTo(".hero-anim", 
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      }
    );

    // Magnetic quickTo setup
    xTo.current = gsap.quickTo(magnetCoreRef.current, "x", {duration: 0.6, ease: "elastic.out(1, 0.3)"});
    yTo.current = gsap.quickTo(magnetCoreRef.current, "y", {duration: 0.6, ease: "elastic.out(1, 0.3)"});
    xToText.current = gsap.quickTo(".cta-text", "x", {duration: 0.6, ease: "elastic.out(1, 0.3)"});
    yToText.current = gsap.quickTo(".cta-text", "y", {duration: 0.6, ease: "elastic.out(1, 0.3)"});

  }, { scope: containerRef });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ctaRef.current || !xTo.current || !yTo.current || !xToText.current || !yToText.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ctaRef.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    // Move the core significantly, move the text slightly
    xTo.current(x * 0.4);
    yTo.current(y * 0.4);
    xToText.current(x * 0.15);
    yToText.current(y * 0.15);
  };

  const handleMouseLeave = () => {
    if (xTo.current && yTo.current && xToText.current && yToText.current) {
      xTo.current(0);
      yTo.current(0);
      xToText.current(0);
      yToText.current(0);
    }
    
    gsap.to(".cta-orbit-outer", { scale: 1, opacity: 0.5, borderColor: "rgba(0, 238, 255, 0.3)", duration: 0.5 });
    gsap.to(".cta-orbit-inner", { scale: 1, opacity: 0.3, borderColor: "rgba(255, 0, 255, 0.2)", duration: 0.5 });
    gsap.to(".cta-bg", { opacity: 0, duration: 0.5 });
    gsap.to(".cta-button", { backgroundColor: "rgba(0, 0, 0, 0.4)", borderColor: "rgba(255, 255, 255, 0.2)", boxShadow: "0 0 0 rgba(0,238,255,0)", duration: 0.5 });
    
    gsap.to(".cta-arrow", { x: 0, y: 0, opacity: 0.9, color: "white", duration: 0.5 });
    gsap.to(".cta-text", { letterSpacing: "0.25em", color: "rgba(255, 255, 255, 0.6)", duration: 0.5 });
  };

  const handleMouseEnter = () => {
    gsap.to(".cta-orbit-outer", { scale: 1.1, opacity: 1, borderColor: "rgba(0, 238, 255, 0.6)", duration: 0.5 });
    gsap.to(".cta-orbit-inner", { scale: 1.05, opacity: 0.8, borderColor: "rgba(255, 0, 255, 0.6)", duration: 0.5 });
    gsap.to(".cta-bg", { opacity: 1, duration: 0.5 });
    gsap.to(".cta-button", { backgroundColor: "rgba(0, 0, 0, 0.6)", borderColor: "rgba(0, 238, 255, 0.5)", boxShadow: "0 0 40px rgba(0,238,255,0.3)", duration: 0.5 });
    
    gsap.to(".cta-text", { letterSpacing: "0.3em", color: "#00eeff", duration: 0.5 });
    
    const tl = gsap.timeline();
    tl.to(".cta-arrow", { x: 20, y: -20, opacity: 0, duration: 0.25, ease: "power2.in" })
      .set(".cta-arrow", { x: -20, y: 20 })
      .to(".cta-arrow", { x: 0, y: 0, opacity: 1, color: "#00eeff", duration: 0.5, ease: "elastic.out(1, 0.5)" });
  };

  // No internal stickiness or useScroll needed because it flows naturally over the global video background!
  
  return (
    <div ref={containerRef} className="relative min-h-[90vh] bg-transparent flex flex-col items-center justify-center pt-32 pb-20">
      <div className="relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10">
          <div className="mx-auto max-w-[1400px] text-center flex flex-col items-center">
            <h1
              className="hero-anim opacity-0 font-black tracking-tighter text-white uppercase leading-[0.85] text-6xl sm:text-8xl md:text-[9rem] lg:text-[10rem] drop-shadow-2xl"
              style={{ textShadow: "0 20px 60px rgba(0,0,0,0.8)", transform: "translateY(20px)" }}
            >
              Ship <span className="relative inline-block italic pr-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">Faster.</span>
                <svg 
                  className="absolute -top-2 lg:-top-6 -right-4 lg:-right-8 w-12 h-12 lg:w-20 lg:h-20 text-[#00eeff] opacity-70"
                  viewBox="0 0 100 100" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                >
                  <path d="M 10 90 L 90 10 M 30 90 L 100 20 M 60 90 L 110 40" className="animate-pulse" style={{ transformOrigin: 'center', transform: 'rotate(15deg) scaleX(1.2)' }} />
                </svg>
              </span>
            </h1>
            
            <h2
              className="hero-anim opacity-0 mt-6 font-bold tracking-tight text-white/90 text-2xl sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-xl"
              style={{ transform: "translateY(20px)" }}
            >
              World-class software in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#00EEFF] italic drop-shadow-[0_0_20px_rgba(0,255,255,0.7)]">weeks, not quarters.</span>
            </h2>

          <p
            className="hero-anim opacity-0 mt-10 text-lg sm:text-xl leading-8 text-gray-300 max-w-2xl mx-auto font-medium"
            style={{ transform: "translateY(20px)" }}
          >
            We design, build, and scale revenue‑driving products—websites, SaaS
            platforms, mobile apps, and complex engineering systems—using elite
            talent, AI‑accelerated workflows, and a guarantee that puts all the
            risk on us.
          </p>

          <div
            className="hero-anim opacity-0 mt-20 flex items-center justify-center p-8 overflow-hidden"
            style={{ transform: "translateY(20px)" }}
          >
            <Link 
              href="#contact"
              ref={ctaRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseEnter}
              className="flex flex-col items-center gap-2 relative z-20 cursor-pointer"
            >
              <div className="relative flex items-center justify-center p-4">
                {/* Outer orbital rings (Novel Design Element) */}
                <div 
                  className="cta-orbit-outer absolute inset-0 rounded-full border border-dashed opacity-50 border-[#00eeff]/30 animate-[spin_12s_linear_infinite]" 
                />
                <div 
                  className="cta-orbit-inner absolute inset-2 rounded-full border opacity-30 border-[#ff00ff]/20 animate-[spin_8s_linear_infinite_reverse]" 
                />
                
                {/* Core Button */}
                <div 
                  ref={magnetCoreRef}
                  className="cta-button flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-white/20 bg-black/40 backdrop-blur-md relative z-10 overflow-hidden shadow-none"
                >
                  <div className="cta-bg absolute inset-0 bg-gradient-to-tr from-[#00eeff]/20 via-transparent to-[#ff00ff]/20 opacity-0" />
                  
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="32" height="32" viewBox="0 0 24 24" fill="none" 
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" 
                    className="cta-arrow text-white opacity-90 sm:w-10 sm:h-10 drop-shadow-lg relative z-20"
                  >
                    <path d="M7 17l9.2-9.2M17 17V7H7"/>
                  </svg>
                </div>
              </div>
              
              <span className="cta-text text-white/60 font-medium tracking-[0.25em] text-xs sm:text-sm uppercase mt-4 block">
                Start Your Project
              </span>
            </Link>
          </div>

          </div>
        </div>
    </div>
  );
}
