"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { BentoDemo } from "@/components/ui/bento-demo";

export default function WhatWeBuild() {
  return (
    <section
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
            className="mx-auto max-w-3xl text-center mb-16"
          >
            <h2 className="section-title">
              What We{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#00eeff]">
                Build
              </span>
            </h2>
            <p className="text-lg text-gray-300 mt-6 max-w-2xl mx-auto">
              From concept to launch, we create digital experiences that drive
              growth. Our expertise spans the full spectrum of modern
              technology.
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn("up", 0.2)}
            className="max-w-6xl mx-auto"
          >
            <BentoDemo />
          </motion.div>

          {/* Call to action */}
          <motion.div
            variants={fadeIn("up", 0.4)}
            className="text-center mt-16"
          >
            <p className="text-gray-400 mb-6">
              Ready to bring your vision to life?
            </p>
            <a
              href="#contact"
              className="btn-primary-lg inline-flex items-center group"
            >
              <span>Start Your Project</span>
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
