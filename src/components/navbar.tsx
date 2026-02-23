"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Helper component for magnetic links
const MagneticLink = ({ children, href, className, onClick }: any) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const xTo = useRef<any>(null);
  const yTo = useRef<any>(null);

  useGSAP(() => {
    xTo.current = gsap.quickTo(linkRef.current, "x", { duration: 0.4, ease: "power3.out" });
    yTo.current = gsap.quickTo(linkRef.current, "y", { duration: 0.4, ease: "power3.out" });
  }, { scope: linkRef });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!linkRef.current || !xTo.current || !yTo.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = linkRef.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    xTo.current(x * 0.2); 
    yTo.current(y * 0.2);
  };

  const handleMouseLeave = () => {
    if (xTo.current && yTo.current) {
      xTo.current(0);
      yTo.current(0);
    }
  };

  return (
    <Link
      href={href}
      ref={linkRef}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    // Initial Entrance Animation
    const tl = gsap.timeline();
    tl.fromTo(navContainerRef.current, 
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" }
    )
    .fromTo(".nav-logo", 
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.6"
    )
    .fromTo(".desktop-nav-item",
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(".desktop-cta",
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" },
      "-=0.3"
    );

    // Scroll trigger for physics-driven navbar compression
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      
      gsap.to(navContainerRef.current, {
        maxWidth: isScrolled ? "64rem" : "80rem", // max-w-5xl vs max-w-7xl
        backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.1)",
        border: isScrolled ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid transparent",
        borderRadius: isScrolled ? "9999px" : "2rem",
        paddingTop: isScrolled ? "0.25rem" : "1rem",
        paddingBottom: isScrolled ? "0.25rem" : "1rem",
        boxShadow: isScrolled ? "0 8px 32px rgba(0,0,0,0.6)" : "none",
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto"
      });

      gsap.to(".nav-logo", {
        height: isScrolled ? "52px" : "66px",
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto"
      });
      
      gsap.to(".nav-inner", {
        paddingTop: isScrolled ? "0.25rem" : "0.75rem",
        paddingBottom: isScrolled ? "0.25rem" : "0.75rem",
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto"
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, { scope: headerRef });

  // Mobile Menu Setup
  useGSAP(() => {
    timelineRef.current = gsap.timeline({ paused: true });
    
    if(!mobileMenuRef.current) return;

    timelineRef.current
      .to(mobileMenuRef.current, { display: "block", duration: 0 })
      .to(mobileMenuRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" })
      .fromTo(".mobile-close-btn", 
        { opacity: 0, scale: 0.8, rotation: -90 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.4, ease: "back.out(2)" },
        "-=0.1"
      )
      .fromTo(".mobile-nav-item",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "back.out(1.2)" },
        "-=0.3"
      )
      .fromTo(".mobile-cta",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" },
        "-=0.2"
      );
  }, { scope: headerRef });

  // Watch state variable to drive the timeline forward/backward
  useEffect(() => {
    if (timelineRef.current) {
      if (mobileMenuOpen) {
        timelineRef.current.play();
      } else {
        timelineRef.current.reverse().then(() => {
            gsap.set(mobileMenuRef.current, { display: "none" });
        });
      }
    }
  }, [mobileMenuOpen]);

  // Handle Logo Hover
  const handleLogoHover = (isHovering: boolean) => {
    gsap.to(".nav-logo", {
      scale: isHovering ? 1.05 : 1,
      filter: isHovering ? "brightness(1.25) drop-shadow(0 0 12px rgba(0,238,255,0.4))" : "brightness(1) drop-shadow(0 0 8px rgba(255,255,255,0.2))",
      duration: 0.4,
      ease: "power2.out"
    });
  };

  // Handle CTA Hover (Magnetic + Glow)
  const xToCta = useRef<any>(null);
  const yToCta = useRef<any>(null);
  
  useGSAP(() => {
    xToCta.current = gsap.quickTo(".desktop-cta", "x", { duration: 0.4, ease: "power3.out" });
    yToCta.current = gsap.quickTo(".desktop-cta", "y", { duration: 0.4, ease: "power3.out" });
  }, { scope: headerRef });

  const handleCtaHover = (e: React.MouseEvent, isHovering: boolean) => {
    if(isHovering) {
       gsap.to(".desktop-cta", { scale: 1.05, duration: 0.3, ease: "power2.out" });
       
       if (xToCta.current && yToCta.current && e.currentTarget) {
          const { clientX, clientY } = e;
          const { height, width, left, top } = e.currentTarget.getBoundingClientRect();
          const x = clientX - (left + width / 2);
          const y = clientY - (top + height / 2);
          xToCta.current(x * 0.2); 
          yToCta.current(y * 0.2);
       }
    } else {
       gsap.to(".desktop-cta", { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
       if (xToCta.current && yToCta.current) {
         xToCta.current(0);
         yToCta.current(0);
       }
    }
  };

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 md:px-8 pt-6 pointer-events-none">
      <div
        ref={navContainerRef}
        className="mx-auto max-w-7xl backdrop-blur-sm bg-black/10 border border-transparent rounded-[2rem] floating-navbar relative pointer-events-auto"
        style={{ padding: "1rem 0" }} // Inline styles driven by GSAP
      >
        <nav
          className="nav-inner flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link
              href="/"
              className="flex items-center outline-none"
              aria-label="NEBULOS"
              onMouseEnter={() => handleLogoHover(true)}
              onMouseLeave={() => handleLogoHover(false)}
            >
              <Image
                src="/images/nebulos_logo.svg"
                alt="NEBULOS"
                width={330}
                height={75}
                className="nav-logo w-auto h-[66px] drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                priority
              />
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full p-2.5 text-white bg-black/20 backdrop-blur-md border border-white/10 
              hover:bg-white/10 transition-all duration-200 hover:scale-105 hover:shadow-md hover:shadow-[#ff00ff]/20"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-1">
            {["problem", "solution", "testimonials", "process", "faq"].map(
              (item) => (
                <div key={item} className="desktop-nav-item">
                  <MagneticLink
                    href={`#${item}`}
                    className="nav-pill-link capitalize mx-1 inline-block"
                  >
                    {item}
                  </MagneticLink>
                </div>
              )
            )}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end perspective-[1000px]">
             <div 
               className="desktop-cta inline-block"
               onMouseMove={(e) => handleCtaHover(e, true)}
               onMouseLeave={(e) => handleCtaHover(e, false)}
             >
                <Link href="#contact" className="btn-primary block">
                  <span>Get Started</span>
                </Link>
             </div>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl hidden opacity-0 pointer-events-auto"
      >
        <button
          className="mobile-close-btn absolute top-6 right-6 rounded-full p-2.5 text-white bg-black/20 backdrop-blur-md border border-white/10
          hover:bg-white/10 transition-all duration-200 hover:scale-105 hover:shadow-md hover:shadow-[#ff00ff]/20 z-10"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto px-6 py-20">
          <div className="flex flex-col gap-8 items-center">
            {["problem", "solution", "testimonials", "process", "faq"].map(
              (item) => (
                <div key={item} className="mobile-nav-item">
                  <Link
                    href={`#${item}`}
                    className="mobile-nav-pill capitalize px-8 py-3 inline-block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </div>
              )
            )}
            <div className="mobile-cta mt-6">
              <Link
                href="#contact"
                className="btn-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Get Started</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
