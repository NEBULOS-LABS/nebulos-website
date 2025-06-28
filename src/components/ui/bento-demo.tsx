import { Code2, Smartphone, Brain, Cloud, Zap } from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
  {
    Icon: Code2,
    name: "SaaS & Web Apps",
    description:
      "Full-stack platforms with robust backend architecture and conversion-focused UX.",
    href: "#services",
    cta: "Learn more",
    background: (
      <img
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&auto=format"
        alt="Web development"
      />
    ),
    className: "col-span-1 sm:col-span-2 lg:col-span-1 lg:row-span-3",
  },
  {
    Icon: Smartphone,
    name: "Mobile Apps",
    description:
      "Native and cross-platform apps with world-class UX and seamless performance.",
    href: "#services",
    cta: "Learn more",
    background: (
      <img
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&auto=format"
        alt="Mobile app development"
      />
    ),
    className: "col-span-1 sm:col-span-1 lg:col-span-1 lg:row-span-2",
  },
  {
    Icon: Brain,
    name: "AI & Machine Learning",
    description:
      "Integrating intelligent algorithms to create predictive, adaptive systems.",
    href: "#services",
    cta: "Learn more",
    background: (
      <img
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&auto=format"
        alt="AI and machine learning"
      />
    ),
    className: "col-span-1 sm:col-span-1 lg:col-span-1 lg:row-span-1",
  },
  {
    Icon: Cloud,
    name: "DevOps & Infrastructure",
    description:
      "Cloud architecture that scales with your business and optimizes for cost.",
    href: "#services",
    cta: "Learn more",
    background: (
      <img
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&auto=format"
        alt="Cloud infrastructure"
      />
    ),
    className: "col-span-1 sm:col-span-1 lg:col-span-1 lg:row-span-1",
  },
  {
    Icon: Zap,
    name: "AI-Accelerated Delivery",
    description:
      "Our proprietary framework combines elite talent with AI tools to deliver 3x faster than traditional agencies.",
    href: "#solution",
    cta: "Learn more",
    background: (
      <img
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop&auto=format"
        alt="Fast delivery with AI"
      />
    ),
    className: "col-span-1 sm:col-span-2 lg:col-span-1 lg:row-span-2",
  },
];

function BentoDemo() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}

export { BentoDemo };
