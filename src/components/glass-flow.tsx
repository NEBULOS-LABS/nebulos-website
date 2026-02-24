"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function GlassFlow() {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".glass-anim",
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full z-20 flex flex-col items-center">
      <div
        ref={cardRef}
        className="w-full bg-gradient-to-b from-white/[0.05] from-0% via-black/50 via-[50%] to-black to-[75%] backdrop-blur-[24px] border-t border-white/10 overflow-hidden relative"
      >
        {/* Ambient edge glow — sides and bottom only, top edge excluded */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/[0.04] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white/[0.04] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/[0.04] to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-48 pb-64 sm:pb-80">
          
          <div
            className="flex flex-col items-center space-y-16"
          >
            {/* Header */}
            <h2 className="glass-anim text-4xl sm:text-5xl lg:text-7xl font-bold text-center tracking-tight text-white mb-4 leading-[1.1]">
              Your growth is bottlenecked by code <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] to-[#ff00ff] italic">
                you don't have time to write.
              </span>
            </h2>

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
                <div
                  key={index}
                  className="glass-anim flex flex-col h-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 group hover:bg-white/10 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden"
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
                </div>
              ))}
            </div>

            {/* Hidden Cost */}
            <div
              className="glass-anim w-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 lg:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
