"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import GlassFlow from "@/components/glass-flow";
import Solution from "@/components/solution";
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

  // Track scroll over the combined hero + clients + problem container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Opacity transitions: 0.8 during hero, drops to 0.70 for clients/problem, fades to 0 at the end
  const videoOpacity = useTransform(scrollYProgress, [0, 0.4, 0.9, 1], [0.8, 0.70, 0.70, 0]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  return (
    <main className="overflow-hidden bg-black text-white">
      <Navbar />

      <div ref={containerRef} className="relative w-full">
        {/* Global Fixed Video Background */}
        <div className="fixed top-0 left-0 w-full h-screen overflow-hidden z-0 pointer-events-none">
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

        {/* Overlapping Content Container */}
        <div className="relative z-10 w-full">
          {/* Hero Section */}
          <Hero />

          <GlassFlow />
        </div>
      </div>

      {/* Solution Section */}
      <Solution />

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
