"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll position for navbar background opacity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 md:px-8 pt-6">
      {/* Modified container for the half-circle decorative elements */}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 w-full max-w-5xl select-none">
        {/* More subtle left decorative accent */}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-5 h-12 opacity-30 hidden md:block">
          <div className="w-full h-full rounded-l-full bg-[#9900ff]/25 backdrop-blur-sm" />
        </div>

        {/* More subtle right decorative accent */}
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-5 h-12 opacity-30 hidden md:block">
          <div className="w-full h-full rounded-r-full bg-[#00eeff]/25 backdrop-blur-sm" />
        </div>
      </div>

      <motion.div
        layout
        className={cn(
          "mx-auto transition-all duration-[800ms] ease-in-out floating-navbar",
          scrolled
            ? "max-w-5xl backdrop-blur-xl bg-black/80 shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-white/10 rounded-full py-1"
            : "max-w-7xl backdrop-blur-sm bg-black/10 border border-transparent rounded-[2rem] py-4"
        )}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 60, damping: 20 }}
      >
        <nav
          className={cn("flex items-center justify-between px-4 sm:px-8 transition-all duration-[800ms] ease-in-out", scrolled ? "py-1" : "py-3 sm:py-4")}
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link
              href="/"
              className="flex items-center"
              aria-label="NEBULOS"
            >
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.6, type: "spring" }}
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src="/images/nebulos_logo.svg"
                  alt="NEBULOS"
                  width={330}
                  height={75}
                  className={cn("w-auto hover:brightness-125 transition-all duration-[800ms] ease-in-out drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]", scrolled ? "h-[52px]" : "h-[66px]")}
                  priority
                />
              </motion.div>
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full p-2.5 text-white bg-black/20 backdrop-blur-md border border-white/10 
              hover:bg-white/10 transition-all duration-200 hover:scale-105 hover:shadow-md hover:shadow-[#ff00ff]/20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-1">
            {["problem", "solution", "testimonials", "process", "faq"].map(
              (item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    href={`#${item}`}
                    className="nav-pill-link capitalize mx-1"
                  >
                    {item}
                  </Link>
                </motion.div>
              )
            )}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="#contact" className="btn-primary">
                <span>Get Started</span>
              </Link>
            </motion.div>
          </div>
        </nav>
      </motion.div>

      {/* Mobile menu */}
      <motion.div
        className={cn(
          "fixed inset-0 z-50 bg-black/90 backdrop-blur-xl",
          mobileMenuOpen ? "block" : "hidden"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: mobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          className="absolute top-6 right-6 rounded-full p-2.5 text-white bg-black/20 backdrop-blur-md border border-white/10
          hover:bg-white/10 transition-all duration-200 hover:scale-105 hover:shadow-md hover:shadow-[#ff00ff]/20 z-10"
          onClick={() => setMobileMenuOpen(false)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </motion.button>

        <div className="fixed inset-0 overflow-y-auto px-6 py-20">
          <div className="flex flex-col gap-8 items-center">
            {["problem", "solution", "testimonials", "process", "faq"].map(
              (item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.1 * index,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <Link
                    href={`#${item}`}
                    className="mobile-nav-pill capitalize px-8 py-3 inline-block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </motion.div>
              )
            )}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="#contact"
                className="btn-primary mt-6"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Get Started</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
