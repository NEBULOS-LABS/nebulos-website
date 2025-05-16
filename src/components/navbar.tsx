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
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <div
        className={cn(
          "mx-auto w-full max-w-7xl transition-all duration-300 ease-in-out border-b",
          scrolled
            ? "backdrop-blur-md bg-black/50 border-white/10 py-2"
            : "backdrop-blur-sm bg-black/20 border-transparent py-4"
        )}
      >
        <nav
          className="flex items-center justify-between px-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link
              href="/"
              className="flex items-center gap-3"
              aria-label="NEBULOS"
            >
              <motion.div
                className="relative w-9 h-9 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#00eeff] rounded-md opacity-70 blur-md" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#00eeff] rounded-md opacity-100" />
                <div className="absolute inset-0 bg-black/50 rounded-md m-1.5" />
                <span className="relative z-10 text-white font-bold text-lg">
                  N
                </span>

                {/* Animated glow effect */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-[#9900ff]/40 via-[#ff00ff]/40 to-[#00eeff]/40 rounded-lg blur-md"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Image
                  src="/images/nebulos_logo.svg"
                  alt="NEBULOS"
                  width={120}
                  height={28}
                  className="h-7 w-auto"
                  priority
                />
              </motion.div>
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full p-2 text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-8">
            {["problem", "solution", "testimonials", "process", "faq"].map(
              (item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
                >
                  <Link href={`#${item}`} className="nav-link capitalize">
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
      </div>

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
                    className="text-lg font-medium text-white hover:text-[#00eeff] capitalize transition-colors duration-200"
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
