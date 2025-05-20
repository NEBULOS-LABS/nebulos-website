"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  size?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl";
}

export const AuroraText = ({
  children,
  className,
  as: Component = "p",
  size = "base",
}: AuroraTextProps) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
    "6xl": "text-6xl",
    "7xl": "text-7xl",
    "8xl": "text-8xl",
    "9xl": "text-9xl",
  };

  return (
    <Component
      className={cn(
        "relative inline-block",
        sizeClasses[size],
        "font-bold tracking-tight bg-clip-text text-transparent",
        "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
        "animate-text-gradient bg-[length:400%]",
        className
      )}
    >
      {children}
      <span className="sr-only">{children}</span>
      <div className="absolute -inset-0 blur-lg opacity-30 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-aurora-glow" />
    </Component>
  );
};

export default AuroraText;
