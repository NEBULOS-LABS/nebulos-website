"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Press", href: "#" },
      ],
    },
    {
      title: "Services",
      links: [
        { name: "SaaS Development", href: "#services" },
        { name: "Mobile Apps", href: "#services" },
        { name: "AI & Machine Learning", href: "#services" },
        { name: "DevOps & Infrastructure", href: "#services" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "Guides", href: "#" },
        { name: "Case Studies", href: "#" },
        { name: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "Security", href: "#" },
      ],
    },
  ];

  return (
    <footer className="relative bg-black pt-20 overflow-hidden border-t border-white/5">
      {/* Background glow effects - sticking to original Nebulos brand colors */}
      <div className="absolute top-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#9900ff]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#00eeff]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center">
        
        {/* Top Header section */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24 relative md:mb-32">
          
          {/* Left Content */}
          <div className="flex flex-col items-start z-10">
            {/* Logo fix: removed the gradient square */}
            <Link href="/" className="mb-10" aria-label="NEBULOS">
              <Image
                src="/images/nebulos_logo.svg"
                alt="NEBULOS"
                width={140}
                height={32}
                className="h-8 md:h-10 w-auto"
              />
            </Link>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tighter mb-6 leading-tight max-w-xl text-left">
              Software that moves markets.
            </h2>
            <p className="text-gray-400 text-lg md:text-xl mb-10 font-light leading-relaxed max-w-lg text-left">
              We design, build, and scale revenue‑driving products using elite
              talent, AI‑accelerated workflows, and a guarantee that puts all
              the risk on us.
            </p>
            <div className="relative inline-block group">
              {/* Intense lower glow mimicking the reference */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ff4d4d] via-[#ff7a00] to-[#ff4d4d] rounded-full blur-xl opacity-40 group-hover:opacity-60 transition duration-500 pb-2 translate-y-2"></div>
              <Link 
                href="#contact" 
                className="relative inline-flex items-center px-9 py-4 bg-white text-black text-sm font-bold uppercase tracking-wider rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Get Started
              </Link>
            </div>
          </div>
          
          {/* Right Content - Video Animation */}
          <div className="relative w-full h-[300px] lg:h-full flex justify-end items-start pointer-events-none z-0">
            {/* Positioned such that top overflows the footer and is cut off by the footer's overflow-hidden */}
            <div className="absolute top-[-150px] lg:top-[-250px] right-[-50px] lg:right-[-100px] w-[500px] h-[500px] lg:w-[800px] lg:h-[800px] flex items-center justify-center opacity-90 scale-110">
              <video 
                src="/images/nebula_cloud_V2.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover [mask-image:radial-gradient(circle,white_50%,transparent_70%)]"
              />
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 z-10">
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col">
              <h3 className="text-sm font-medium text-white mb-6">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="group flex flex-row items-center text-gray-400 hover:text-white transition-colors duration-200 text-sm w-fit"
                    >
                      {link.name}
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright Pill Section */}
        <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-full px-6 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center z-10 gap-4 text-xs font-medium text-gray-500 mt-12 mb-1 md:mb-2 text-center md:text-left">
          <div className="flex items-center">
            <span>All copyrights reserved for NEBULOS</span>
          </div>
          <div className="flex items-center">
            &copy; {currentYear} NEBULOS. All rights reserved.
          </div>
          <div className="flex items-center">
            <span>Designed by the Nebulos Team</span>
          </div>
        </div>

        {/* Precision Aligned Watermark text at the very bottom */}
        <div className="w-full flex justify-between items-end select-none">
          {["N", "E", "B", "U", "L", "O", "S"].map((letter, i) => (
            <span 
              key={i} 
              className="text-[19vw] md:text-[min(19vw,240px)] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/[0.2] via-white/[0.08] to-transparent leading-none tracking-tight pt-0"
            >
              {letter}
            </span>
          ))}
        </div>

      </div>
    </footer>
  );
}
