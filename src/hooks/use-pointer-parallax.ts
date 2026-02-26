"use client";

import { useRef, useEffect } from "react";

export interface PointerState {
  /** Normalized X in [-1..1] relative to container center */
  nx: number;
  /** Normalized Y in [-1..1] relative to container center */
  ny: number;
}

/**
 * Tracks pointer position normalized to [-1..1] relative to a container element.
 * Returns stable refs (no re-renders). Consumers read .current each frame.
 */
export function usePointerParallax(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean
) {
  const pointerRef = useRef<PointerState>({ nx: 0, ny: 0 });
  const isInsideRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      pointerRef.current = { nx: 0, ny: 0 };
      isInsideRef.current = false;
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      pointerRef.current = {
        nx: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        ny: ((e.clientY - rect.top) / rect.height) * 2 - 1,
      };
    };

    const handleEnter = () => {
      isInsideRef.current = true;
    };

    const handleLeave = () => {
      isInsideRef.current = false;
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [containerRef, enabled]);

  return { pointerRef, isInsideRef };
}
