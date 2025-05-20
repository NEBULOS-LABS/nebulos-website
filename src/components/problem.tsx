"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import Image from "next/image";
import { cn } from "@/lib/utils";

// LampContainer component definition directly in this file
const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden bg-black w-full rounded-md z-0",
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 ">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute  w-[100%] left-0 bg-black h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute  w-40 h-[100%] left-0 bg-black  bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute  w-40 h-[100%] right-0 bg-black  bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute  w-[100%] right-0 bg-black h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-black blur-2xl"></div>
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl"
        ></motion.div>
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-cyan-400 "
        ></motion.div>

        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-black "></div>
      </div>

      <div className="relative z-50 flex -translate-y-40 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
};

export default function Problem() {
  return (
    <section
      id="problem"
      className="relative bg-black overflow-hidden py-20 lg:py-28"
    >
      {/* Design elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute top-1/4 -left-40 w-80 h-80 bg-[#9900ff]/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/3 -right-40 w-80 h-80 bg-[#00eeff]/20 blur-[100px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Lamp Component directly integrated */}
        <LampContainer className="h-[30vh] mb-10">
          {/* Empty div as required children */}
          <div></div>
        </LampContainer>

        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mx-auto max-w-3xl text-center mb-16"
        >
          <motion.h2 variants={fadeIn("up")} className="section-title">
            Your growth is bottlenecked by code you don't have time to write
          </motion.h2>
        </motion.div>

        {/* Problem points */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-20"
        >
          {[
            {
              title: "Hiring slows you down",
              description: "The average senior engineer hires in 68 days.",
              icon: "⏱️",
              image: "/images/scissors_cutting_ribbons_cool_image.png",
            },
            {
              title: "In‑house teams are stretched thin",
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
              className="flex flex-col h-full problem-card group"
            >
              <div className="relative h-48 mb-6 overflow-hidden rounded-xl">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60" />
                <div className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-xl">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Hidden cost section */}
        <motion.div
          variants={fadeIn("up")}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                The hidden cost
              </h3>
              <p className="text-gray-300 mb-4">
                While you wait, competitors launch, investors cool, and your
                market window narrows. Every delayed feature can cost{" "}
                <span className="font-bold text-[#ff00ff]">
                  up to 11% of annual revenue
                </span>{" "}
                <em>per</em> quarter.
              </p>
              <div className="h-1 w-20 bg-gradient-to-r from-[#9900ff] to-[#00eeff] rounded-full mt-4" />
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#9900ff] to-[#00eeff] opacity-30 blur-sm rounded-lg" />
              <div className="relative bg-black/80 rounded-lg p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Average feature delay</span>
                    <span className="font-semibold text-white">
                      2.7 quarters
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Revenue impact</span>
                    <span className="font-semibold text-white">
                      11% per quarter
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">
                      Time to first engineer
                    </span>
                    <span className="font-semibold text-white">68 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Opportunity cost</span>
                    <span className="font-semibold text-[#ff00ff]">
                      Compound loss
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
