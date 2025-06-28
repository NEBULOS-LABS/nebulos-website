import { Code2, Smartphone, Brain, Cloud, Zap } from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
  {
    Icon: Code2,
    name: "SaaS & Web Apps",
    description:
      "Full-stack platforms with robust backend architecture and conversion-focused UX. From MVP to enterprise scale.",
    href: "#contact",
    cta: "Get Quote",
    badge: "Most Popular",
    metric: "3x faster delivery",
    price: "$15K",
    background: (
      <img
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&auto=format"
        alt="Web development"
      />
    ),
    className: "md:row-start-1 md:row-end-4 md:col-start-2 md:col-end-3",
  },
  {
    Icon: Smartphone,
    name: "Mobile Apps",
    description:
      "Native iOS & Android apps that users love. Cross-platform solutions with React Native & Flutter.",
    href: "#contact",
    cta: "Start Project",
    metric: "4.8★ avg rating",
    price: "$12K",
    background: (
      <img
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&auto=format"
        alt="Mobile app development"
      />
    ),
    className: "md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-3",
  },
  {
    Icon: Brain,
    name: "AI & Machine Learning",
    description:
      "Intelligent systems that learn and adapt. OpenAI integration, custom models, and predictive analytics.",
    href: "#contact",
    cta: "Explore AI",
    badge: "Hot 🔥",
    metric: "40% cost reduction",
    price: "$8K",
    background: (
      <img
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&auto=format"
        alt="AI and machine learning"
      />
    ),
    className: "md:col-start-1 md:col-end-2 md:row-start-3 md:row-end-4",
  },
  {
    Icon: Cloud,
    name: "DevOps & Infrastructure",
    description:
      "Scalable cloud architecture on AWS, GCP, or Azure. Kubernetes, CI/CD, and monitoring included.",
    href: "#contact",
    cta: "Scale Now",
    metric: "99.9% uptime",
    price: "$5K",
    background: (
      <img
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&auto=format"
        alt="Cloud infrastructure"
      />
    ),
    className: "md:col-start-3 md:col-end-3 md:row-start-1 md:row-end-2",
  },
  {
    Icon: Zap,
    name: "AI-Accelerated Delivery",
    description:
      "Our secret sauce: Elite developers + AI tools = 3x faster delivery with 38% fewer bugs. Guaranteed results.",
    href: "#contact",
    cta: "Learn How",
    badge: "Exclusive",
    metric: "38% fewer bugs",
    price: "Included",
    background: (
      <img
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop&auto=format"
        alt="Fast delivery with AI"
      />
    ),
    className: "md:col-start-3 md:col-end-3 md:row-start-2 md:row-end-4",
  },
];

function BentoDemo() {
  return (
    <BentoGrid className="md:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}

export { BentoDemo };
