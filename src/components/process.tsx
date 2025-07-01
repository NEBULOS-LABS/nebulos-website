"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import styles from "./process.module.scss";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

interface Step {
  number: number;
  title: string;
  timeline: string;
  painPoint: string;
  description: string[];
  salesImpact: {
    icon: string;
    text: string;
    metric: string;
  };
  social: {
    testimonial: string;
    author: string;
    company: string;
    result: string;
  };
  visual: {
    icon: string;
    value: string;
    label: string;
    animation: "spinning" | "floating" | "pulsing";
  };
  cta: {
    text: string;
    urgency: string;
  };
}

const PROCESS_STEPS: Step[] = [
  {
    number: 1,
    title: "Strategic Discovery & Risk Elimination",
    timeline: "Days 1-5",
    painPoint:
      "73% of digital projects fail due to poor planning. Don't become a statistic.",
    description: [
      "Deep competitive intelligence & market gap analysis that reveals untapped opportunities",
      "AI-powered strategy blueprint that eliminates guesswork and guarantees product-market fit",
      "Technical architecture roadmap designed for infinite scale and lightning-fast performance",
      "Brand positioning strategy that makes competitors irrelevant before you even launch",
    ],
    salesImpact: {
      icon: "🎯",
      text: "Eliminate the #1 reason startups fail: launching the wrong product",
      metric: "73% failure rate avoided",
    },
    social: {
      testimonial:
        "The discovery phase alone saved us $2M in development costs. They identified market gaps we never saw.",
      author: "Sarah Chen",
      company: "TechFlow AI (YC W23)",
      result: "$2M saved in avoided mistakes",
    },
    visual: {
      icon: "🔍",
      value: "5",
      label: "Days to Clarity",
      animation: "pulsing",
    },
    cta: {
      text: "Secure Your Discovery Session",
      urgency: "Only 3 Q1 spots remaining",
    },
  },
  {
    number: 2,
    title: "AI-Accelerated Development Sprint",
    timeline: "Days 6-90",
    painPoint:
      "While competitors take 12-18 months, you'll launch in 90 days with superior technology.",
    description: [
      "Custom AI models trained on your specific data for unbeatable competitive advantage",
      "Enterprise-grade application built with microservices architecture for unlimited growth",
      "Real-time automation systems that eliminate manual work and scale infinitely",
      "Conversion-optimized UI/UX designed using behavioral psychology for maximum revenue",
    ],
    salesImpact: {
      icon: "🚀",
      text: "Launch 500% faster than traditional development while competitors are still planning",
      metric: "18 months → 90 days",
    },
    social: {
      testimonial:
        "We went from prototype to $1M ARR faster than our Series A competitors went from idea to MVP.",
      author: "Marcus Rodriguez",
      company: "DataSync Pro",
      result: "$1M ARR in 6 months",
    },
    visual: {
      icon: "⚡",
      value: "85",
      label: "Days to Launch",
      animation: "spinning",
    },
    cta: {
      text: "Start Your Sprint",
      urgency: "Early bird saves $15K",
    },
  },
  {
    number: 3,
    title: "Launch & Performance Guarantee",
    timeline: "Days 91-120",
    painPoint:
      "Launch anxiety is real. Will it handle traffic? Will users convert? We guarantee it will.",
    description: [
      "Military-grade security testing and compliance certification for enterprise trust",
      "Performance optimization ensuring 2-second load times even under heavy traffic",
      "A/B testing implementation across all conversion funnels for maximum revenue",
      "24/7 monitoring with instant alerts and automatic scaling for zero downtime",
    ],
    salesImpact: {
      icon: "📈",
      text: "Guaranteed 99.9% uptime and 2x faster speeds than industry average",
      metric: "Zero revenue lost to downtime",
    },
    social: {
      testimonial:
        "Black Friday traffic was 10x normal. Their system didn't even hiccup. $2.3M in sales, zero issues.",
      author: "Jennifer Liu",
      company: "EcoCart Commerce",
      result: "$2.3M flawless launch",
    },
    visual: {
      icon: "🎯",
      value: "99.9%",
      label: "Uptime Guarantee",
      animation: "floating",
    },
    cta: {
      text: "Get Launch Guarantee",
      urgency: "Performance promise included",
    },
  },
  {
    number: 4,
    title: "Exponential Growth & Scale",
    timeline: "Month 4+",
    painPoint:
      "Most agencies disappear after launch. We stay to ensure your 400% ROI becomes 1000%+.",
    description: [
      "AI-driven growth optimization that automatically improves conversion rates monthly",
      "Predictive analytics that identify expansion opportunities before competitors",
      "White-glove scaling support for international markets and enterprise partnerships",
      "Dedicated success manager ensuring continuous 40%+ month-over-month growth",
    ],
    salesImpact: {
      icon: "💰",
      text: "Average client achieves 400% ROI in 6 months, then continues exponential growth",
      metric: "400% ROI → 1000%+ ROI",
    },
    social: {
      testimonial:
        "18 months later: $50M valuation, Series B closed, market leader in our space. Best investment ever.",
      author: "David Park",
      company: "Neural Dynamics (Acquired)",
      result: "$50M valuation achieved",
    },
    visual: {
      icon: "📊",
      value: "∞",
      label: "Unlimited Growth",
      animation: "pulsing",
    },
    cta: {
      text: "Join 500+ Success Stories",
      urgency: "Q1 cohort closing soon",
    },
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isInView, setIsInView] = useState(false);

  // Intersection Observer for efficient scroll detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Optimized GSAP animations
  useEffect(() => {
    if (!timelineRef.current || !isInView) return;

    gsap.config({
      force3D: true,
      nullTargetWarn: false,
    });

    const cards = timelineRef.current.querySelectorAll(`.${styles.stepCard}`);

    cards.forEach((card, index) => {
      const cardElement = card as HTMLElement;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setCurrentStep(index);
              animateCardEntry(cardElement, index);
            }
          });
        },
        { threshold: 0.6 }
      );

      observer.observe(cardElement);
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isInView]);

  // Progressive disclosure animation
  const animateCardEntry = (cardElement: HTMLElement, index: number) => {
    const isLeft = index % 2 === 0;

    gsap
      .timeline()
      .fromTo(
        cardElement,
        {
          opacity: 0,
          x: isLeft ? -100 : 100,
          y: 50,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        }
      )
      .fromTo(
        cardElement.querySelectorAll(".animate-stagger"),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.4"
      );
  };

  return (
    <section className={styles.processSection} ref={sectionRef}>
      {/* Sales-Optimized Header */}
      <div className={styles.processHeader}>
        <div className={styles.headerContent}>
          <div className={styles.urgencyBanner}>
            <span className={styles.urgencyIcon}>⚠️</span>
            <span className={styles.urgencyText}>
              LIMITED AVAILABILITY - Only 3 Q1 2025 spots remaining
            </span>
          </div>

          <div className={styles.badge}>
            <span className={styles.badgeIcon}>🚀</span>
            <span className={styles.badgeText}>Proven Process</span>
          </div>

          <h2 className={styles.title}>
            From Idea to Market Leader in 120 Days
          </h2>

          <p className={styles.subtitle}>
            The only AI-accelerated development process that guarantees 400%
            ROI. Used by 500+ companies including YC startups and Fortune 500
            enterprises.
          </p>

          <div className={styles.headerStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>500+</span>
              <span className={styles.statLabel}>Successful Launches</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>120</span>
              <span className={styles.statLabel}>Days to Market</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>400%</span>
              <span className={styles.statLabel}>Average ROI</span>
            </div>
          </div>

          <div className={styles.guaranteeSection}>
            <div className={styles.guaranteeIcon}>🛡️</div>
            <div className={styles.guaranteeText}>
              <strong>100% Success Guarantee:</strong> If you don't achieve 200%
              ROI in 6 months, we refund everything.
            </div>
          </div>
        </div>
      </div>

      {/* Progressive Timeline */}
      <div className={styles.timelineContainer} ref={timelineRef}>
        <div className={styles.timelineConnector}></div>

        {PROCESS_STEPS.map((step, index) => (
          <div
            key={step.number}
            className={`${styles.stepCard} ${index % 2 === 0 ? styles.leftCard : styles.rightCard}`}
          >
            <div className={styles.cardContent}>
              {/* Step Header */}
              <div className={`${styles.stepHeader} animate-stagger`}>
                <div className={styles.stepNumber}>
                  {step.number.toString().padStart(2, "0")}
                </div>
                <div className={styles.stepMeta}>
                  <div className={styles.stepTimeline}>{step.timeline}</div>
                  <div className={styles.stepTitle}>{step.title}</div>
                </div>
              </div>

              {/* Pain Point */}
              <div className={`${styles.painPoint} animate-stagger`}>
                <div className={styles.painIcon}>⚠️</div>
                <p>{step.painPoint}</p>
              </div>

              {/* Description */}
              <ul className={`${styles.stepDescription} animate-stagger`}>
                {step.description.map((item, itemIndex) => (
                  <li key={itemIndex} className={styles.descriptionItem}>
                    <div className={styles.itemIcon} />
                    <span className={styles.itemText}>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Sales Impact */}
              <div className={`${styles.salesImpact} animate-stagger`}>
                <div className={styles.impactHeader}>
                  <span className={styles.impactIcon}>
                    {step.salesImpact.icon}
                  </span>
                  <span>Business Impact</span>
                </div>
                <p className={styles.impactText}>{step.salesImpact.text}</p>
                <div className={styles.impactMetric}>
                  {step.salesImpact.metric}
                </div>
              </div>

              {/* Social Proof */}
              <div className={`${styles.socialProof} animate-stagger`}>
                <div className={styles.testimonial}>
                  <p>"{step.social.testimonial}"</p>
                  <div className={styles.testimonialAuthor}>
                    <strong>{step.social.author}</strong>
                    <span>{step.social.company}</span>
                  </div>
                  <div className={styles.testimonialResult}>
                    {step.social.result}
                  </div>
                </div>
              </div>

              {/* Visual Metric */}
              <div className={`${styles.visualMetric} animate-stagger`}>
                <span
                  className={`${styles.metricIcon} ${styles[step.visual.animation]}`}
                >
                  {step.visual.icon}
                </span>
                <div className={styles.metricValue}>{step.visual.value}</div>
                <div className={styles.metricLabel}>{step.visual.label}</div>
              </div>

              {/* CTA */}
              <div className={`${styles.stepCta} animate-stagger`}>
                <button className={styles.ctaButton}>
                  <span>{step.cta.text}</span>
                  <span className={styles.ctaIcon}>→</span>
                </button>
                <div className={styles.ctaUrgency}>{step.cta.urgency}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Final CTA Section */}
      <div className={styles.finalCta}>
        <div className={styles.ctaContainer}>
          <h3 className={styles.ctaTitle}>
            Ready to Join 500+ Success Stories?
          </h3>
          <p className={styles.ctaText}>
            Don't let competitors beat you to market. Secure your Q1 2025 spot
            and get:
          </p>

          <div className={styles.ctaBenefits}>
            <div className={styles.benefit}>✅ $15K early bird discount</div>
            <div className={styles.benefit}>✅ 100% success guarantee</div>
            <div className={styles.benefit}>✅ Dedicated success manager</div>
          </div>

          <div className={styles.ctaActions}>
            <button className={styles.primaryCta}>
              <span>Reserve Your Q1 Spot</span>
              <span className={styles.ctaIcon}>🚀</span>
            </button>
            <div className={styles.riskReversal}>
              100% Money-Back Guarantee • No Risk • Cancel Anytime
            </div>
          </div>

          <div className={styles.urgencyFinal}>
            <span className={styles.urgencyIcon}>🔥</span>
            <span>Only 3 spots remaining for Q1 2025 cohort</span>
          </div>
        </div>
      </div>
    </section>
  );
}
