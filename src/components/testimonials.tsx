"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const col1Cards = [
  {
    quote: "The transformation was remarkable to witness. Within months, our productivity soared as team members embraced the new system and started delivering exceptional results.",
    author: "Sally Taher",
    role: "Lead Designer at Bastillo",
    image: "/images/testimonials/headshots/sample_headshot1.avif"
  },
  {
    quote: "An absolute game-changer for our workflow. We cut our deployment times by half and saw a noticeable drop in error rates since migrating to NEBULOS.",
    author: "Jorn Lande",
    role: "Marketing Director at Spitfire",
    image: "/images/testimonials/headshots/sample_headshot3.avif"
  },
  {
    quote: "Its intuitive interface and robust features are essential to our day-to-day operations. Highly recommended for any scaling tech firm.",
    author: "David Pierce",
    role: "Consultant at NanoWise",
    image: "/images/testimonials/headshots/sample_headshot5.avif"
  },
  {
    quote: "We struggled with fragmented systems for years. NEBULOS consolidated everything beautifully. The transition was flawless, and the ongoing support is unparalleled.",
    author: "Elena Rodriguez",
    role: "VP of Operations",
    image: "/images/testimonials/headshots/sample_headshot7.avif"
  }
];

const col2Cards = [
  {
    quote: "Rescale delivers actionable data, transforming our decision-making process. The AI insights provided a clear path to optimization.",
    author: "Linda Watts",
    role: "Commercial Director at Bastillo",
    image: "/images/testimonials/headshots/sample_headshot2.avif"
  },
  {
    quote: "Since implementing this solution, we've seen a dramatic improvement in our analytics efficiency. The system is incredibly robust.",
    author: "Rachel Foster",
    role: "Digital Strategy Lead at Nexus Digital",
    image: "/images/testimonials/headshots/sample_headshot4.avif"
  },
  {
    quote: "We needed a partner who could move fast without breaking things. NEBULOS delivered our platform securely and reliably ahead of schedule.",
    author: "Marcus Chen",
    role: "CTO at InnovateX",
    image: "/images/testimonials/headshots/sample_headshot6.avif"
  },
  {
    quote: "Our engagement metrics have skyrocketed. The AI-driven personalized insights have completely reshaped how we connect with our customers.",
    author: "Thomas Wright",
    role: "Growth Manager",
    image: "/images/testimonials/headshots/sample_headshot8.avif"
  }
];

const TestimonialCard = ({ quote, author, role, image }: any) => (
  <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/5 border-t-white/20 border-r-white/20 rounded-3xl p-7 lg:p-10 hover:bg-white/[0.06] transition-colors duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden group">
    {/* Light source reflection from top right */}
    <div className="absolute inset-0 bg-gradient-to-bl from-white/20 via-white/5 to-transparent pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute -top-28 -right-24 w-72 h-72 bg-white/15 blur-[84px] pointer-events-none rounded-full group-hover:bg-[#00eeff]/20 transition-colors duration-500" />

    <p className="text-gray-200 text-base md:text-lg leading-relaxed mb-10 relative z-10 font-medium">
      {quote}
    </p>
    <div className="flex items-center gap-5 relative z-10">
      <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/20 shrink-0 shadow-lg">
        <Image src={image} alt={author} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>
      <div>
        <h4 className="text-white font-semibold text-base tracking-wide">{author}</h4>
        <p className="text-gray-400 text-sm mt-0.5">{role}</p>
      </div>
    </div>
  </div>
);

export default function Testimonials() {
  const containerRef = useRef<HTMLElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Reveal animation when scrolled into view
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      }
    );

    // Infinite vertical scroll for Column 1 (Left side moves down -> starts at -50% and goes to 0%)
    if (col1Ref.current) {
      gsap.fromTo(col1Ref.current,
        { yPercent: -50 },
        { yPercent: 0, duration: 40, ease: "none", repeat: -1 }
      );
    }

    // Infinite vertical scroll for Column 2 (Right side moves up -> starts at 0% and goes to -50%)
    if (col2Ref.current) {
      gsap.fromTo(col2Ref.current,
        { yPercent: 0 },
        { yPercent: -50, duration: 35, ease: "none", repeat: -1 }
      );
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="testimonials" className="relative bg-black w-full overflow-hidden py-28 lg:py-40">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[#9900ff]/10 blur-[156px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-[#00eeff]/10 blur-[156px] rounded-full pointer-events-none" />

      <div ref={contentRef} className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-10 min-h-[960px] lg:min-h-[1080px]">

          {/* Left side: Content & Sticky Video Wrapper */}
          <div className="w-full lg:w-[38%] flex flex-col lg:-mt-[80px]">
            <div className="mb-14">
              <span className="text-sm font-bold tracking-[0.2em] text-[#00eeff] uppercase mb-3 block">
                Client Insights
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-5 leading-[1.1]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00eeff] via-[#ff00ff] to-[#9900ff]">What</span> Our
                <br />
                Clients <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Say</span>
              </h2>
              <p className="text-gray-400 text-xl leading-relaxed max-w-md">
                How our clients transform growth with advanced solutions. And here's exactly how they did it.
              </p>
            </div>

            <div className="h-full relative">
               {/* Sticky Video Card pinned below title text */}
               <div className="relative w-full max-w-md rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] group h-[600px] lg:h-[720px] lg:sticky lg:top-32">
                 <video
                   src="/images/testimonials/sample_testimonial_video.mp4"
                   autoPlay
                   loop
                   muted
                   playsInline
                   className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
                 />
                 <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                 <div className="absolute bottom-12 left-10 right-10">
                   <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">David Pierce</h3>
                   <p className="text-[#00eeff] text-base font-medium">Marketing Consultant at Giggle</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Right side: Scrolling Columns */}
          <div className="w-full lg:w-[62%] relative h-[960px] lg:h-[1080px] overflow-hidden lg:pl-2 lg:mt-10">
            {/* Top & Bottom Fade Masks to blend rolling cards smoothly */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-black via-black/90 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />

            <div className="flex gap-5 sm:gap-7 h-full w-full relative">
              {/* Left Column (rolls continuously DOWN) */}
              <div className="flex-1 overflow-hidden relative">
                <div ref={col1Ref} className="absolute w-full flex flex-col gap-5 sm:gap-7 will-change-transform">
                  <div className="flex flex-col gap-5 sm:gap-7 pb-5 sm:pb-7">
                    {col1Cards.map((card, idx) => <TestimonialCard key={`c1a-${idx}`} {...card} />)}
                  </div>
                  <div className="flex flex-col gap-5 sm:gap-7 pb-5 sm:pb-7">
                    {col1Cards.map((card, idx) => <TestimonialCard key={`c1b-${idx}`} {...card} />)}
                  </div>
                </div>
              </div>

              {/* Right Column (rolls continuously UP) */}
              <div className="flex-1 overflow-hidden relative translate-y-16">
                <div ref={col2Ref} className="absolute w-full flex flex-col gap-5 sm:gap-7 will-change-transform">
                  <div className="flex flex-col gap-5 sm:gap-7 pb-5 sm:pb-7">
                    {col2Cards.map((card, idx) => <TestimonialCard key={`c2a-${idx}`} {...card} />)}
                  </div>
                  <div className="flex flex-col gap-5 sm:gap-7 pb-5 sm:pb-7">
                    {col2Cards.map((card, idx) => <TestimonialCard key={`c2b-${idx}`} {...card} />)}
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
