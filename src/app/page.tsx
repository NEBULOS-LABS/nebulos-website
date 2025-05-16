"use client";

import React from "react";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Problem from "@/components/problem";
import Solution from "@/components/solution";
import Testimonials from "@/components/testimonials";
import Process from "@/components/process";
import Services from "@/components/services";
import Guarantee from "@/components/guarantee";
import FAQ from "@/components/faq";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Problem Section */}
      <Problem />

      {/* Solution Section */}
      <Solution />

      {/* Social Proof Section */}
      <Testimonials />

      {/* Process Section */}
      <Process />

      {/* Services Section */}
      <Services />

      {/* Guarantee Section */}
      <Guarantee />

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Section */}
      <Contact />

      <Footer />
    </main>
  );
}
