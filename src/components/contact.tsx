"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { Send, Mic, FileText, RefreshCw } from "lucide-react";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { cn } from "@/lib/utils";

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
    // In a real implementation, you would submit to your backend
    // For demo purposes, we'll just simulate success
    setFormState({
      ...formState,
      submitted: true,
    });
  };

  const handleVoiceStop = (duration: number) => {
    if (duration > 2) {
      // Only process if the recording is longer than 2 seconds
      setIsProcessingVoice(true);

      // Simulate processing with LLM
      setTimeout(() => {
        // In a real implementation, this would be the result from an LLM processing the audio
        setVoiceData(
          "Hi, my name is Alex Johnson from Acme Solutions. We're looking to build a new SaaS platform for customer relationship management. Please reach out to me at alex.johnson@acme.com to discuss our project requirements."
        );
        setIsProcessingVoice(false);
      }, 2000);
    }
  };

  const extractFormDataFromVoice = () => {
    // This would be handled by a real LLM in production
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
      id="contact"
      className="relative bg-black overflow-hidden py-20 lg:py-28"
    >
      {/* Design elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#9900ff]/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#00eeff]/20 blur-[100px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div
            variants={fadeIn("up")}
            className="mx-auto max-w-3xl text-center mb-16"
          >
            <h2 className="section-title">Let's Build Something Exceptional</h2>
            <p className="section-subtitle mt-6">
              Schedule your free strategy call and see if we're the right fit
              for your project
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left side - Form */}
            <motion.div variants={fadeIn("right", 0.1)}>
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#9900ff] to-[#00eeff] opacity-30 blur-sm" />
                <div className="relative bg-black/70 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  {!formState.submitted ? (
                    <>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-white">
                          Start the Conversation
                        </h3>

                        {/* Input Method Toggle */}
                        <div className="flex bg-black/30 p-1 rounded-lg border border-white/10">
                          <button
                            onClick={() => setInputMethod("form")}
                            className={cn(
                              "py-1.5 px-3 rounded-md flex items-center text-sm font-medium transition-colors",
                              inputMethod === "form"
                                ? "bg-[#9900ff]/20 text-white"
                                : "text-gray-400 hover:text-white"
                            )}
                          >
                            <FileText className="w-4 h-4 mr-1.5" />
                            Form
                          </button>
                          <button
                            onClick={() => {
                              setInputMethod("voice");
                              resetVoiceData();
                            }}
                            className={cn(
                              "py-1.5 px-3 rounded-md flex items-center text-sm font-medium transition-colors",
                              inputMethod === "voice"
                                ? "bg-[#9900ff]/20 text-white"
                                : "text-gray-400 hover:text-white"
                            )}
                          >
                            <Mic className="w-4 h-4 mr-1.5" />
                            Voice
                          </button>
                        </div>
                      </div>

                      {inputMethod === "form" ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-400 mb-2"
                            >
                              Your Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={formState.name}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#ff00ff] focus:border-transparent transition duration-200"
                              placeholder="Jane Smith"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-400 mb-2"
                            >
                              Email Address
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={formState.email}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#ff00ff] focus:border-transparent transition duration-200"
                              placeholder="jane@company.com"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="company"
                              className="block text-sm font-medium text-gray-400 mb-2"
                            >
                              Company (Optional)
                            </label>
                            <input
                              type="text"
                              name="company"
                              id="company"
                              value={formState.company}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#ff00ff] focus:border-transparent transition duration-200"
                              placeholder="Acme Inc."
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="message"
                              className="block text-sm font-medium text-gray-400 mb-2"
                            >
                              Tell us about your project
                            </label>
                            <textarea
                              name="message"
                              id="message"
                              rows={4}
                              value={formState.message}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#ff00ff] focus:border-transparent transition duration-200"
                              placeholder="I'm looking to build..."
                            />
                          </div>
                          <div>
                            <button
                              type="submit"
                              className="w-full btn-primary py-3 flex items-center justify-center"
                            >
                              <Send className="h-5 w-5 mr-2" />
                              Schedule Free Strategy Call
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-6">
                          <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                            <p className="text-gray-300 mb-4 text-center">
                              Tell us about yourself, your project, and how to
                              contact you.
                            </p>

                            {!voiceData ? (
                              <div className="bg-black/50 rounded-lg p-4">
                                <AIVoiceInput
                                  onStart={() => {}}
                                  onStop={handleVoiceStop}
                                />
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="bg-black/50 border border-white/10 rounded-lg p-4">
                                  <p className="text-white text-sm">
                                    {voiceData}
                                  </p>
                                </div>
                                <div className="flex space-x-3">
                                  <button
                                    onClick={resetVoiceData}
                                    className="flex-1 border border-white/20 bg-black/50 text-white rounded-lg py-2 flex items-center justify-center hover:bg-black/70 transition-colors"
                                  >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Record Again
                                  </button>
                                  <button
                                    onClick={applyVoiceData}
                                    className="flex-1 bg-gradient-to-r from-[#9900ff] to-[#00eeff] text-white rounded-lg py-2 flex items-center justify-center hover:opacity-90 transition-opacity"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Use This Data
                                  </button>
                                </div>
                              </div>
                            )}

                            {isProcessingVoice && (
                              <div className="mt-4 flex justify-center items-center text-white">
                                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                Processing your message...
                              </div>
                            )}
                          </div>

                          {!voiceData && (
                            <div>
                              <button
                                onClick={() => setInputMethod("form")}
                                className="w-full border border-white/20 bg-black/50 text-white rounded-lg py-3 flex items-center justify-center hover:bg-black/70 transition-colors"
                              >
                                <FileText className="h-5 w-5 mr-2" />
                                Switch to Form Input
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-6">🎉</div>
                      <h3 className="text-2xl font-bold text-white mb-4">
                        Thanks for reaching out!
                      </h3>
                      <p className="text-gray-300 mb-8">
                        We've received your message and will be in touch within
                        24 hours to schedule your free strategy call.
                      </p>
                      <button
                        onClick={() =>
                          setFormState({ ...formState, submitted: false })
                        }
                        className="btn-secondary"
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
              className="flex flex-col h-full justify-between"
            >
              <div className="relative rounded-2xl overflow-hidden mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#00eeff] opacity-30 blur-sm" />
                <div className="relative bg-black/70 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6">
                    What to expect on the call:
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="text-[#ff00ff] mr-2">•</span>
                      <p className="text-gray-300">
                        A deep dive into your project goals and challenges
                      </p>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#ff00ff] mr-2">•</span>
                      <p className="text-gray-300">
                        Technical assessment and recommendation on the best
                        approach
                      </p>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#ff00ff] mr-2">•</span>
                      <p className="text-gray-300">
                        Timeline and budget assessment with no hard selling
                      </p>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#ff00ff] mr-2">•</span>
                      <p className="text-gray-300">
                        A quick overview of our process and guarantees
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#9900ff] to-[#00eeff] opacity-30 blur-sm" />
                <div className="relative bg-black/70 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <div className="flex items-center mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#9900ff] to-[#00eeff] opacity-70" />
                      <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-lg">
                        NS
                      </div>
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
                  <div className="flex space-x-4">
                    <a
                      href="mailto:contact@nebulos.com"
                      className="flex-1 btn-secondary-sm flex items-center justify-center"
                    >
                      Email Us
                    </a>
                    <a
                      href="tel:+1234567890"
                      className="flex-1 btn-secondary-sm flex items-center justify-center"
                    >
                      Call Us
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
