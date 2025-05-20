"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LampContainer } from "./lamp";

export function ProblemLamp() {
  return (
    <div className="my-16">
      <LampContainer className="h-[40vh] md:h-[60vh]">
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-[#9900ff] via-[#ff00ff] to-[#00eeff] py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          Don't let code <br /> slow you down
        </motion.h1>
      </LampContainer>
    </div>
  );
}
