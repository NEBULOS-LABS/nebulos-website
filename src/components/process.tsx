"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

export default function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const [timelineRef, timelineInView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  const steps = [
    {
      number: "01",
      title: "Rapid Roadmapping",
      timeline: "Day 0-5",
      description: [
        "Workshop goals, constraints, and success metrics",
        "Define technical architecture and UX flows",
        "Deliver clickable prototype + sprint backlog",
        "Begin first sprint planning session",
      ],
      color: "from-[#9900ff] to-[#ff00ff]",
      icon: "🗺️",
      bgGlow: "bg-[#9900ff]/20",
    },
    {
      number: "02",
      title: "Zero-Drag Sprints",
      timeline: "Day 6-∞",
      description: [
        "Two-week cycles with shippable code demos",
        "Daily automated QA and test coverage reports",
        "AI-powered regression testing runs nightly",
        "Transparent project dashboards & velocity metrics",
      ],
      color: "from-[#ff00ff] to-[#00eeff]",
      icon: "🚀",
      bgGlow: "bg-[#ff00ff]/20",
    },
    {
      number: "03",
      title: "Continuous Evolution",
      timeline: "Ongoing",
      description: [
        "Weekly stakeholder reviews & strategic refinement",
        "Proactive tech debt & optimization management",
        "Continuous integration & deployment pipeline",
        "Performance & analytics monitoring",
      ],
      color: "from-[#00eeff] to-[#9900ff]",
      icon: "🔄",
      bgGlow: "bg-[#00eeff]/20",
    },
  ];

  return (
    <section
      id="process"
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
            <h2 className="section-title">Our 3-Step Path to Launch</h2>
            <p className="text-lg text-gray-300 mt-6 max-w-2xl mx-auto">
              A structured approach that minimizes risk and maximizes speed to
              market, with transparent milestones along the way.
            </p>
          </motion.div>

          {/* Steps Navigation */}
          <motion.div variants={fadeIn("up", 0.1)} className="mb-12 md:mb-20">
            <div className="flex flex-wrap justify-center gap-4">
              {steps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`relative transition-all duration-300 ease-out ${
                    activeStep === idx
                      ? "bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                      : "bg-black/30 hover:bg-black/50"
                  } backdrop-blur-sm rounded-full px-6 py-2.5 text-white font-medium`}
                >
                  {/* Gradient Border */}
                  <div
                    className={`absolute inset-0 rounded-full ${
                      activeStep === idx ? "opacity-100" : "opacity-0"
                    } transition-opacity duration-300`}
                    style={{
                      background: `linear-gradient(to right, #9900ff, #ff00ff, #00eeff)`,
                      padding: "1.5px",
                      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      maskComposite: "exclude",
                    }}
                  />

                  {/* Label with active indicator */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-6 w-6 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-xs font-bold`}
                    >
                      {idx + 1}
                    </span>
                    <span className="hidden sm:block">{step.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Active Step Content */}
          <div ref={timelineRef} className="relative mx-auto max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#00eeff] opacity-50 blur-sm" />
                <div className="relative bg-black/70 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Step Content */}
                    <div>
                      {/* Step Header */}
                      <div className="mb-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-r ${steps[activeStep].color}`}
                          >
                            {steps[activeStep].icon}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                              {steps[activeStep].title}
                            </h3>
                            <p className="text-[#ff00ff] font-semibold">
                              {steps[activeStep].timeline}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Description Points */}
                      <ul className="space-y-4">
                        {steps[activeStep].description.map((item, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.4 }}
                            className="flex items-start gap-3"
                          >
                            <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                              {idx + 1}
                            </div>
                            <p className="text-gray-200">{item}</p>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Interactive Visualization */}
                    <div className="relative">
                      <div className="aspect-square rounded-xl overflow-hidden relative">
                        <div
                          className={`absolute inset-0 ${steps[activeStep].bgGlow} blur-[60px] opacity-50`}
                        />
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-6 border border-white/10">
                          {/* Dynamic Visual Based on Step */}
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative h-32 w-32 mb-6"
                          >
                            <div
                              className={`absolute inset-0 bg-gradient-to-r ${steps[activeStep].color} rounded-full opacity-20 animate-pulse`}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-6xl">
                                {steps[activeStep].icon}
                              </span>
                            </div>
                          </motion.div>

                          {/* Progress Indicator */}
                          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${steps[activeStep].color}`}
                              initial={{ width: "0%" }}
                              animate={{
                                width:
                                  activeStep === 0
                                    ? "33.3%"
                                    : activeStep === 1
                                      ? "66.6%"
                                      : "100%",
                              }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          </div>

                          <p className="text-white/60 text-sm mt-4 text-center">
                            Phase {activeStep + 1} of 3
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Timeline Navigation Dots */}
            <div className="flex justify-center mt-8 gap-3">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeStep === idx
                      ? "bg-gradient-to-r from-[#9900ff] to-[#00eeff] w-12"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* CTA Block */}
          <motion.div
            variants={fadeIn("up", 0.4)}
            className="mt-20 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Ready to start your journey?
            </h3>
            <a
              href="#contact"
              className="btn-primary-lg inline-flex items-center"
            >
              <span>Schedule Your Strategy Call</span>
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
