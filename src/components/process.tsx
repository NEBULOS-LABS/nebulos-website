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
  description: string[];
  salesImpact: {
    icon: string;
    text: string;
  };
  visual: {
    icon: string;
    value: string;
    label: string;
    animation: "spinning" | "floating" | "pulsing";
  };
}

const ROADMAP_STEPS: Step[] = [
  {
    number: 1,
    title: "Strategic Discovery & Foundation",
    timeline: "5 Days",
    description: [
      "Deep-dive business analysis and competitive intelligence gathering",
      "AI strategy blueprint tailored specifically to your industry vertical",
      "Technical architecture planning with infinite scalability in mind",
      "Brand identity refinement and market positioning optimization",
    ],
    salesImpact: {
      icon: "🎯",
      text: "Eliminate development guesswork and accelerate project velocity by 300%",
    },
    visual: {
      icon: "🔍",
      value: "5",
      label: "Days Discovery",
      animation: "pulsing",
    },
  },
  {
    number: 2,
    title: "AI-Accelerated Development",
    timeline: "Days 6-90",
    description: [
      "Custom AI model training and seamless system integration",
      "High-performance web application with enterprise-grade architecture",
      "Real-time data processing pipelines and intelligent automation",
      "Advanced UI/UX design with psychological conversion optimization",
    ],
    salesImpact: {
      icon: "🚀",
      text: "Accelerate time-to-market by 500% using cutting-edge AI development tools",
    },
    visual: {
      icon: "⚡",
      value: "85",
      label: "Days Development",
      animation: "spinning",
    },
  },
  {
    number: 3,
    title: "Launch & Performance Optimization",
    timeline: "Days 91-120",
    description: [
      "Comprehensive cross-platform testing and quality assurance protocols",
      "Advanced performance optimization and intelligent caching strategies",
      "Enterprise security hardening and compliance audit completion",
      "Strategic go-live deployment with 24/7 monitoring infrastructure",
    ],
    salesImpact: {
      icon: "📈",
      text: "Guarantee 99.9% uptime and achieve 200% faster page load speeds",
    },
    visual: {
      icon: "🎯",
      value: "30",
      label: "Days Launch",
      animation: "floating",
    },
  },
  {
    number: 4,
    title: "Continuous Growth & Innovation",
    timeline: "Ongoing",
    description: [
      "Advanced analytics implementation and conversion rate optimization",
      "AI-driven A/B testing with personalized user experience delivery",
      "Data-driven feature enhancements based on user behavior insights",
      "Dedicated success manager with white-glove support and consulting",
    ],
    salesImpact: {
      icon: "💰",
      text: "Generate measurable 400% ROI within first 6 months of deployment",
    },
    visual: {
      icon: "📊",
      value: "∞",
      label: "Ongoing Growth",
      animation: "pulsing",
    },
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  // Calculate 3D positions for carousel cards
  const calculate3DPosition = useCallback(
    (index: number, current: number, total: number) => {
      const angle = ((index - current) * 360) / total;
      const radius = 400;
      const x = Math.sin((angle * Math.PI) / 180) * radius;
      const z = Math.cos((angle * Math.PI) / 180) * radius;
      const rotateY = -angle;

      // Determine card state
      let state = "distant";
      const diff = Math.abs(index - current);
      if (diff === 0) state = "active";
      else if (diff === 1 || diff === total - 1) state = "next";

      return { x, z, rotateY, state };
    },
    []
  );

  // Rotate carousel to specific step
  const rotateToStep = useCallback(
    (stepIndex: number) => {
      if (isTransitioning || stepIndex === currentStep) return;

      setIsTransitioning(true);
      setCurrentStep(stepIndex);

      if (!carouselRef.current) return;

      const cards = carouselRef.current.querySelectorAll(
        `.${styles.carouselCard}`
      );

      cards.forEach((card, index) => {
        const cardElement = card as HTMLElement;
        const { x, z, rotateY, state } = calculate3DPosition(
          index,
          stepIndex,
          ROADMAP_STEPS.length
        );

        // Remove all state classes
        cardElement.classList.remove(
          styles.active,
          styles.prev,
          styles.next,
          styles.distant
        );
        cardElement.classList.add(styles[state]);

        // Animate card to new position
        gsap.to(cardElement, {
          x: x,
          z: z,
          rotateY: rotateY,
          duration: 1.2,
          ease: "power3.inOut",
          force3D: true,
        });

        // Special animations for active card
        if (state === "active") {
          const stepNumber = cardElement.querySelector(`.${styles.stepNumber}`);
          if (stepNumber) {
            gsap.fromTo(
              stepNumber,
              { rotation: 0 },
              {
                rotation: 360,
                duration: 1.5,
                ease: "power2.out",
                delay: 0.3,
              }
            );
          }

          // Animate description items
          const descItems = cardElement.querySelectorAll(
            `.${styles.descriptionItem}`
          );
          gsap.fromTo(
            descItems,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              stagger: 0.1,
              delay: 0.8,
              ease: "power2.out",
            }
          );
        }
      });

      // Reset transition state
      setTimeout(() => setIsTransitioning(false), 1200);
    },
    [currentStep, isTransitioning, calculate3DPosition]
  );

  // Navigation functions
  const goToNext = useCallback(() => {
    const nextStep = (currentStep + 1) % ROADMAP_STEPS.length;
    rotateToStep(nextStep);
  }, [currentStep, rotateToStep]);

  const goToPrev = useCallback(() => {
    const prevStep =
      currentStep === 0 ? ROADMAP_STEPS.length - 1 : currentStep - 1;
    rotateToStep(prevStep);
  }, [currentStep, rotateToStep]);

  // Auto-play functionality
  const startAutoPlay = useCallback(() => {
    setIsAutoPlaying(true);
    autoPlayRef.current = setInterval(goToNext, 5000);
  }, [goToNext]);

  const stopAutoPlay = useCallback(() => {
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  }, []);

  const toggleAutoPlay = useCallback(() => {
    if (isAutoPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  }, [isAutoPlaying, startAutoPlay, stopAutoPlay]);

  // Initialize carousel
  useEffect(() => {
    if (!carouselRef.current) return;

    // GSAP configuration for optimal performance
    gsap.config({
      force3D: true,
      nullTargetWarn: false,
      trialWarn: false,
    });

    const cards = carouselRef.current.querySelectorAll(
      `.${styles.carouselCard}`
    );

    // Position cards initially
    cards.forEach((card, index) => {
      const cardElement = card as HTMLElement;
      const { x, z, rotateY, state } = calculate3DPosition(
        index,
        0,
        ROADMAP_STEPS.length
      );

      // Set initial position and state
      gsap.set(cardElement, {
        x: x,
        z: z,
        rotateY: rotateY,
        transformOrigin: "center center",
        force3D: true,
      });

      cardElement.classList.add(styles[state]);
    });

    // Animate cards in on load
    gsap.fromTo(
      cards,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.5,
      }
    );

    // Keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          goToPrev();
          break;
        case "ArrowRight":
          event.preventDefault();
          goToNext();
          break;
        case " ":
          event.preventDefault();
          toggleAutoPlay();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Auto-start auto-play after a delay
    const autoStartTimer = setTimeout(() => {
      startAutoPlay();
    }, 8000);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(autoStartTimer);
      stopAutoPlay();
    };
  }, [
    calculate3DPosition,
    goToNext,
    goToPrev,
    toggleAutoPlay,
    startAutoPlay,
    stopAutoPlay,
  ]);

  return (
    <section className={styles.processSection} ref={sectionRef}>
      {/* Enhanced Header */}
      <div className={styles.processHeader}>
        <div className={styles.headerContent}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>⚡</span>
            <span className={styles.badgeText}>Our Process</span>
          </div>

          <h2 className={styles.title}>From Vision to Reality</h2>

          <p className={styles.subtitle}>
            A revolutionary 4-step process that transforms your business idea
            into a market-dominating AI-powered solution in just 120 days.
          </p>

          <div className={styles.headerStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>120</span>
              <span className={styles.statLabel}>Days to Launch</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>500%</span>
              <span className={styles.statLabel}>Faster Development</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>400%</span>
              <span className={styles.statLabel}>ROI Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Rotating Gallery */}
      <div className={styles.galleryContainer}>
        <div className={styles.carouselWheel} ref={carouselRef}>
          {ROADMAP_STEPS.map((step, index) => (
            <div key={step.number} className={styles.carouselCard}>
              <div className={styles.cardContent}>
                {/* Card Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.stepNumber}>{step.number}</div>
                  <div className={styles.stepBadge}>{step.timeline}</div>
                </div>

                {/* Card Body */}
                <div className={styles.cardBody}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>

                  <ul className={styles.stepDescription}>
                    {step.description.map((item, itemIndex) => (
                      <li key={itemIndex} className={styles.descriptionItem}>
                        <div className={styles.itemIcon} />
                        <span className={styles.itemText}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer */}
                <div className={styles.cardFooter}>
                  <div className={styles.salesImpact}>
                    <div className={styles.impactHeader}>
                      <span className={styles.impactIcon}>
                        {step.salesImpact.icon}
                      </span>
                      Business Impact
                    </div>
                    <p className={styles.impactText}>{step.salesImpact.text}</p>
                  </div>

                  <div className={styles.visualMetric}>
                    <span
                      className={`${styles.metricIcon} ${styles[step.visual.animation]}`}
                    >
                      {step.visual.icon}
                    </span>
                    <div className={styles.metricValue}>
                      {step.visual.value}
                    </div>
                    <div className={styles.metricLabel}>
                      {step.visual.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Controls */}
        <div className={styles.galleryControls}>
          <button
            className={`${styles.navArrow} ${currentStep === 0 ? styles.disabled : ""}`}
            onClick={goToPrev}
            disabled={isTransitioning}
            aria-label="Previous step"
          >
            ←
          </button>

          <div className={styles.dotsContainer}>
            {ROADMAP_STEPS.map((_, index) => (
              <button
                key={index}
                className={`${styles.navDot} ${index === currentStep ? styles.active : ""}`}
                onClick={() => rotateToStep(index)}
                disabled={isTransitioning}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          <button
            className={`${styles.navArrow} ${currentStep === ROADMAP_STEPS.length - 1 ? styles.disabled : ""}`}
            onClick={goToNext}
            disabled={isTransitioning}
            aria-label="Next step"
          >
            →
          </button>

          <button
            className={`${styles.autoPlayToggle} ${isAutoPlaying ? styles.active : ""}`}
            onClick={toggleAutoPlay}
            aria-label={isAutoPlaying ? "Pause auto-play" : "Start auto-play"}
          >
            {isAutoPlaying ? "⏸" : "▶"}
          </button>
        </div>
      </div>

      {/* Section Footer with CTA */}
      <div className={styles.sectionFooter}>
        <div className={styles.ctaContainer}>
          <h3 className={styles.ctaTitle}>Ready to Transform Your Business?</h3>
          <p className={styles.ctaText}>
            Join 500+ companies that have accelerated their growth with our
            proven process. Start your transformation today.
          </p>
          <a href="#contact" className={styles.ctaButton}>
            <span className={styles.buttonText}>Start Your Project</span>
            <span className={styles.buttonIcon}>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
