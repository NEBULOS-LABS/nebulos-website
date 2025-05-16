"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import Image from "next/image";

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "NEBULOS delivered a production‑ready SaaS MVP in 6 weeks that onboarded 1,200 paying users on day one—and conversion jumped 44% versus our old landing page.",
      author: "Mila T.",
      role: "COO, FinTech Startup",
      image: "/images/Cool_phone_image.png",
    },
    {
      quote:
        "Their sprint guarantee de‑risked the entire build. We hit feature parity three months ahead of plan and saved $312K in dev costs.",
      author: "David W.",
      role: "VP Engineering, Global Logistics Firm",
      image: "/images/Computer_screen_cool_image.png",
    },
  ];

  return (
    <section
      id="testimonials"
      className="relative bg-black overflow-hidden py-20 lg:py-28"
    >
      {/* Design elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#9900ff]/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-[#00eeff]/20 blur-[100px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="mx-auto max-w-2xl text-center mb-16">
            <motion.h2 variants={fadeIn("up")} className="section-title">
              What Our Clients Say
            </motion.h2>
          </div>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeIn(index === 0 ? "right" : "left", 0.1 * index)}
                className="relative rounded-2xl overflow-hidden h-full"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#9900ff] to-[#00eeff] opacity-30 blur-sm rounded-2xl" />
                <div className="relative bg-black/70 backdrop-blur-sm p-8 rounded-2xl h-full border border-white/10">
                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <svg
                        className="h-8 w-8 text-[#ff00ff]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <div className="mb-6 flex-grow">
                      <p className="text-lg text-gray-300 italic">
                        "{testimonial.quote}"
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#9900ff] to-[#00eeff] opacity-70" />
                          <div className="absolute inset-0 flex items-center justify-center text-white font-semibold">
                            {testimonial.author.charAt(0)}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">
                          {testimonial.author}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Metrics banner */}
          <motion.div
            variants={fadeIn("up", 0.3)}
            className="relative rounded-xl overflow-hidden"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#00eeff] opacity-30 blur-sm" />
            <div className="relative bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-400 text-sm mb-1">
                    Client Satisfaction
                  </p>
                  <p className="text-3xl font-bold text-white">
                    4.9<span className="text-lg text-gray-400">/5</span>
                  </p>
                </div>
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-400 text-sm mb-1">On-Time Delivery</p>
                  <p className="text-3xl font-bold text-white">
                    98<span className="text-lg text-gray-400">%</span>
                  </p>
                </div>
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-400 text-sm mb-1">Happy Clients</p>
                  <p className="text-3xl font-bold text-white">
                    100<span className="text-lg text-gray-400">+</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
