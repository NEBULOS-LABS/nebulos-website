"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { Send, Mic, FileText, RefreshCw, Mail, Phone } from "lucide-react";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const LaserFlow = dynamic(() => import("@/components/LaserFlow"), {
  ssr: false,
});

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

  // Dynamic beam offset tracking — solves RC-1 (animation timing) and RC-2 (viewport sync)
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [beamOffset, setBeamOffset] = useState({ h: -0.15, v: 0.182 });

  const computeBeamOffsets = useCallback(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section || !card) return;

    const sR = section.getBoundingClientRect();
    const cR = card.getBoundingClientRect();
    if (sR.width < 1 || sR.height < 1) return;

    const borderRadius = 32; // 2rem
    const targetX = (cR.left - sR.left) + borderRadius + cR.width * 0.20;
    const targetY = (cR.top - sR.top) + borderRadius - cR.height * 0.10;

    const h = (targetX / sR.width) - 0.5;
    const v = 0.5 - (targetY / sR.height);
    setBeamOffset((prev) =>
      Math.abs(prev.h - h) < 0.001 && Math.abs(prev.v - v) < 0.001
        ? prev
        : { h, v }
    );
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section || !card) return;

    // Safety fallback: measure after Framer Motion animations complete (~0.9s)
    const timer = setTimeout(computeBeamOffsets, 1200);

    let rafId = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(computeBeamOffsets);
    });
    ro.observe(section);
    ro.observe(card);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [computeBeamOffsets]);

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
    setFormState({
      ...formState,
      submitted: true,
    });
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
      className="relative bg-black pt-20 lg:pt-32 pb-10 lg:pb-16"
    >
      {/* Design elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#9900ff]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#00eeff]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* LaserFlow full section background — beam starts from top, contact point half-behind card */}
      <div className="absolute inset-0 z-[1] overflow-hidden">
        <LaserFlow
          horizontalBeamOffset={beamOffset.h}
          verticalBeamOffset={beamOffset.v}
          verticalSizing={0.6}
          horizontalSizing={0.105}
          fogIntensity={0.15}
          fogScale={0.09}
          falloffStart={0.3}
          wispIntensity={2.5}
          className=""
          style={{}}
          dpr={undefined}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            variants={fadeIn("up")}
            className="mx-auto max-w-3xl text-center mb-16 lg:mb-24"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tighter mb-6">
              Let's Build Something<br className="hidden md:block" />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9900ff] to-[#00eeff]">
                Exceptional.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Schedule your free strategy call and see if we're the right fit
              for your next major leap.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

            {/* Left side - Form */}
            <motion.div variants={fadeIn("right", 0.1)} className="lg:col-span-7" onAnimationComplete={computeBeamOffsets}>
              <div ref={cardRef} className="relative rounded-[2rem] p-[1px] overflow-hidden group">
                {/* Border glow — concentrated at top-left for beam-hugging effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#9900ff]/25 via-[#9900ff]/[0.03] to-transparent z-0" />
                <div className="absolute top-0 left-0 w-2/3 h-1/2 bg-gradient-to-br from-[#00eeff]/20 to-transparent z-0" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#9900ff]/30 to-[#00eeff]/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 z-0" />

                <div className="relative z-10 bg-[#0b0b14] rounded-[2rem] p-8 sm:p-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden">
                  {/* Internal ambient glow — shifted to top-left to match beam */}
                  <div className="absolute -top-5 -left-5 w-[250px] h-[150px] bg-[#9900ff]/12 blur-[50px] pointer-events-none rounded-full" />

                      {!formState.submitted ? (
                        <>
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-10">
                            <h3 className="text-2xl pt-1 font-semibold text-white tracking-tight">
                              Start the Conversation
                            </h3>

                            {/* DesignCode UI style Segmented Control */}
                            <div className="flex bg-[#13131a] p-1 rounded-xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-white/[0.05]">
                              <button
                                onClick={() => setInputMethod("form")}
                                className={cn(
                                  "py-2 px-5 rounded-lg flex items-center text-sm font-medium transition-all duration-300",
                                  inputMethod === "form"
                                    ? "bg-[#20202a] text-white shadow-md border border-white/[0.05]"
                                    : "text-gray-500 hover:text-white"
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
                                  "py-2 px-5 rounded-lg flex items-center text-sm font-medium transition-all duration-300",
                                  inputMethod === "voice"
                                    ? "bg-[#20202a] text-white shadow-md border border-white/[0.05]"
                                    : "text-gray-500 hover:text-white"
                                )}
                              >
                                <Mic className="w-4 h-4 mr-2" />
                                Voice
                              </button>
                            </div>
                          </div>

                          {inputMethod === "form" ? (
                            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                  <label htmlFor="name" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                    Your Name
                                  </label>
                                  <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formState.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-3.5 bg-[#13131a] border border-white/[0.05] rounded-xl text-white placeholder-gray-600 focus:bg-[#1a1a24] focus:border-white/10 focus:outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] transition-all duration-300"
                                    placeholder="Jane Smith"
                                  />
                                </div>
                                <div>
                                  <label htmlFor="email" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                    Email Address
                                  </label>
                                  <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formState.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-3.5 bg-[#13131a] border border-white/[0.05] rounded-xl text-white placeholder-gray-600 focus:bg-[#1a1a24] focus:border-white/10 focus:outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] transition-all duration-300"
                                    placeholder="jane@company.com"
                                  />
                                </div>
                              </div>
                              <div>
                                <label htmlFor="company" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                  Company (Optional)
                                </label>
                                <input
                                  type="text"
                                  name="company"
                                  id="company"
                                  value={formState.company}
                                  onChange={handleChange}
                                  className="w-full px-5 py-3.5 bg-[#13131a] border border-white/[0.05] rounded-xl text-white placeholder-gray-600 focus:bg-[#1a1a24] focus:border-white/10 focus:outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] transition-all duration-300"
                                  placeholder="Acme Inc."
                                />
                              </div>
                              <div>
                                <label htmlFor="message" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                  Project Details
                                </label>
                                <textarea
                                  name="message"
                                  id="message"
                                  rows={4}
                                  value={formState.message}
                                  onChange={handleChange}
                                  required
                                  className="w-full px-5 py-3.5 bg-[#13131a] border border-white/[0.05] rounded-xl text-white placeholder-gray-600 focus:bg-[#1a1a24] focus:border-white/10 focus:outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] transition-all duration-300 resize-none"
                                  placeholder="I'm looking to build..."
                                />
                              </div>
                              <div className="pt-4">
                                <button
                                  type="submit"
                                  className="w-full group py-4 flex items-center justify-center bg-gradient-to-b from-[#ffffff] to-[#d4d4d8] text-black text-sm font-bold rounded-xl hover:opacity-90 transition-all duration-300 shadow-[0_4px_14px_0_rgba(255,255,255,0.25)] relative overflow-hidden"
                                >
                                  <div className="absolute inset-0 bg-white/20 blur-md rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                                  <span className="relative z-10 flex items-center">
                                    <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                    Schedule Strategy Call
                                  </span>
                                </button>
                              </div>
                            </form>
                          ) : (
                            <div className="space-y-6 pt-4 relative z-10">
                              <div className="bg-[#13131a] border border-white/[0.05] rounded-2xl p-6 sm:p-10 text-center flex flex-col items-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
                                <p className="text-gray-400 mb-8 max-w-sm">
                                  Speak naturally. Describe your project, your timeline, and anything we should know.
                                </p>
                                {!voiceData ? (
                                  <div className="w-full max-w-sm">
                                    <AIVoiceInput
                                      onStart={() => {}}
                                      onStop={handleVoiceStop}
                                    />
                                  </div>
                                ) : (
                                  <div className="space-y-6 w-full text-left">
                                    <div className="bg-[#1a1a24] border border-white/[0.05] rounded-xl p-5 relative overflow-hidden">
                                      <div className="absolute top-0 left-0 w-1 bg-gradient-to-b from-[#9900ff] to-[#00eeff] h-full" />
                                      <p className="text-gray-300 text-sm italic font-light leading-relaxed pl-2">
                                        "{voiceData}"
                                      </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-4">
                                      <button
                                        onClick={resetVoiceData}
                                        className="flex-1 border border-white/[0.05] bg-[#20202a] text-gray-400 hover:text-white rounded-xl py-3 flex items-center justify-center transition-all shadow-sm text-sm font-semibold"
                                      >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Try Again
                                      </button>
                                      <button
                                        onClick={applyVoiceData}
                                        className="flex-1 bg-gradient-to-r from-[#9900ff] to-[#00eeff] text-white rounded-xl py-3 flex items-center justify-center hover:opacity-90 transition-all text-sm font-semibold shadow-[0_0_20px_rgba(153,0,255,0.2)]"
                                      >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Extract Data
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {isProcessingVoice && (
                                  <div className="mt-8 flex justify-center items-center text-gray-400 text-sm font-medium">
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin text-[#00eeff]" />
                                    AI is analyzing your message...
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-20 px-6 relative z-10">
                          <div className="w-20 h-20 mx-auto bg-[#13131a] border border-white/[0.05] rounded-full flex items-center justify-center mb-6 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]">
                            <Send className="w-8 h-8 text-[#00eeff]" />
                          </div>
                          <h3 className="text-3xl font-semibold text-white mb-4 tracking-tight">
                            Message Received
                          </h3>
                          <p className="text-gray-400 mb-10 max-w-sm mx-auto leading-relaxed">
                            We've captured your details. Our team will review them and reach out within 24 hours to book your call.
                          </p>
                          <button
                            onClick={() =>
                              setFormState({ ...formState, submitted: false })
                            }
                            className="px-6 py-3 border border-white/[0.05] bg-[#20202a] text-white rounded-xl text-sm font-semibold hover:bg-[#2a2a35] transition-colors shadow-sm"
                          >
                            Send Another Message
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
            </motion.div>

            {/* Right side - Information & Contact alternatives */}
            <motion.div
              variants={fadeIn("left", 0.2)}
              className="lg:col-span-5 flex flex-col h-full gap-6"
            >
              {/* Premium dark card mimicking DesignCode UI popover/menu style */}
              <div className="relative rounded-[2rem] p-[1px] overflow-hidden group flex-grow">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/[0.02] to-transparent z-0" />
                <div className="relative z-10 bg-[#0b0b14]/90 backdrop-blur-3xl rounded-[2rem] p-8 sm:p-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] h-full flex flex-col justify-center overflow-hidden">
                  {/* Subtle corner light */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00eeff]/5 blur-3xl pointer-events-none" />

                  <h3 className="text-xl font-semibold text-white mb-8">
                    What to expect on the call
                  </h3>
                  <ul className="space-y-6">
                    {[
                      "A deep dive into your project goals and challenges.",
                      "Technical assessment and recommendation on the best approach.",
                      "Timeline and budget assessment with no hard selling.",
                      "A quick overview of our process and guarantees.",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#1a1a24] border border-white/[0.05] flex items-center justify-center mt-0.5 mr-4 font-bold text-[11px] text-[#00eeff] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                          {i + 1}
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed pt-1">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sleek bottom card for direct lines */}
              <div className="relative rounded-3xl p-[1px] overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/10 z-0" />
                <div className="relative z-10 bg-gradient-to-br from-[#12121a] to-[#0A0A0F] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1 text-center sm:text-left">
                      Need an immediate response?
                    </h4>
                    <p className="text-gray-500 text-[13px] text-center sm:text-left">
                      Reach us directly on our hotlines.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href="mailto:contact@nebulos.com"
                      className="w-11 h-11 rounded-xl bg-[#1a1a24] hover:bg-[#20202a] flex items-center justify-center text-white transition-all duration-300 border border-white/[0.05] shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                      aria-label="Email us"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    <a
                      href="tel:+1234567890"
                      className="w-11 h-11 rounded-xl bg-[#1a1a24] hover:bg-[#20202a] flex items-center justify-center text-white transition-all duration-300 border border-white/[0.05] shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                      aria-label="Call us"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
