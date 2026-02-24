"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import KprTransition from "@/components/kpr-transition";
import Testimonials from "@/components/testimonials";
import Process from "@/components/process";
import Services from "@/components/services";
import Guarantee from "@/components/guarantee";
import FAQ from "@/components/faq";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import Bento3Section from "@/components/ui/bento-monochrome-1";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoHeight, setVideoHeight] = useState("100vh");

  // Track scroll over the combined hero + clients + problem container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Opacity transitions: perfectly visible during hero and problem sections, explicitly fades to 0 in the last 25% of the problem section scroll.
  const videoOpacity = useTransform(scrollYProgress, [0, 0.3, 0.75, 0.9], [0.8, 0.8, 0.8, 0]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }

    const updateHeight = () => {
      const marker = document.getElementById("end-of-problem-marker");
      if (marker && containerRef.current) {
        // Calculate dynamic scroll boundary to precisely match the bottom of the Problem Section
        const containerRect = containerRef.current.getBoundingClientRect();
        const markerRect = marker.getBoundingClientRect();
        setVideoHeight(`${markerRect.top - containerRect.top}px`);
      }
    };

    updateHeight();
    
    // Observer for layout shifts when images load or components mount
    const observer = new ResizeObserver(() => updateHeight());
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener('resize', updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  return (
    <main className="bg-black text-white">
      <Navbar />

      <div ref={containerRef} className="relative w-full">
        {/* Global Video Background - Now bound precisely to hit the boundary of the Problem Section */}
        <div 
          className="absolute top-0 left-0 w-full z-0 pointer-events-none"
          style={{ height: videoHeight }}
        >
          <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-black"
            style={{ opacity: videoOpacity }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/40 via-transparent to-transparent z-10" />
            <video
              ref={videoRef}
              src="/images/nebula_cloud.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-80"
            />
          </motion.div>
          </div>
        </div>

        {/* Overlapping Content Container */}
        <div className="relative z-10 w-full">
          {/* Hero Section */}
          <Hero />

          {/* KPR-Verse Transition replacing sequential GlassFlow and Solution */}
          <KprTransition />
        </div>
      </div>

      {/* Social Proof Section */}
      <Testimonials />

      {/* Process / Bento Workflow Section */}
      <Bento3Section />

      {/* Guarantee Section */}
      <Guarantee />

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Section */}
      <Contact />

      <Footer />
    </main>
  );
}
