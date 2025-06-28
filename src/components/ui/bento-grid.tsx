import { ReactNode } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[20rem] sm:auto-rows-[22rem] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: any;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl",
      // NEBULOS dark theme with glassmorphism
      "bg-black/70 backdrop-blur-md border border-white/10",
      "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
      "transition-all duration-300 ease-out",
      "hover:border-white/20 hover:shadow-[0_12px_40px_rgba(153,0,255,0.2)]",
      "hover:scale-[1.02] hover:-translate-y-1",
      className
    )}
  >
    {/* Background image with NEBULOS overlay */}
    <div className="absolute inset-0">
      {background}
      {/* NEBULOS gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/80" />
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#9900ff]/10 via-[#ff00ff]/10 to-[#00eeff]/10" />
    </div>

    {/* Content */}
    <div className="relative z-10 flex transform-gpu flex-col gap-3 p-6 transition-all duration-300 group-hover:-translate-y-2">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Icon className="h-10 w-10 text-white transition-all duration-300 ease-in-out group-hover:scale-110" />
          {/* Icon glow effect */}
          <div className="absolute inset-0 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300">
            <Icon className="h-10 w-10 text-[#ff00ff]" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#9900ff] group-hover:via-[#ff00ff] group-hover:to-[#00eeff] transition-all duration-300">
          {name}
        </h3>
      </div>
      <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 max-w-lg leading-relaxed">
        {description}
      </p>
    </div>

    {/* CTA Button */}
    <div className="relative z-10 p-6 pt-0">
      <div className="flex items-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
        <a
          href={href}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
          bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30
          text-white text-sm font-medium backdrop-blur-sm
          transition-all duration-200 hover:scale-105 hover:shadow-md hover:shadow-[#ff00ff]/20"
        >
          {cta}
          <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </a>
      </div>
    </div>

    {/* Animated border gradient */}
    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#9900ff]/30 via-[#ff00ff]/30 to-[#00eeff]/30 blur-sm" />
    </div>
  </div>
);

export { BentoCard, BentoGrid };
