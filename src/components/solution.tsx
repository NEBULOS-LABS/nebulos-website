"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import Image from "next/image";

export default function Solution() {
  return (
    <section
      id="solution"
      className="relative bg-black overflow-hidden py-20 lg:py-28"
    >
      {/* Design elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute top-1/3 -right-40 w-80 h-80 bg-[#ff00ff]/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 -left-40 w-80 h-80 bg-[#00eeff]/20 blur-[100px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div
            variants={fadeIn("up")}
            className="mx-auto max-w-3xl text-center mb-20"
          >
            <h2 className="section-title">
              Enter{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#00eeff]">
                NEBULOS
              </span>
              : Your fractional, battle‑tested product team
            </h2>
            <p className="section-subtitle mt-6">
              We combine senior engineers, UI/UX experts, and product
              strategists with an
              <span className="font-semibold text-white">
                {" "}
                AI‑accelerated delivery framework{" "}
              </span>
              proven across 120+ projects.
            </p>
          </motion.div>

          {/* Solution Illustration */}
          <motion.div variants={fadeIn("up", 0.1)} className="relative mb-20">
            <div className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#9900ff] to-[#00eeff] opacity-50 blur rounded-2xl" />
              <div className="relative aspect-video bg-black/90 rounded-2xl flex items-center justify-center p-4">
                {/* Replace with your actual solution illustration */}
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src="/images/Computer_screen_cool_image.png"
                    alt="NEBULOS AI-accelerated delivery platform"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/20 max-w-md text-center">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                        AI-Accelerated Delivery Framework
                      </h3>
                      <p className="text-gray-300 text-sm md:text-base">
                        27% faster delivery with 38% fewer bugs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* How We Do It vs Why It Matters Table */}
          <motion.div
            variants={fadeIn("up", 0.2)}
            className="relative rounded-2xl overflow-hidden"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#00eeff] opacity-30 blur-sm" />
            <div className="relative bg-black/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
              <div className="px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                  <div className="px-4 py-3 text-center md:text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                      How We Do It
                    </h3>
                  </div>
                  <div className="px-4 py-3 text-center md:text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                      Why It Matters
                    </h3>
                  </div>
                </div>

                {[
                  {
                    how: '🔁 2-Week "Zero-Drag" Sprints',
                    why: "See working software every 14 days.",
                  },
                  {
                    how: "🧠 AI-Powered Code Generation & QA",
                    why: "27% faster delivery, 38% fewer bugs.",
                  },
                  {
                    how: "🛡 Full-Stack Senior Talent Only",
                    why: "No juniors learning on your dime.",
                  },
                  {
                    how: "📈 Conversion-Focused Design DNA",
                    why: "Born from CRO roots—every pixel earns revenue.",
                  },
                  {
                    how: "🔍 Transparent Metrics Dashboard",
                    why: "Track velocity, quality, and spend in real time.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 ${index > 0 ? "border-t border-white/10" : ""}`}
                  >
                    <motion.div
                      variants={fadeIn("right", 0.1 * index)}
                      className="px-4 py-5 flex items-center"
                    >
                      <div className="ml-3">
                        <h4 className="text-lg font-semibold text-white">
                          {item.how}
                        </h4>
                      </div>
                    </motion.div>
                    <motion.div
                      variants={fadeIn("left", 0.1 * index)}
                      className="px-4 py-5"
                    >
                      <p className="text-gray-300">{item.why}</p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
