"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  ArrowRight,
  Send,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./footer.module.scss";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const footerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // CTA section animation
      gsap.fromTo(
        ctaRef.current,
        {
          y: 50,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Links animation with stagger
      const linkSections = linksRef.current?.children;
      if (linkSections) {
        gsap.fromTo(
          Array.from(linkSections),
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: linksRef.current,
              start: "top 90%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Social links hover animations
      const socialLinks = document.querySelectorAll(`.${styles.socialLink}`);
      socialLinks.forEach((link) => {
        link.addEventListener("mouseenter", () => {
          gsap.to(link, {
            scale: 1.1,
            rotate: 5,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        link.addEventListener("mouseleave", () => {
          gsap.to(link, {
            scale: 1,
            rotate: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const footerLinks = [
    {
      title: "Solutions",
      links: [
        { name: "SaaS Development", href: "#services" },
        { name: "Mobile Apps", href: "#services" },
        { name: "AI & Machine Learning", href: "#services" },
        { name: "DevOps & Cloud", href: "#services" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Our Process", href: "#process" },
        { name: "Case Studies", href: "#" },
        { name: "Testimonials", href: "#testimonials" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "FAQ", href: "#faq" },
        { name: "Technical Blog", href: "#" },
        { name: "Pricing Guide", href: "#" },
        { name: "Free Consultation", href: "#contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Security", href: "#" },
        { name: "Money-Back Guarantee", href: "#guarantee" },
      ],
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Animate submission
    const button = e.currentTarget.querySelector(`.${styles.subscribeButton}`);
    if (button) {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer ref={footerRef} className={styles.footerSection}>
      {/* Animated grid pattern */}
      <div className={styles.gridPattern}></div>

      <div className={styles.footerContainer}>
        {/* CTA Section */}
        <div ref={ctaRef} className={styles.ctaSection}>
          <h3 className={styles.ctaTitle}>
            Ready to 3x Your Development Speed?
          </h3>
          <p className={styles.ctaDescription}>
            Join 120+ companies who've transformed their development process
            with our AI-accelerated delivery framework. Get your free strategy
            call today.
          </p>
          <a href="#contact" className={styles.ctaButton}>
            <Sparkles className="w-5 h-5" />
            Start Your Free Consultation
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Newsletter Section */}
        <div className={styles.newsletterSection}>
          <h3 className={styles.newsletterTitle}>
            Get Weekly Development Insights
          </h3>
          <p className={styles.newsletterDescription}>
            Expert tips, case studies, and industry trends delivered to your
            inbox.
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className={styles.newsletterForm}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className={styles.emailInput}
              required
            />
            <button type="submit" className={styles.subscribeButton}>
              Subscribe
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className={styles.brandSection}>
              <Link href="/" className={styles.logoContainer}>
                <div className={styles.logoIcon}></div>
                <Image
                  src="/images/nebulos_logo.svg"
                  alt="NEBULOS"
                  width={120}
                  height={28}
                  className={styles.logoText}
                />
              </Link>

              <p className={styles.brandDescription}>
                We design, build, and scale revenue‑driving products using elite
                talent, AI‑accelerated workflows, and a guarantee that puts all
                the risk on us.
              </p>

              <div className={styles.socialLinks}>
                <a
                  href="#"
                  className={`${styles.socialLink} ${styles.twitter}`}
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className={`${styles.socialLink} ${styles.linkedin}`}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className={`${styles.socialLink} ${styles.github}`}
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="mailto:contact@nebulos.com"
                  className={`${styles.socialLink} ${styles.mail}`}
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>

              {/* Quick stats for credibility */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#ff00ff] mb-1">
                    120+
                  </div>
                  <div className="text-xs text-gray-500">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#00eeff] mb-1">
                    3x
                  </div>
                  <div className="text-xs text-gray-500">Faster</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#9900ff] mb-1">
                    99.9%
                  </div>
                  <div className="text-xs text-gray-500">Uptime</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div ref={linksRef} className="lg:col-span-8">
            <div className={styles.navigationSection}>
              {footerLinks.map((section) => (
                <div key={section.title} className={styles.navColumn}>
                  <h3 className={styles.navTitle}>{section.title}</h3>
                  <ul className={styles.navList}>
                    {section.links.map((link) => (
                      <li key={link.name} className={styles.navItem}>
                        <a href={link.href} className={styles.navLink}>
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

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            &copy; {currentYear} NEBULOS. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className={styles.tagline}>Software that moves markets</span>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span className="text-gray-400">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
