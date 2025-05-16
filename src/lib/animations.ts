import { Variants } from "framer-motion";

export const fadeIn = (
  direction: "up" | "down" | "left" | "right" = "up",
  delay: number = 0.2
): Variants => {
  return {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
      x: direction === "left" ? 20 : direction === "right" ? -20 : 0,
    },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        type: "tween",
        duration: 0.8,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};

export const staggerContainer = (
  staggerChildren?: number,
  delayChildren?: number
): Variants => {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
};

export const slideIn = (
  direction: "up" | "down" | "left" | "right",
  type: string,
  delay: number,
  duration: number
): Variants => {
  return {
    hidden: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
      y: direction === "up" ? "100%" : direction === "down" ? "-100%" : 0,
    },
    show: {
      x: 0,
      y: 0,
      transition: {
        type,
        delay,
        duration,
        ease: "easeOut",
      },
    },
  };
};

export const zoomIn = (delay: number, duration: number): Variants => {
  return {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "tween",
        delay,
        duration,
        ease: "easeOut",
      },
    },
  };
};

export const textVariant = (delay: number = 0.2): Variants => {
  return {
    hidden: {
      y: 20,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.6,
        delay,
        ease: "easeOut",
      },
    },
  };
};

export const textContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  show: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: i * 0.1 },
  }),
};

export const textVariant2: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      ease: "easeIn",
    },
  },
};
