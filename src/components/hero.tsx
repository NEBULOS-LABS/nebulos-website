"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // No internal stickiness or useScroll needed because it flows naturally over the global video background!
  
  return (
    <div className="relative min-h-[90vh] bg-transparent flex flex-col items-center justify-center pt-32 pb-20">
      <div className="relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="show"
            viewport={{ once: true, amount: 0.25 }}
            className="mx-auto max-w-[1400px] text-center flex flex-col items-center"
          >
            <motion.h1
              variants={fadeIn("up")}
              className="font-black tracking-tighter text-white uppercase leading-[0.85] text-6xl sm:text-8xl md:text-[9rem] lg:text-[10rem] drop-shadow-2xl"
              style={{ textShadow: "0 20px 60px rgba(0,0,0,0.8)" }}
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
            </motion.h1>
            
            <motion.h2
              variants={fadeIn("up", 0.1)}
              className="mt-6 font-bold tracking-tight text-white/90 text-2xl sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-xl"
            >
              World-class software in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#00EEFF] italic drop-shadow-[0_0_20px_rgba(0,255,255,0.7)]">weeks, not quarters.</span>
            </motion.h2>

          <motion.p
            variants={fadeIn("up", 0.2)}
            className="mt-10 text-lg sm:text-xl leading-8 text-gray-300 max-w-2xl mx-auto font-medium"
          >
            We design, build, and scale revenue‑driving products—websites, SaaS
            platforms, mobile apps, and complex engineering systems—using elite
            talent, AI‑accelerated workflows, and a guarantee that puts all the
            risk on us.
          </motion.p>

          <motion.div
            variants={fadeIn("up", 0.3)}
            className="mt-16 flex items-center justify-center"
          >
            <Link href="#contact" className="group flex flex-col items-center gap-2 relative">
              <div className="relative flex items-center justify-center p-4">
                {/* Outer orbital rings (Novel Design Element) */}
                <div className="absolute inset-0 rounded-full border border-dashed border-[#00eeff]/30 opacity-50 group-hover:opacity-100 group-hover:scale-110 group-hover:border-[#00eeff]/60 transition-all duration-700 animate-[spin_12s_linear_infinite]" />
                <div className="absolute inset-2 rounded-full border border-[#ff00ff]/20 opacity-30 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 animate-[spin_8s_linear_infinite_reverse]" />
                
                {/* Core Button */}
                <div className="flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-white/20 bg-black/40 backdrop-blur-md hover:bg-black/60 hover:border-[#00eeff]/50 transition-all duration-700 hover:shadow-[0_0_40px_rgba(0,238,255,0.3)] relative z-10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#00eeff]/20 via-transparent to-[#ff00ff]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-90 group-hover:text-[#00eeff] group-hover:translate-x-1.5 sm:w-10 sm:h-10 group-hover:-translate-y-1.5 transition-all duration-500 drop-shadow-lg"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                </div>
              </div>
              
              <span className="text-white/60 font-medium tracking-[0.25em] text-xs sm:text-sm uppercase group-hover:text-[#00eeff] group-hover:tracking-[0.3em] transition-all duration-[800ms] mt-4">
                Start Your Project
              </span>
            </Link>
          </motion.div>

          </motion.div>
        </div>
    </div>
  );
}
