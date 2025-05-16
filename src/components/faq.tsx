"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { Plus, Minus } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How long does a typical project take?",
      answer:
        "While every project is unique, our typical timeline looks like: 1 week for initial roadmapping, followed by 2-week sprint cycles. An MVP usually takes 6-8 weeks from kickoff to launch, while full-scale products range from 3-6 months. Our AI-accelerated approach typically delivers 27% faster than traditional development methods.",
    },
    {
      question: "What's your pricing model?",
      answer:
        "We offer several engagement models: Sprint-based pricing (most popular), where you pay per 2-week sprint with a dedicated team; Project-based fixed pricing for well-defined scopes; and Monthly retainers for ongoing development and maintenance. All come with our Sprint-Back Guarantee—you only pay for work that meets your approval.",
    },
    {
      question: "How do you ensure code quality?",
      answer:
        "Every line of code goes through our 5-layer quality system: Automated testing (unit, integration, E2E), AI-powered code analysis to detect potential issues before they emerge, senior developer peer reviews, QA testing on real devices, and our lifetime bug-fix guarantee. This approach results in 38% fewer bugs compared to traditional development.",
    },
    {
      question: "Do I own all the intellectual property?",
      answer:
        "Absolutely. 100% of the IP belongs to you from day one. We provide complete ownership of all code, assets, and documentation created during our engagement. We use a secure GitHub or GitLab repository that transfers to your control, and we sign comprehensive IP agreements before work begins.",
    },
    {
      question: "How does the Sprint-Back Guarantee work?",
      answer:
        "At the end of each 2-week sprint, we demo working software. If we don't meet the sprint goals we agreed upon at the start of the sprint, you don't pay for that sprint. It's that simple. We've only had to honor this guarantee twice in over 120 projects—both times due to shifting requirements, and we still delivered the work in the following sprint.",
    },
    {
      question: "What happens after the product launches?",
      answer:
        "We offer several post-launch options: Ongoing development through additional sprints for new features; Maintenance plans to keep everything running smoothly; Training for your team to take over; Extended team partnerships where we continue working alongside your in-house resources. Many clients choose a hybrid approach starting with full engagement that gradually transitions to your team.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative bg-black overflow-hidden py-20 lg:py-28"
    >
      {/* Design elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-[#9900ff]/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-[#00eeff]/20 blur-[100px] rounded-full" />

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
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle mt-6">
              Everything you need to know about working with us
            </p>
          </motion.div>

          <div className="mx-auto max-w-3xl">
            <div className="divide-y divide-white/10">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn("up", index * 0.1)}
                  className="py-6"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-start justify-between text-left focus:outline-none"
                  >
                    <h3 className="text-xl font-semibold text-white pr-6">
                      {faq.question}
                    </h3>
                    <span className="flex-shrink-0 rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20 transition-colors">
                      {openIndex === index ? (
                        <Minus className="h-5 w-5" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openIndex === index ? "auto" : 0,
                      opacity: openIndex === index ? 1 : 0,
                      marginTop: openIndex === index ? 16 : 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-300">{faq.answer}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            variants={fadeIn("up", 0.4)}
            className="mt-16 text-center"
          >
            <p className="text-gray-400 mb-6">
              Have more questions? We're here to help.
            </p>
            <a href="#contact" className="btn-secondary inline-block">
              Contact Us
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
