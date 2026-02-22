"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import Image from "next/image";

export default function GlassFlow() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the component's scroll position
  // "start bottom" = 0 (when top of this section hits the bottom of the viewport)
  // "start top" = 1 (when top of this section hits the top of the viewport)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 100%", "start 0%"],
  });

  // Animate width from 90% when peeking, to 100% when it hits the top
  const widthStr = useTransform(scrollYProgress, [0, 1], ["90%", "100%"]);
  
  // Animate border radius from 40px (rounded card) to 0px (flat edges)
  const borderStr = useTransform(scrollYProgress, [0, 1], ["40px", "0px"]);

  return (
    <section ref={containerRef} className="relative w-full z-20 pb-32 flex flex-col items-center">
      <motion.div
        style={{ width: widthStr, borderRadius: borderStr }}
        className="mx-auto bg-black/40 backdrop-blur-[24px] border border-white/10 shadow-[0_-20px_80px_rgba(0,0,0,0.6)] overflow-hidden relative"
      >
        {/* Internal ambient glowing effects */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col items-center space-y-16"
          >
            {/* Header */}
            <motion.h2 variants={fadeIn("up")} className="text-4xl sm:text-5xl lg:text-7xl font-bold text-center tracking-tight text-white mb-4 leading-[1.1]">
              Your growth is bottlenecked by code <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] to-[#ff00ff] italic">
                you don't have time to write.
              </span>
            </motion.h2>

            {/* Grid of issues */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-10">
              {[
                {
                  title: "Hiring slows you down",
                  description: "The average senior engineer hires in 68 days.",
                  icon: "⏱️",
                  image: "/images/scissors_cutting_ribbons_cool_image.png",
                },
                {
                  title: "In-house teams are stretched thin",
                  description: "Maintenance steals focus from innovation.",
                  icon: "🔄",
                  image: "/images/image_of_keys.png",
                },
                {
                  title: "Freelancers disappear",
                  description: "Quality, accountability, and security suffer.",
                  icon: "👻",
                  image: "/images/open_box_image.png",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn("up", index * 0.1)}
                  className="flex flex-col h-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 group hover:bg-white/10 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#9900ff]/5 to-[#00eeff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative h-48 mb-6 overflow-hidden rounded-2xl border border-white/5">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110 saturate-150"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-2xl shadow-xl">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 relative z-10">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 relative z-10 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Hidden Cost */}
            <motion.div
              variants={fadeIn("up", 0.3)}
              className="w-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 lg:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#ff00ff]/20 blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#00eeff]/20 blur-[120px] rounded-full pointer-events-none" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6 tracking-tight">
                    The hidden cost
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    While you wait, competitors launch, investors cool, and your
                    market window narrows. Every delayed feature can cost{" "}
                    <span className="font-bold text-[#00eeff] text-xl px-1">
                      up to 11% of annual revenue
                    </span>{" "}
                    <em className="text-white/70">per</em> quarter.
                  </p>
                  <div className="h-1 w-24 bg-gradient-to-r from-[#ff00ff] to-[#00eeff] rounded-full" />
                </div>
                
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#9900ff] to-[#00eeff] opacity-40 blur-xl rounded-3xl" />
                  <div className="relative bg-[#0a001a]/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="text-gray-400 font-medium tracking-wide text-sm uppercase">Average feature delay</span>
                      <span className="font-bold text-white text-lg">2.7 quarters</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="text-gray-400 font-medium tracking-wide text-sm uppercase">Revenue impact</span>
                      <span className="font-bold text-[#ff00ff] text-lg">11% per quarter</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="text-gray-400 font-medium tracking-wide text-sm uppercase">Time to first engineer</span>
                      <span className="font-bold text-white text-lg">68 days</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-gray-400 font-medium tracking-wide text-sm uppercase">Opportunity cost</span>
                      <span className="font-extrabold text-[#00eeff] text-xl drop-shadow-[0_0_10px_rgba(0,238,255,0.5)]">Compound loss</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
