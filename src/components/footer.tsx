"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Twitter, Instagram, Linkedin, Github, Mail } from "lucide-react";

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
    <footer className="relative bg-black border-t border-white/10">
      {/* Top gradient separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Background glow effects */}
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-[#9900ff]/10 blur-[100px] rounded-full" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#00eeff]/10 blur-[100px] rounded-full" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo and tagline */}
          <div className="space-y-6">
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="NEBULOS"
            >
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#00eeff] rounded-md opacity-70 blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#00eeff] rounded-md opacity-100" />
              </div>
              <Image
                src="/images/nebulos_logo.svg"
                alt="NEBULOS"
                width={120}
                height={28}
                className="h-7 w-auto"
              />
            </Link>

            <p className="text-gray-400 max-w-md">
              We design, build, and scale revenue‑driving products using elite
              talent, AI‑accelerated workflows, and a guarantee that puts all
              the risk on us.
            </p>

            <div className="flex space-x-6">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Github, href: "#", label: "GitHub" },
                {
                  icon: Mail,
                  href: "mailto:contact@nebulos.com",
                  label: "Email",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link sections */}
          <div className="mt-12 xl:mt-0 xl:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerLinks.map((section) => (
                <div key={section.title} className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} NEBULOS. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-4 md:mt-0">
              Software that moves markets.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
