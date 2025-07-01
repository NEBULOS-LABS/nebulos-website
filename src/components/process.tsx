"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import styles from "./process.module.scss";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);
}

// Interactive Sales Elements Interfaces
interface ROICalculatorState {
  currentDevCost: number;
  teamSize: number;
  projectDuration: number;
  calculatedSavings: number;
  calculatedROI: number;
}

interface TestimonialData {
  quote: string;
  author: string;
  company: string;
  result: string;
  additionalMetric?: string;
}

interface TrustBadgeData {
  icon: string;
  text: string;
  description: string;
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
  // Enhanced with multiple testimonials for carousel
  testimonials?: TestimonialData[];
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
  // Add interactive elements per step
  interactiveElements?: {
    roiCalculator?: boolean;
    testimonialCarousel?: boolean;
    trustBadges?: string[];
    completionReward?: string;
  };
}

// Trust badges data
const TRUST_BADGES: TrustBadgeData[] = [
  {
    icon: "🛡️",
    text: "100% Success Guarantee",
    description: "200% ROI or full refund",
  },
  {
    icon: "🚀",
    text: "Y Combinator Portfolio",
    description: "Trusted by 50+ YC startups",
  },
  {
    icon: "🔒",
    text: "Enterprise Security",
    description: "SOC 2 Type II certified",
  },
  {
    icon: "⚡",
    text: "Lightning Fast",
    description: "2x faster than industry average",
  },
  {
    icon: "🏆",
    text: "Award Winning",
    description: "Best AI Development Agency 2024",
  },
];

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
    testimonials: [
      {
        quote:
          "The discovery phase alone saved us $2M in development costs. They identified market gaps we never saw.",
        author: "Sarah Chen",
        company: "TechFlow AI (YC W23)",
        result: "$2M saved in avoided mistakes",
        additionalMetric: "500% faster market research",
      },
      {
        quote:
          "Their strategic blueprint was so thorough, our Series A investors were blown away. 10x better than traditional consulting.",
        author: "Michael Torres",
        company: "CloudScale Analytics",
        result: "Series A secured in 30 days",
        additionalMetric: "$15M funding raised",
      },
      {
        quote:
          "Instead of building the wrong product for 18 months, we had perfect product-market fit in 5 days.",
        author: "Lisa Wang",
        company: "FinTech Innovations",
        result: "Perfect PMF achieved",
        additionalMetric: "18 months → 5 days",
      },
    ],
    visual: {
      icon: "🔍",
      value: "5",
      label: "Days to Clarity",
      animation: "pulsing",
    },
    cta: {
      text: "Calculate Your Savings",
      urgency: "Free ROI calculation included",
    },
    interactiveElements: {
      roiCalculator: true,
      trustBadges: ["🛡️", "🚀"],
      completionReward: "Discovery Blueprint Unlocked",
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
    testimonials: [
      {
        quote:
          "We went from prototype to $1M ARR faster than our Series A competitors went from idea to MVP.",
        author: "Marcus Rodriguez",
        company: "DataSync Pro",
        result: "$1M ARR in 6 months",
        additionalMetric: "500% faster than competitors",
      },
      {
        quote:
          "Their AI development approach gave us features that would have taken 2 years to build. Now we're market leaders.",
        author: "Amanda Chen",
        company: "RoboTech Solutions",
        result: "Market leadership achieved",
        additionalMetric: "2 years → 3 months",
      },
      {
        quote:
          "The microservices architecture they built scales to millions of users. We handled 10x traffic with zero issues.",
        author: "Ryan Kumar",
        company: "StreamFlow Media",
        result: "Infinite scalability",
        additionalMetric: "10x traffic handled flawlessly",
      },
    ],
    visual: {
      icon: "⚡",
      value: "85",
      label: "Days to Launch",
      animation: "spinning",
    },
    cta: {
      text: "See Our Portfolio",
      urgency: "Early bird saves $15K",
    },
    interactiveElements: {
      testimonialCarousel: true,
      trustBadges: ["⚡", "🔒"],
      completionReward: "Development Roadmap Unlocked",
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
    testimonials: [
      {
        quote:
          "Black Friday traffic was 10x normal. Their system didn't even hiccup. $2.3M in sales, zero issues.",
        author: "Jennifer Liu",
        company: "EcoCart Commerce",
        result: "$2.3M flawless launch",
        additionalMetric: "10x traffic handled perfectly",
      },
      {
        quote:
          "Our old system crashed at 1000 users. Their platform handles 100,000 concurrent users like it's nothing.",
        author: "Alex Thompson",
        company: "GameHub Entertainment",
        result: "100x scalability improvement",
        additionalMetric: "1K → 100K users supported",
      },
      {
        quote:
          "6 months post-launch: still 99.9% uptime. Their monitoring caught and fixed issues before we knew they existed.",
        author: "Priya Patel",
        company: "HealthTech Innovations",
        result: "Perfect reliability record",
        additionalMetric: "0 minutes downtime in 6 months",
      },
    ],
    visual: {
      icon: "🎯",
      value: "99.9%",
      label: "Uptime Guarantee",
      animation: "floating",
    },
    cta: {
      text: "Get Quality Guarantee",
      urgency: "Performance promise included",
    },
    interactiveElements: {
      testimonialCarousel: true,
      trustBadges: ["🛡️", "🏆"],
      completionReward: "Launch Guarantee Secured",
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
    testimonials: [
      {
        quote:
          "18 months later: $50M valuation, Series B closed, market leader in our space. Best investment ever.",
        author: "David Park",
        company: "Neural Dynamics (Acquired)",
        result: "$50M valuation achieved",
        additionalMetric: "5000% ROI in 18 months",
      },
      {
        quote:
          "From $1M to $50M ARR in 2 years. Their growth optimization is like having a magic money machine.",
        author: "Sarah Kim",
        company: "CloudScale Global",
        result: "5000% revenue growth",
        additionalMetric: "$1M → $50M ARR",
      },
      {
        quote:
          "We've sustained 40% month-over-month growth for 14 consecutive months. Impossible without their system.",
        author: "Carlos Rodriguez",
        company: "TechFlow Enterprises",
        result: "14 months of 40% growth",
        additionalMetric: "2800% cumulative growth",
      },
    ],
    visual: {
      icon: "📊",
      value: "∞",
      label: "Unlimited Growth",
      animation: "pulsing",
    },
    cta: {
      text: "Start Your Project",
      urgency: "Q1 cohort closing soon",
    },
    interactiveElements: {
      testimonialCarousel: true,
      trustBadges: ["💰", "🚀", "🏆"],
      completionReward: "Success Guarantee Activated",
    },
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineConnectorRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isInView, setIsInView] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });

  // Interactive Sales Elements State
  const [roiCalculator, setRoiCalculator] = useState<ROICalculatorState>({
    currentDevCost: 200000,
    teamSize: 5,
    projectDuration: 12,
    calculatedSavings: 0,
    calculatedROI: 0,
  });

  const [testimonialIndices, setTestimonialIndices] = useState<{
    [key: number]: number;
  }>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  });

  const [visibleTrustBadges, setVisibleTrustBadges] = useState<Set<string>>(
    new Set()
  );
  const [completionRewards, setCompletionRewards] = useState<{
    [key: number]: boolean;
  }>({});

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndices((prev) => {
        const newIndices = { ...prev };
        PROCESS_STEPS.forEach((step, index) => {
          if (step.testimonials && step.testimonials.length > 1) {
            newIndices[index] = (prev[index] + 1) % step.testimonials.length;
          }
        });
        return newIndices;
      });
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // ROI Calculator Logic
  const calculateROI = useCallback((state: ROICalculatorState) => {
    const traditionalCost = state.currentDevCost * (state.projectDuration / 3); // Traditional takes 4x longer
    const nebulosCost = 150000; // Our fixed price
    const timeSavings = (state.projectDuration - 3) * (state.teamSize * 15000); // Opportunity cost
    const totalSavings = traditionalCost - nebulosCost + timeSavings;
    const roi = ((totalSavings - nebulosCost) / nebulosCost) * 100;

    return {
      calculatedSavings: Math.max(totalSavings, 0),
      calculatedROI: Math.max(roi, 0),
    };
  }, []);

  // Update ROI calculation when inputs change
  useEffect(() => {
    const result = calculateROI(roiCalculator);
    setRoiCalculator((prev) => ({
      ...prev,
      ...result,
    }));
  }, [
    roiCalculator.currentDevCost,
    roiCalculator.teamSize,
    roiCalculator.projectDuration,
    calculateROI,
  ]);

  // GSAP context for performance and cleanup
  const { contextSafe } = useGSAP({ scope: sectionRef });

  // Mouse tracking for magnetic effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Initialize timeline connector visibility
  useEffect(() => {
    if (timelineConnectorRef.current) {
      console.log("🎯 Initializing timeline connector with GSAP");
      // Enhance initial visibility with GSAP
      gsap.set(timelineConnectorRef.current, {
        scaleY: 0.1, // Start with 10% visibility
        transformOrigin: "top center",
      });

      // Animate to initial visible state
      gsap.to(timelineConnectorRef.current, {
        scaleY: 0.2,
        duration: 2,
        ease: "power2.out",
        delay: 0.5,
        onComplete: () => {
          console.log("✅ Timeline connector initial animation complete");
        },
      });
    } else {
      console.warn("Timeline connector ref is null during initialization");
    }
  }, []);

  // Section visibility detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
          if (entry.isIntersecting) {
            animateHeaderEntrance();
            // Initialize timeline connector when section comes into view
            if (timelineConnectorRef.current) {
              console.log(
                "🎯 Section in view - Starting initial timeline animation"
              );
              gsap.to(timelineConnectorRef.current, {
                scaleY: 0.2, // Show initial portion of timeline
                duration: 1.5,
                ease: "power2.out",
                onComplete: () => {
                  console.log("✅ Initial timeline animation completed");
                  // Trigger first step animation if no step is active
                  if (currentStep === -1) {
                    setCurrentStep(0);
                    console.log("🚀 Force triggering first step animation");
                  }
                },
              });
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Creative card animations - unique for each step with high performance
  const animateCardEntry = contextSafe(
    (cardElement: HTMLElement, index: number) => {
      if (completedSteps.has(index)) {
        console.log(`Card ${index} already animated, skipping`);
        return;
      }

      console.log(`🎬 Starting creative animation for card ${index}`);

      // Get card elements for detailed animations
      const stepNumber = cardElement.querySelector(
        `.${styles.stepNumber}`
      ) as HTMLElement;
      const painPoint = cardElement.querySelector(
        `.${styles.painPoint}`
      ) as HTMLElement;
      const descriptionItems = cardElement.querySelectorAll(
        `.${styles.descriptionItem}`
      );
      const salesImpact = cardElement.querySelector(
        `.${styles.salesImpact}`
      ) as HTMLElement;
      const socialProof = cardElement.querySelector(
        `.${styles.socialProof}`
      ) as HTMLElement;
      const visualMetric = cardElement.querySelector(
        `.${styles.visualMetric}`
      ) as HTMLElement;
      const cta = cardElement.querySelector(
        `.${styles.stepCta}`
      ) as HTMLElement;
      const metricValue = visualMetric?.querySelector(
        `.${styles.metricValue}`
      ) as HTMLElement;

      // Creative animation based on card index
      let tl: gsap.core.Timeline;

      switch (index) {
        case 0: // Card 1: Morphing Discovery Effect
          tl = animateDiscoveryCard(cardElement, {
            stepNumber,
            painPoint,
            descriptionItems,
            salesImpact,
            socialProof,
            visualMetric,
            metricValue,
            cta,
          });
          break;

        case 1: // Card 2: Development Sprint Slide-in
          tl = animateSprintCard(cardElement, {
            stepNumber,
            painPoint,
            descriptionItems,
            salesImpact,
            socialProof,
            visualMetric,
            metricValue,
            cta,
          });
          break;

        case 2: // Card 3: Launch Assembly Effect
          tl = animateLaunchCard(cardElement, {
            stepNumber,
            painPoint,
            descriptionItems,
            salesImpact,
            socialProof,
            visualMetric,
            metricValue,
            cta,
          });
          break;

        case 3: // Card 4: Growth Explosion Effect
          tl = animateGrowthCard(cardElement, {
            stepNumber,
            painPoint,
            descriptionItems,
            salesImpact,
            socialProof,
            visualMetric,
            metricValue,
            cta,
          });
          break;

        default:
          tl = animateDefaultCard(cardElement, {
            stepNumber,
            painPoint,
            descriptionItems,
            salesImpact,
            socialProof,
            visualMetric,
            metricValue,
            cta,
          });
      }

      // Common completion setup
      tl.eventCallback("onComplete", () => {
        console.log(`✅ Creative animation completed for card ${index}`);
        setCompletedSteps((prev) => new Set([...prev, index]));
        addMagneticEffect(cardElement);
        animateTrustBadgesForCard(cardElement);

        // Trigger completion reward
        if (PROCESS_STEPS[index].interactiveElements?.completionReward) {
          setCompletionRewards((prev) => ({ ...prev, [index]: true }));
        }

        // Animate metric count-up if applicable
        if (metricValue && PROCESS_STEPS[index].visual.value !== "∞") {
          const endValue = parseInt(PROCESS_STEPS[index].visual.value) || 0;
          const counter = { value: 0 };
          gsap.to(counter, {
            value: endValue,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              metricValue.textContent = Math.ceil(counter.value).toString();
            },
          });
        }
      });

      return tl;
    }
  );

  // Card 1: Morphing Discovery Effect
  const animateDiscoveryCard = contextSafe(
    (cardElement: HTMLElement, elements: any) => {
      const {
        stepNumber,
        painPoint,
        descriptionItems,
        salesImpact,
        socialProof,
        visualMetric,
        cta,
      } = elements;

      // Initial setup - card morphs from small circle
      gsap.set(cardElement, {
        opacity: 1,
        scale: 0,
        borderRadius: "50%",
        rotationY: 180,
        filter: "blur(20px)",
        transformOrigin: "center center",
      });

      gsap.set(
        [
          stepNumber,
          painPoint,
          descriptionItems,
          salesImpact,
          socialProof,
          visualMetric,
          cta,
        ],
        {
          opacity: 0,
          scale: 0.5,
        }
      );

      const tl = gsap.timeline();

      // 1. Morphing entrance - circle to card
      tl.to(cardElement, {
        scale: 1,
        borderRadius: "24px",
        rotationY: 0,
        filter: "blur(0px)",
        duration: 1.5,
        ease: "back.out(1.7)",
        force3D: true,
      });

      // 2. Content discovery sequence
      tl.to(
        stepNumber,
        {
          opacity: 1,
          scale: 1,
          rotation: 720, // Two full rotations
          duration: 1,
          ease: "power2.out",
        },
        "-=0.8"
      )
        .to(
          [painPoint, salesImpact],
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "elastic.out(1, 0.3)",
          },
          "-=0.5"
        )
        .to(
          descriptionItems,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          [socialProof, visualMetric, cta],
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "back.out(1.4)",
          },
          "-=0.3"
        );

      return tl;
    }
  );

  // Card 2: Development Sprint Slide-in
  const animateSprintCard = contextSafe(
    (cardElement: HTMLElement, elements: any) => {
      const {
        stepNumber,
        painPoint,
        descriptionItems,
        salesImpact,
        socialProof,
        visualMetric,
        cta,
      } = elements;

      // Initial setup - slides from right with parallax
      gsap.set(cardElement, {
        opacity: 1,
        x: "100vw",
        rotationX: -20,
        scale: 0.9,
      });

      gsap.set(
        [
          stepNumber,
          painPoint,
          descriptionItems,
          salesImpact,
          socialProof,
          visualMetric,
          cta,
        ],
        {
          opacity: 0,
          x: 50,
        }
      );

      const tl = gsap.timeline();

      // 1. Slide entrance with momentum
      tl.to(cardElement, {
        x: 0,
        rotationX: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        force3D: true,
      });

      // 2. Sprint-style progressive reveal
      tl.to(
        stepNumber,
        {
          opacity: 1,
          x: 0,
          scale: 1.2,
          duration: 0.6,
          ease: "back.out(2)",
        },
        "-=0.6"
      )
        .to(stepNumber, {
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        })
        .to(
          [painPoint, salesImpact],
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .to(
          descriptionItems,
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          [socialProof, visualMetric, cta],
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.3"
        );

      return tl;
    }
  );

  // Card 3: Launch Assembly Effect
  const animateLaunchCard = contextSafe(
    (cardElement: HTMLElement, elements: any) => {
      const {
        stepNumber,
        painPoint,
        descriptionItems,
        salesImpact,
        socialProof,
        visualMetric,
        cta,
      } = elements;

      // Initial setup - elements fly in from different directions
      gsap.set(cardElement, { opacity: 1, scale: 1 });
      gsap.set(stepNumber, { x: -200, y: -100, rotation: -90, opacity: 0 });
      gsap.set(painPoint, { x: 150, y: -50, opacity: 0 });
      gsap.set(salesImpact, { x: -100, y: 100, opacity: 0 });
      gsap.set(socialProof, { x: 200, y: 50, opacity: 0 });
      gsap.set(visualMetric, { y: 200, scale: 0, opacity: 0 });
      gsap.set(cta, { y: -150, scale: 2, opacity: 0 });
      gsap.set(descriptionItems, {
        x: (i) => (i % 2 === 0 ? -100 : 100),
        y: (i) => 50 + i * 20,
        rotation: (i) => (i % 2 === 0 ? -15 : 15),
        opacity: 0,
      });

      const tl = gsap.timeline();

      // 1. Assembly sequence - elements fly in
      tl.to(stepNumber, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      })
        .to(
          [painPoint, salesImpact, socialProof],
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.7)",
          },
          "-=0.5"
        )
        .to(
          descriptionItems,
          {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          visualMetric,
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.3)",
          },
          "-=0.3"
        )
        .to(
          cta,
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        );

      return tl;
    }
  );

  // Card 4: Growth Explosion Effect
  const animateGrowthCard = contextSafe(
    (cardElement: HTMLElement, elements: any) => {
      const {
        stepNumber,
        painPoint,
        descriptionItems,
        salesImpact,
        socialProof,
        visualMetric,
        cta,
      } = elements;

      // Initial setup - explosion from center
      gsap.set(cardElement, {
        opacity: 1,
        scale: 0.1,
        filter: "brightness(3) blur(10px)",
      });

      gsap.set(
        [
          stepNumber,
          painPoint,
          descriptionItems,
          salesImpact,
          socialProof,
          visualMetric,
          cta,
        ],
        {
          opacity: 0,
          scale: 0.1,
        }
      );

      const tl = gsap.timeline();

      // 1. Explosive entrance
      tl.to(cardElement, {
        scale: 1.1,
        filter: "brightness(1.5) blur(0px)",
        duration: 0.6,
        ease: "power4.out",
      }).to(cardElement, {
        scale: 1,
        filter: "brightness(1) blur(0px)",
        duration: 0.4,
        ease: "elastic.out(1, 0.3)",
      });

      // 2. Explosive content reveal
      tl.to(
        stepNumber,
        {
          opacity: 1,
          scale: 1.3,
          rotation: 360,
          duration: 0.8,
          ease: "back.out(2)",
        },
        "-=0.7"
      )
        .to(stepNumber, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
        .to(
          [painPoint, salesImpact, socialProof],
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          "-=0.5"
        )
        .to(
          descriptionItems,
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.3"
        )
        .to(
          [visualMetric, cta],
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "elastic.out(1, 0.3)",
          },
          "-=0.2"
        );

      return tl;
    }
  );

  // Fallback default animation
  const animateDefaultCard = contextSafe(
    (cardElement: HTMLElement, elements: any) => {
      const {
        stepNumber,
        painPoint,
        descriptionItems,
        salesImpact,
        socialProof,
        visualMetric,
        cta,
      } = elements;

      gsap.set(cardElement, { opacity: 1, y: 0, scale: 1 });
      gsap.set(
        [
          stepNumber,
          painPoint,
          descriptionItems,
          salesImpact,
          socialProof,
          visualMetric,
          cta,
        ],
        {
          opacity: 0,
          y: 30,
        }
      );

      const tl = gsap.timeline();

      tl.to(
        [
          stepNumber,
          painPoint,
          descriptionItems,
          salesImpact,
          socialProof,
          visualMetric,
          cta,
        ],
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      );

      return tl;
    }
  );

  // Helper: Animate trust badges for a card
  const animateTrustBadgesForCard = contextSafe((cardElement: HTMLElement) => {
    const trustBadges = cardElement.querySelectorAll(`.${styles.trustBadge}`);
    trustBadges.forEach((badge, badgeIndex) => {
      setTimeout(() => {
        animateTrustBadge(badge as HTMLElement);
      }, badgeIndex * 200);
    });
  });

  // Timeline connector growth animation with enhanced visual feedback
  const animateTimelineProgress = contextSafe(() => {
    if (!timelineConnectorRef.current) {
      console.warn("Timeline connector ref is null during progress animation");
      return;
    }

    const totalSteps = PROCESS_STEPS.length;
    const progress = Math.max(0.1, Math.min((currentStep + 1) / totalSteps, 1)); // Ensure minimum 10% visibility

    console.log(`🎯 TIMELINE PROGRESS ANIMATION:`, {
      currentStep,
      totalSteps,
      progress,
      progressPercentage: `${Math.round(progress * 100)}%`,
    });

    // Animate timeline connector with enhanced feedback
    gsap.to(timelineConnectorRef.current, {
      scaleY: progress,
      duration: 1.2,
      ease: "power2.out",
      transformOrigin: "top center",
      onUpdate: () => {
        // Add visual feedback during animation
        const currentScale = gsap.getProperty(
          timelineConnectorRef.current,
          "scaleY"
        ) as number;
        console.log(
          `Timeline scale updating: ${Math.round(currentScale * 100)}%`
        );
      },
      onComplete: () => {
        console.log(
          `✅ Timeline animation completed - Final scale: ${Math.round(progress * 100)}%`
        );
      },
    });

    // Animate the progress indicator dot to match
    const progressDot = timelineConnectorRef.current?.querySelector("::after");
    if (progressDot) {
      gsap.to(progressDot, {
        scale: 1.2,
        duration: 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }
  });

  // Header entrance animation
  const animateHeaderEntrance = contextSafe(() => {
    const headerElements = sectionRef.current?.querySelectorAll(
      `.${styles.headerContent} > *`
    );
    if (!headerElements) return;

    gsap.fromTo(
      headerElements,
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      }
    );
  });

  // Magnetic hover effect for interactive elements
  const addMagneticEffect = contextSafe((element: HTMLElement) => {
    const magneticElements = element.querySelectorAll(
      `.${styles.ctaButton}, .${styles.stepNumber}, .${styles.metricIcon}`
    );

    magneticElements.forEach((el) => {
      const magneticEl = el as HTMLElement;

      const handleMouseEnter = () => {
        gsap.to(magneticEl, {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(magneticEl, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "elastic.out(1, 0.3)",
        });
      };

      const handleMouseMove = (e: MouseEvent) => {
        const rect = magneticEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.2;
        const deltaY = (e.clientY - centerY) * 0.2;

        gsap.to(magneticEl, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      magneticEl.addEventListener("mouseenter", handleMouseEnter);
      magneticEl.addEventListener("mouseleave", handleMouseLeave);
      magneticEl.addEventListener("mousemove", handleMouseMove);
    });
  });

  // Card intersection observers for progressive disclosure
  useEffect(() => {
    if (!isInView || !timelineRef.current) {
      console.log("IntersectionObserver not initializing:", {
        isInView,
        hasTimelineRef: !!timelineRef.current,
      });
      return;
    }

    const cardElements = timelineRef.current.querySelectorAll(
      `.${styles.stepCard}`
    );
    console.log(`Found ${cardElements.length} step cards to observe`);

    const observers: IntersectionObserver[] = [];

    cardElements.forEach((card, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            console.log(`Card ${index} intersection:`, {
              isIntersecting: entry.isIntersecting,
              intersectionRatio: entry.intersectionRatio,
              isCompleted: completedSteps.has(index),
            });

            if (entry.isIntersecting && !completedSteps.has(index)) {
              console.log(`Triggering animation for card ${index}`);
              setCurrentStep(index);
              animateCardEntry(entry.target as HTMLElement, index);
            }
          });
        },
        {
          threshold: 0.2, // Reduced from 0.7 to 0.2 (20% visibility)
          rootMargin: "100px 0px 100px 0px", // Added positive margin for earlier triggering
        }
      );

      observer.observe(card);
      observers.push(observer);
    });

    // Immediate fallback: Animate first card if none are animated yet
    const immediateTimer = setTimeout(() => {
      if (completedSteps.size === 0 && cardElements.length > 0) {
        console.log("Immediate fallback: Animating first card");
        setCurrentStep(0);
        animateCardEntry(cardElements[0] as HTMLElement, 0);
      }
    }, 1000);

    // Failsafe: Force animation of visible cards after 3 seconds
    const failsafeTimer = setTimeout(() => {
      console.log("Failsafe: Force animating all visible cards");
      cardElements.forEach((card, index) => {
        if (!completedSteps.has(index)) {
          const rect = card.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          if (isVisible) {
            console.log(`Failsafe triggering animation for card ${index}`);
            setCurrentStep(index);
            animateCardEntry(card as HTMLElement, index);
          }
        }
      });
    }, 3000);

    return () => {
      observers.forEach((obs) => obs.disconnect());
      clearTimeout(immediateTimer);
      clearTimeout(failsafeTimer);
    };
  }, [isInView, completedSteps.size]);

  // Update timeline progress
  useEffect(() => {
    if (currentStep >= 0) {
      animateTimelineProgress();
    }
  }, [currentStep]);

  // Smooth scroll to step function
  const scrollToStep = contextSafe((stepIndex: number) => {
    const targetCard = cardRefs.current[stepIndex];
    if (targetCard) {
      gsap.to(window, {
        scrollTo: { y: targetCard, offsetY: 100 },
        duration: 1.2,
        ease: "power2.inOut",
      });
    }
  });

  // Accessibility: Reduced motion support
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      gsap.globalTimeline.timeScale(0.1);
    }
  }, []);

  // Trust Badge Animation
  const animateTrustBadge = contextSafe((badge: HTMLElement) => {
    gsap.fromTo(
      badge,
      { opacity: 0, scale: 0.8, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        delay: Math.random() * 0.5,
      }
    );
  });

  // ROI Calculator Component
  const ROICalculatorWidget = () => (
    <div className={styles.roiCalculator}>
      <div className={styles.calculatorHeader}>
        <span className={styles.calculatorIcon}>📊</span>
        <h4>Calculate Your Savings</h4>
      </div>

      <div className={styles.calculatorInputs}>
        <div className={styles.inputGroup}>
          <label htmlFor="dev-cost-input">Current Development Budget</label>
          <input
            id="dev-cost-input"
            type="range"
            min="50000"
            max="1000000"
            step="10000"
            value={roiCalculator.currentDevCost}
            onChange={(e) =>
              setRoiCalculator((prev) => ({
                ...prev,
                currentDevCost: parseInt(e.target.value),
              }))
            }
            className={styles.rangeSlider}
            aria-label="Current Development Budget"
          />
          <span className={styles.inputValue}>
            ${roiCalculator.currentDevCost.toLocaleString()}
          </span>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="team-size-input">Team Size</label>
          <input
            id="team-size-input"
            type="range"
            min="2"
            max="20"
            value={roiCalculator.teamSize}
            onChange={(e) =>
              setRoiCalculator((prev) => ({
                ...prev,
                teamSize: parseInt(e.target.value),
              }))
            }
            className={styles.rangeSlider}
            aria-label="Team Size"
          />
          <span className={styles.inputValue}>
            {roiCalculator.teamSize} developers
          </span>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="timeline-input">Traditional Timeline (months)</label>
          <input
            id="timeline-input"
            type="range"
            min="6"
            max="24"
            value={roiCalculator.projectDuration}
            onChange={(e) =>
              setRoiCalculator((prev) => ({
                ...prev,
                projectDuration: parseInt(e.target.value),
              }))
            }
            className={styles.rangeSlider}
            aria-label="Traditional Timeline in months"
          />
          <span className={styles.inputValue}>
            {roiCalculator.projectDuration} months
          </span>
        </div>
      </div>

      <div className={styles.calculatorResults}>
        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>Your Savings:</span>
          <span className={styles.resultValue}>
            ${roiCalculator.calculatedSavings.toLocaleString()}
          </span>
        </div>
        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>ROI:</span>
          <span className={styles.resultValue}>
            {Math.round(roiCalculator.calculatedROI)}%
          </span>
        </div>
        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>Time Saved:</span>
          <span className={styles.resultValue}>
            {roiCalculator.projectDuration - 3} months
          </span>
        </div>
      </div>
    </div>
  );

  // Testimonial Carousel Component
  const TestimonialCarousel = ({ stepIndex }: { stepIndex: number }) => {
    const step = PROCESS_STEPS[stepIndex];
    if (!step.testimonials) return null;

    const currentTestimonial = step.testimonials[testimonialIndices[stepIndex]];

    return (
      <div className={styles.testimonialCarousel}>
        <div
          className={styles.testimonialContent}
          key={testimonialIndices[stepIndex]}
        >
          <p>"{currentTestimonial.quote}"</p>
          <div className={styles.testimonialAuthor}>
            <strong>{currentTestimonial.author}</strong>
            <span>{currentTestimonial.company}</span>
          </div>
          <div className={styles.testimonialResults}>
            <div className={styles.testimonialResult}>
              {currentTestimonial.result}
            </div>
            {currentTestimonial.additionalMetric && (
              <div className={styles.testimonialMetric}>
                {currentTestimonial.additionalMetric}
              </div>
            )}
          </div>
        </div>

        <div className={styles.carouselDots}>
          {step.testimonials.map((_, index) => (
            <button
              key={index}
              className={`${styles.carouselDot} ${index === testimonialIndices[stepIndex] ? styles.active : ""}`}
              onClick={() =>
                setTestimonialIndices((prev) => ({
                  ...prev,
                  [stepIndex]: index,
                }))
              }
              aria-label={`View testimonial ${index + 1}`}
              title={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  };

  // Trust Badges Component
  const TrustBadges = ({ badges }: { badges: string[] }) => (
    <div className={styles.trustBadges}>
      {badges.map((badgeIcon, index) => {
        const badge = TRUST_BADGES.find((b) => b.icon === badgeIcon);
        if (!badge) return null;

        return (
          <div key={badgeIcon} className={styles.trustBadge}>
            <span className={styles.trustBadgeIcon}>{badge.icon}</span>
            <div className={styles.trustBadgeContent}>
              <span className={styles.trustBadgeText}>{badge.text}</span>
              <span className={styles.trustBadgeDesc}>{badge.description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Completion Reward Component
  const CompletionReward = ({
    reward,
    stepIndex,
  }: {
    reward: string;
    stepIndex: number;
  }) => {
    if (!completionRewards[stepIndex]) return null;

    return (
      <div className={styles.completionReward}>
        <span className={styles.rewardIcon}>🎉</span>
        <span className={styles.rewardText}>{reward}</span>
      </div>
    );
  };

  return (
    <section className={styles.processSection} ref={sectionRef}>
      {/* Debug Controls - Remove in production */}
      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          zIndex: 9999,
          background: "rgba(0,0,0,0.8)",
          padding: "10px",
          borderRadius: "5px",
          color: "white",
          fontSize: "12px",
        }}
      >
        <div>Current Step: {currentStep}</div>
        <div>Completed: {Array.from(completedSteps).join(", ")}</div>
        <button
          onClick={() => {
            console.log("🎯 Manual timeline animation trigger");
            animateTimelineProgress();
          }}
          style={{
            padding: "5px 10px",
            margin: "5px",
            background: "purple",
            color: "white",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          Animate Timeline
        </button>
        <button
          onClick={() => {
            console.log("🎯 Cycle through steps");
            const nextStep = (currentStep + 1) % PROCESS_STEPS.length;
            setCurrentStep(nextStep);
          }}
          style={{
            padding: "5px 10px",
            margin: "5px",
            background: "blue",
            color: "white",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          Next Step
        </button>
      </div>

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
        <div className={styles.timelineConnector} ref={timelineConnectorRef}>
          {/* Progress percentage indicator */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "20px",
              transform: "translateY(-50%)",
              background: "rgba(153, 0, 255, 0.9)",
              color: "white",
              padding: "5px 10px",
              borderRadius: "15px",
              fontSize: "12px",
              fontWeight: "bold",
              zIndex: 10,
              backdropFilter: "blur(10px)",
            }}
          >
            {Math.round(((currentStep + 1) / PROCESS_STEPS.length) * 100)}%
          </div>
        </div>

        {PROCESS_STEPS.map((step, index) => (
          <div
            key={step.number}
            ref={(el) => (cardRefs.current[index] = el)}
            className={styles.stepCard}
            data-step={index}
          >
            <div className={styles.cardContent}>
              {/* Step Header */}
              <div className={styles.stepHeader}>
                <div className={styles.stepNumber}>
                  {step.number.toString().padStart(2, "0")}
                </div>
                <div className={styles.stepMeta}>
                  <div className={styles.stepTimeline}>{step.timeline}</div>
                  <div className={styles.stepTitle}>{step.title}</div>
                </div>
              </div>

              {/* Pain Point */}
              <div className={styles.painPoint}>
                <div className={styles.painIcon}>⚠️</div>
                <p>{step.painPoint}</p>
              </div>

              {/* Description */}
              <ul className={styles.stepDescription}>
                {step.description.map((item, itemIndex) => (
                  <li key={itemIndex} className={styles.descriptionItem}>
                    <div className={styles.itemIcon} />
                    <span className={styles.itemText}>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Sales Impact */}
              <div className={styles.salesImpact}>
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

              {/* Social Proof - Enhanced with Carousel */}
              <div className={styles.socialProof}>
                {step.interactiveElements?.testimonialCarousel ? (
                  <TestimonialCarousel stepIndex={index} />
                ) : (
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
                )}
              </div>

              {/* ROI Calculator - Step 1 Only */}
              {step.interactiveElements?.roiCalculator && (
                <ROICalculatorWidget />
              )}

              {/* Trust Badges */}
              {step.interactiveElements?.trustBadges && (
                <TrustBadges badges={step.interactiveElements.trustBadges} />
              )}

              {/* Visual Metric */}
              <div className={styles.visualMetric}>
                <span
                  className={`${styles.metricIcon} ${styles[step.visual.animation]}`}
                >
                  {step.visual.icon}
                </span>
                <div className={styles.metricValue}>{step.visual.value}</div>
                <div className={styles.metricLabel}>{step.visual.label}</div>
              </div>

              {/* Completion Reward */}
              {step.interactiveElements?.completionReward && (
                <CompletionReward
                  reward={step.interactiveElements.completionReward}
                  stepIndex={index}
                />
              )}

              {/* Enhanced CTA */}
              <div className={styles.stepCta}>
                <button
                  className={styles.ctaButton}
                  onClick={() => {
                    if (
                      index === 0 &&
                      step.interactiveElements?.roiCalculator
                    ) {
                      // First step - focus on calculator
                      const calculator = document.querySelector(
                        `.${styles.roiCalculator}`
                      );
                      calculator?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    } else if (index === PROCESS_STEPS.length - 1) {
                      // Last step - scroll to final CTA
                      const finalCta = document.querySelector(
                        `.${styles.finalCta}`
                      );
                      finalCta?.scrollIntoView({ behavior: "smooth" });
                    } else {
                      // Middle steps - scroll to next step
                      scrollToStep(
                        Math.min(index + 1, PROCESS_STEPS.length - 1)
                      );
                    }
                  }}
                >
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
