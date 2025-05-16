"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";

export default function Hero() {
  return (
    <div className="relative pt-24 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9900ff]/20 via-transparent to-[#00eeff]/20" />
        <Image
          src="/images/nebula_cloud_image_header_or_hero.png"
          alt="Nebula Background"
          fill
          className="opacity-30 object-cover"
          priority
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:pt-32 lg:px-8 lg:pt-40">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.h1
            variants={fadeIn("up")}
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white via-[#ff00ff]/90 to-white"
          >
            Ship world‑class software in weeks, not quarters.
          </motion.h1>

          <motion.p
            variants={fadeIn("up", 0.1)}
            className="mt-6 text-lg leading-8 text-gray-300 max-w-3xl mx-auto"
          >
            We design, build, and scale revenue‑driving products—websites, SaaS
            platforms, mobile apps, and complex engineering systems—using elite
            talent, AI‑accelerated workflows, and a guarantee that puts all the
            risk on us.
          </motion.p>

          <motion.div
            variants={fadeIn("up", 0.2)}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="#contact" className="btn-primary-lg group">
              Start Your Free Strategy Call
              <span className="group-hover:translate-x-1 transition-transform duration-150 ease-in-out ml-1">
                →
              </span>
            </Link>

            <Link href="#work" className="btn-secondary-lg group">
              See Our Work
              <span className="group-hover:translate-y-1 transition-transform duration-150 ease-in-out ml-1">
                ↓
              </span>
            </Link>
          </motion.div>

          <motion.div
            variants={fadeIn("up", 0.3)}
            className="mt-16 pt-8 border-t border-white/10"
          >
            <p className="text-sm font-medium text-white/60 mb-6">
              Trusted by founders and enterprises generating over{" "}
              <span className="text-white font-bold">$100M</span> in annual
              revenue.
            </p>

            <div className="flex flex-wrap justify-center gap-8 items-center">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="h-8 w-20 bg-white/20 rounded animate-pulse"></div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="h-8 w-20 bg-white/20 rounded animate-pulse"></div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="h-8 w-20 bg-white/20 rounded animate-pulse"></div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="h-8 w-20 bg-white/20 rounded animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
}
