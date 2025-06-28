"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import {
  Send,
  Mic,
  FileText,
  RefreshCw,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./contact.module.scss";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    submitted: false,
    error: false,
  });

  const [inputMethod, setInputMethod] = useState<"form" | "voice">("form");
  const [voiceData, setVoiceData] = useState<string | null>(null);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Create floating particles
      const particles = particlesRef.current?.children;
      if (particles) {
        Array.from(particles).forEach((particle, i) => {
          gsap.set(particle, {
            y: window.innerHeight + 100,
            x: Math.random() * window.innerWidth,
          });

          gsap.to(particle, {
            y: -100,
            duration: Math.random() * 10 + 15,
            repeat: -1,
            ease: "none",
            delay: Math.random() * 5,
          });
        });
      }

      // Form entrance animation
      gsap.fromTo(
        formRef.current,
        {
          y: 60,
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
            trigger: formRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate form fields on focus
      const formFields = document.querySelectorAll(
        `.${styles.input}, .${styles.textarea}`
      );
      formFields.forEach((field) => {
        field.addEventListener("focus", () => {
          gsap.to(field, {
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        field.addEventListener("blur", () => {
          gsap.to(field, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Animate button before submission
    const submitBtn = e.currentTarget.querySelector(`.${styles.submitButton}`);
    if (submitBtn) {
      gsap.to(submitBtn, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }

    // Simulate submission
    setTimeout(() => {
      setFormState({
        ...formState,
        submitted: true,
      });
    }, 500);
  };

  const handleVoiceStop = (duration: number) => {
    if (duration > 2) {
      setIsProcessingVoice(true);
      setTimeout(() => {
        setVoiceData(
          "Hi, my name is Alex Johnson from Acme Solutions. We're looking to build a new SaaS platform for customer relationship management. Please reach out to me at alex.johnson@acme.com to discuss our project requirements."
        );
        setIsProcessingVoice(false);
      }, 2000);
    }
  };

  const extractFormDataFromVoice = () => {
    return {
      name: "Alex Johnson",
      email: "alex.johnson@acme.com",
      company: "Acme Solutions",
      message:
        "We're looking to build a new SaaS platform for customer relationship management. Please reach out to discuss our project requirements.",
    };
  };

  const applyVoiceData = () => {
    if (voiceData) {
      const extractedData = extractFormDataFromVoice();
      setFormState({
        ...formState,
        ...extractedData,
      });
      setInputMethod("form");
    }
  };

  const resetVoiceData = () => {
    setVoiceData(null);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`${styles.contactSection} py-20 lg:py-32`}
    >
      {/* Floating particles */}
      <div ref={particlesRef} className={styles.floatingParticles}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.particle} />
        ))}
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {/* Header */}
          <motion.div
            variants={fadeIn("up")}
            className="mx-auto max-w-4xl text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-[#ff00ff]" />
              <span className="text-sm text-white/80">
                Let's Build Together
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#00eeff]">
                Transform
              </span>{" "}
              Your Business?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Schedule your free strategy call and discover how we can 3x your
              development speed with our AI-accelerated delivery framework.
            </p>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-8 mt-12 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Free 30-min consultation</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <CheckCircle className="w-4 h-4 text-[#ff00ff]" />
                <span>No commitment required</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <CheckCircle className="w-4 h-4 text-[#00eeff]" />
                <span>Response within 24h</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left side - Form */}
            <motion.div
              ref={formRef}
              variants={fadeIn("right", 0.1)}
              className="lg:col-span-7"
            >
              <div className={styles.formContainer}>
                <div className="p-8 lg:p-12">
                  {!formState.submitted ? (
                    <>
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold text-white">
                          Start the Conversation
                        </h3>

                        {/* Input Method Toggle */}
                        <div className="flex bg-black/30 p-1 rounded-full border border-white/10">
                          <button
                            onClick={() => setInputMethod("form")}
                            className={cn(
                              "py-2 px-4 rounded-full flex items-center text-sm font-medium transition-all duration-300",
                              inputMethod === "form"
                                ? "bg-[#9900ff]/20 text-white shadow-lg"
                                : "text-gray-400 hover:text-white"
                            )}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Form
                          </button>
                          <button
                            onClick={() => {
                              setInputMethod("voice");
                              resetVoiceData();
                            }}
                            className={cn(
                              "py-2 px-4 rounded-full flex items-center text-sm font-medium transition-all duration-300",
                              inputMethod === "voice"
                                ? "bg-[#9900ff]/20 text-white shadow-lg"
                                : "text-gray-400 hover:text-white"
                            )}
                          >
                            <Mic className="w-4 h-4 mr-2" />
                            Voice
                          </button>
                        </div>
                      </div>

                      {inputMethod === "form" ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className={styles.formField}>
                            <label htmlFor="name" className={styles.label}>
                              Your Name *
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={formState.name}
                              onChange={handleChange}
                              required
                              className={styles.input}
                              placeholder="Jane Smith"
                            />
                          </div>

                          <div className={styles.formField}>
                            <label htmlFor="email" className={styles.label}>
                              Email Address *
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={formState.email}
                              onChange={handleChange}
                              required
                              className={styles.input}
                              placeholder="jane@company.com"
                            />
                          </div>

                          <div className={styles.formField}>
                            <label htmlFor="company" className={styles.label}>
                              Company
                            </label>
                            <input
                              type="text"
                              name="company"
                              id="company"
                              value={formState.company}
                              onChange={handleChange}
                              className={styles.input}
                              placeholder="Acme Inc."
                            />
                          </div>

                          <div className={styles.formField}>
                            <label htmlFor="message" className={styles.label}>
                              Tell us about your project *
                            </label>
                            <textarea
                              name="message"
                              id="message"
                              rows={5}
                              value={formState.message}
                              onChange={handleChange}
                              required
                              className={styles.textarea}
                              placeholder="I'm looking to build a SaaS platform that..."
                            />
                          </div>

                          <button
                            type="submit"
                            className={`${styles.submitButton} flex items-center justify-center`}
                          >
                            <Send className="h-5 w-5 mr-2" />
                            Schedule Free Strategy Call
                          </button>
                        </form>
                      ) : (
                        <div className={styles.voiceSection}>
                          <div className={styles.voiceContainer}>
                            <p className="text-gray-300 mb-6 text-center">
                              Tell us about yourself, your project, and how to
                              contact you.
                            </p>

                            {!voiceData ? (
                              <div className="bg-black/50 rounded-2xl p-6">
                                <AIVoiceInput
                                  onStart={() => {}}
                                  onStop={handleVoiceStop}
                                />
                              </div>
                            ) : (
                              <div className="space-y-6">
                                <div className="bg-black/50 border border-white/10 rounded-2xl p-6">
                                  <p className="text-white leading-relaxed">
                                    {voiceData}
                                  </p>
                                </div>
                                <div className="flex gap-4">
                                  <button
                                    onClick={resetVoiceData}
                                    className="flex-1 border border-white/20 bg-black/50 text-white rounded-xl py-3 flex items-center justify-center hover:bg-black/70 transition-all duration-300 hover:scale-105"
                                  >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Record Again
                                  </button>
                                  <button
                                    onClick={applyVoiceData}
                                    className="flex-1 bg-gradient-to-r from-[#9900ff] to-[#00eeff] text-white rounded-xl py-3 flex items-center justify-center hover:opacity-90 transition-all duration-300 hover:scale-105"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Use This Data
                                  </button>
                                </div>
                              </div>
                            )}

                            {isProcessingVoice && (
                              <div className="mt-6 flex justify-center items-center text-white">
                                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                <span>Processing your message...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={styles.successState}>
                      <div className={styles.successIcon}>🎉</div>
                      <h3 className={styles.successTitle}>
                        Thanks for reaching out!
                      </h3>
                      <p className={styles.successMessage}>
                        We've received your message and will be in touch within
                        24 hours to schedule your free strategy call.
                      </p>
                      <button
                        onClick={() =>
                          setFormState({ ...formState, submitted: false })
                        }
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
                      >
                        Send Another Message
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right side - Benefits and info */}
            <motion.div
              variants={fadeIn("left", 0.2)}
              className="lg:col-span-5 space-y-8"
            >
              {/* What to expect */}
              <div className={`${styles.benefitsSection}`}>
                <div className={styles.benefitCard}>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#ff00ff]" />
                    What to expect on the call:
                  </h3>
                  <ul className={styles.benefitList}>
                    <li className={styles.benefitItem}>
                      <div className={styles.benefitBullet}></div>
                      <p className={styles.benefitText}>
                        Deep dive into your project goals and challenges
                      </p>
                    </li>
                    <li className={styles.benefitItem}>
                      <div className={styles.benefitBullet}></div>
                      <p className={styles.benefitText}>
                        Technical assessment and recommendation on the best
                        approach
                      </p>
                    </li>
                    <li className={styles.benefitItem}>
                      <div className={styles.benefitBullet}></div>
                      <p className={styles.benefitText}>
                        Timeline and budget assessment with no hard selling
                      </p>
                    </li>
                    <li className={styles.benefitItem}>
                      <div className={styles.benefitBullet}></div>
                      <p className={styles.benefitText}>
                        Quick overview of our process and guarantees
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Quick contact */}
              <div className={`${styles.benefitsSection}`}>
                <div className={styles.benefitCard}>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#9900ff] to-[#00eeff] flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-lg">NS</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        Need help sooner?
                      </h4>
                      <p className="text-gray-400">
                        Get a response within minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <a
                      href="mailto:contact@nebulos.com"
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
                    >
                      <Send className="w-4 h-4" />
                      Email Us
                    </a>
                    <a
                      href="tel:+1234567890"
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#9900ff]/20 to-[#00eeff]/20 border border-white/20 rounded-xl text-white hover:from-[#9900ff]/30 hover:to-[#00eeff]/30 transition-all duration-300 hover:scale-105"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Call Us
                    </a>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-[#ff00ff] mb-2">
                    120+
                  </div>
                  <div className="text-sm text-gray-400">
                    Projects Delivered
                  </div>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-[#00eeff] mb-2">
                    24h
                  </div>
                  <div className="text-sm text-gray-400">Response Time</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
