"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function Guarantee() {
  const guaranteePoints = [
    "If we don't meet our commitments in any sprint, you don't pay for that sprint.",
    "Zero payment until you approve each sprint's deliverables—you stay in complete control.",
    "Code quality guarantee: We fix bugs free, for life.",
    "All IP is 100% yours from day one—no strings attached.",
  ];

  return (
    <section
      id="guarantee"
      className="relative bg-black overflow-hidden py-20 lg:py-28"
    >
      {/* Design elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#ff00ff]/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#9900ff]/20 blur-[100px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div
            variants={fadeIn("up")}
            className="mx-auto max-w-3xl text-center mb-16"
          >
            <h2 className="section-title">The Sprint-Back Guarantee</h2>
            <p className="section-subtitle mt-6">
              We take all the risk, so you don't have to.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Guarantee badge - Left side on desktop */}
            <motion.div
              variants={fadeIn("right", 0.1)}
              className="lg:col-span-2 order-2 lg:order-1"
            >
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#00eeff] opacity-30 blur-lg rounded-full animate-pulse" />
                <div className="relative w-full h-full bg-black/50 backdrop-blur-sm rounded-full border-4 border-[#ff00ff] flex flex-col items-center justify-center p-8">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#9900ff]/10 via-transparent to-[#00eeff]/10" />
                  <div className="relative">
                    <div className="text-6xl mb-4">🛡️</div>
                    <h3 className="text-2xl md:text-3xl font-bold text-center text-white mb-2">
                      100%
                    </h3>
                    <p className="text-xl md:text-2xl font-semibold text-center text-[#ff00ff]">
                      Risk-Free
                    </p>
                    <p className="text-center text-white mt-2">
                      Sprint-Back Guarantee
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Guarantee details - Right side on desktop */}
            <motion.div
              variants={fadeIn("left", 0.2)}
              className="lg:col-span-3 order-1 lg:order-2"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#9900ff] to-[#00eeff] opacity-30 blur-sm" />
                <div className="relative bg-black/70 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Zero Risk, Full Transparency
                  </h3>

                  <div className="space-y-6">
                    {guaranteePoints.map((point, index) => (
                      <motion.div
                        key={index}
                        variants={fadeIn("up", 0.1 + index * 0.1)}
                        className="flex items-start"
                      >
                        <CheckCircle className="h-6 w-6 text-[#ff00ff] flex-shrink-0 mt-0.5 mr-3" />
                        <p className="text-gray-300">{point}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-lg font-medium text-white">
                      "Our guarantee isn't a marketing gimmick—it's a reflection
                      of our confidence in our process and people."
                    </p>
                    <p className="text-gray-400 mt-2">
                      — NEBULOS Leadership Team
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            variants={fadeIn("up", 0.4)}
            className="text-center mt-16"
          >
            <a href="#contact" className="btn-primary-lg inline-block">
              <span className="relative z-10">
                Risk-Free Project Assessment →
              </span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
