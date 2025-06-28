"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { BentoDemo } from "@/components/ui/bento-demo";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WhatWeBuild() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Animate bento cards with staggered entrance
      gsap.fromTo(
        ".bento-card",
        {
          y: 60,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bentoRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate stats on scroll
      gsap.fromTo(
        ".stat-number",
        { textContent: 0 },
        {
          textContent: (i, target) => target.dataset.count,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: ".stats-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="what-we-build"
      className="relative bg-black overflow-hidden py-20 lg:py-28"
    >
      {/* Design elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute left-1/4 top-1/4 w-80 h-80 bg-[#9900ff]/20 blur-[100px] rounded-full" />
      <div className="absolute right-1/4 bottom-1/4 w-80 h-80 bg-[#00eeff]/20 blur-[100px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div
            variants={fadeIn("up")}
            className="mx-auto max-w-4xl text-center mb-16"
          >
            <h2 className="section-title">
              What We{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#00eeff]">
                Build
              </span>
            </h2>
            <p className="text-lg text-gray-300 mt-6 max-w-3xl mx-auto">
              From concept to launch, we create digital experiences that drive
              growth.
              <span className="text-white font-semibold">
                {" "}
                Over 120+ successful projects delivered.
              </span>
            </p>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ff00ff]"></div>
                <span>Money-Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00eeff]"></div>
                <span>Fixed-Price Projects</span>
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={fadeIn("up", 0.1)}
            className="stats-section grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                <span className="stat-number" data-count="120">
                  0
                </span>
                +
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Projects Delivered
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#ff00ff]">
                <span className="stat-number" data-count="3">
                  0
                </span>
                x
              </div>
              <div className="text-sm text-gray-400 mt-1">Faster Delivery</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00eeff]">
                <span className="stat-number" data-count="38">
                  0
                </span>
                %
              </div>
              <div className="text-sm text-gray-400 mt-1">Fewer Bugs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                <span className="stat-number" data-count="99">
                  0
                </span>
                .9%
              </div>
              <div className="text-sm text-gray-400 mt-1">Uptime SLA</div>
            </div>
          </motion.div>

          <motion.div
            ref={bentoRef}
            variants={fadeIn("up", 0.2)}
            className="max-w-6xl mx-auto"
          >
            <BentoDemo />
          </motion.div>

          {/* Enhanced Call to action */}
          <motion.div
            variants={fadeIn("up", 0.4)}
            className="text-center mt-20"
          >
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to 3x Your Development Speed?
              </h3>
              <p className="text-gray-400 mb-8">
                Join 120+ companies who've transformed their digital presence
                with our AI-accelerated delivery framework.
                <span className="block mt-2 text-[#ff00ff] font-semibold">
                  ⚡ Free strategy call • 💰 Money-back guarantee • 🚀 Start in
                  48 hours
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <a
                  href="#contact"
                  className="btn-primary-lg inline-flex items-center group"
                >
                  <span>Book Free Strategy Call</span>
                  <svg
                    className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>

                <div className="text-sm text-gray-500">
                  <div>
                    🔥 <span className="text-[#ff00ff]">23 calls</span> booked
                    this week
                  </div>
                  <div className="mt-1">
                    ⏰ Next available: Tomorrow at 2 PM
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
