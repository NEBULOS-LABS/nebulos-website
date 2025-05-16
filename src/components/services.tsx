"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import Image from "next/image";
import Link from "next/link";

export default function Services() {
  const services = [
    {
      title: "SaaS & Web Apps",
      description:
        "Full-stack platforms with robust backend architecture and conversion-focused UX.",
      features: [
        "React/Next.js/Vue",
        "Node/Python/Ruby",
        "CI/CD Pipelines",
        "Auth & Permissions",
      ],
      icon: "💻",
      image: "/images/Computer_screen_cool_image.png",
    },
    {
      title: "Mobile Apps",
      description: "Native and cross-platform apps with world-class UX.",
      features: [
        "React Native/Flutter",
        "iOS/Android",
        "API Integration",
        "Offline Capabilities",
      ],
      icon: "📱",
      image: "/images/Cool_phone_image.png",
    },
    {
      title: "AI & Machine Learning",
      description:
        "Integrating intelligent algorithms to create predictive, adaptive systems.",
      features: [
        "OpenAI/GPT Integration",
        "Data Pipelines",
        "Predictive Analytics",
        "LLM Fine-tuning",
      ],
      icon: "🧠",
      image: "/images/nebula_cloud_image_header_or_hero.png",
    },
    {
      title: "DevOps & Infrastructure",
      description:
        "Cloud architecture that scales with your business and optimizes for cost.",
      features: [
        "AWS/GCP/Azure",
        "Kubernetes",
        "Terraform",
        "Monitoring & Alerts",
      ],
      icon: "🔧",
      image: "/images/scissors_cutting_ribbons_cool_image.png",
    },
  ];

  return (
    <section
      id="services"
      className="relative bg-black overflow-hidden py-20 lg:py-28"
    >
      {/* Design elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute top-1/3 left-40 w-80 h-80 bg-[#9900ff]/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/3 right-40 w-80 h-80 bg-[#00eeff]/20 blur-[100px] rounded-full" />

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
            <h2 className="section-title">What We Build</h2>
            <p className="section-subtitle mt-6">
              End-to-end development across platforms, technologies, and
              industries
            </p>
          </motion.div>

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeIn(
                  index % 2 === 0 ? "right" : "left",
                  0.1 * index
                )}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#9900ff] to-[#00eeff] opacity-30 blur-sm rounded-2xl group-hover:opacity-50 transition-opacity duration-300" />
                <div className="relative flex flex-col h-full bg-black/60 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60" />
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-2xl">
                      {service.icon}
                    </div>
                  </div>

                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-bold text-white mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 mb-6">{service.description}</p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-gray-300"
                        >
                          <span className="text-[#ff00ff] mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href="#contact"
                      className="btn-secondary-sm w-full text-center"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional services banner */}
          <motion.div
            variants={fadeIn("up", 0.4)}
            className="mt-16 relative rounded-xl overflow-hidden"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#00eeff] opacity-30 blur-sm" />
            <div className="relative bg-black/60 backdrop-blur-sm p-8 rounded-xl border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Need something custom?
                  </h3>
                  <p className="text-gray-300 mb-4">
                    We also specialize in embedded systems, data engineering,
                    and enterprise integrations. Tell us about your unique
                    challenge.
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <Link href="#contact" className="btn-primary">
                    Start a Conversation
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
