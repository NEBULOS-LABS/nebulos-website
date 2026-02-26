"use client";

import React, { useRef, useEffect, useCallback } from "react";

/* ─── Shader Sources ──────────────────────────────────────────────────── */

const VERT_SRC = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAG_SRC = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform float uTime;
uniform vec2  uResolution;
uniform float u_brightness;
uniform float u_speed;
uniform float u_turbulence;
uniform float u_depth;
uniform vec2  u_offset;

/* ── Brand Palette ───────────────────────────────────────────────────── */

const vec3 CYAN    = vec3(0.0, 0.933, 1.0);
const vec3 PURPLE  = vec3(0.6, 0.0, 1.0);
const vec3 MAGENTA = vec3(1.0, 0.0, 1.0);

vec3 brandPalette(float t) {
  t = fract(t);
  if (t < 0.60) {
    return mix(CYAN, PURPLE, t / 0.60);
  } else if (t < 0.80) {
    return mix(PURPLE, MAGENTA, (t - 0.60) / 0.20);
  } else {
    return mix(MAGENTA, CYAN, (t - 0.80) / 0.20);
  }
}

/* ── Tone Mapping ────────────────────────────────────────────────────── */

vec4 tanhApprox(vec4 x) {
  vec4 x2 = x * x;
  return x * (3.0 + x2) / (3.0 + 3.0 * x2);
}

/* ── Main ──────────────────────────────────────────────────────────── */

void main() {
  vec2 I = gl_FragCoord.xy;
  vec4 O = vec4(0.0);
  float d = 0.0;
  float z = 0.0;

  vec2 offset = u_offset * uResolution;

  for (float i = 0.0; i < 20.0; i++) {
    vec3 p = z * normalize(vec3(I + I - uResolution.xy + offset, -uResolution.x)) + 0.1 * u_depth;
    p = vec3(atan(p.y / 0.2, p.x) * 2.0, p.z / 3.0, length(p.xy) - 5.0 - z * 0.2);
    for (float turb = 0.0; turb < 7.0; turb++) {
      p += sin(p.yzx * (turb + 1.0) + uTime * u_speed + 0.3 * i * u_turbulence) / (turb + 1.0);
    }
    d = length(vec4(0.4 * cos(p) - 0.4, p.z));
    z += d;
    float phase = (p.x + i * 0.4 + z) * 0.15;
    vec3 col = brandPalette(phase);
    O.rgb += col / d * u_brightness;
  }

  O = tanhApprox(O * O / 400.0);

  fragColor = O;
}
`;

/* ─── WebGL1 Fallback Shaders ─────────────────────────────────────────── */

const VERT_SRC_V1 = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAG_SRC_V1 = `
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform float u_brightness;
uniform float u_speed;
uniform float u_turbulence;
uniform float u_depth;
uniform vec2  u_offset;

vec3 brandPalette(float t) {
  vec3 cyan    = vec3(0.0, 0.933, 1.0);
  vec3 purple  = vec3(0.6, 0.0, 1.0);
  vec3 magenta = vec3(1.0, 0.0, 1.0);
  t = fract(t);
  if (t < 0.60) {
    return mix(cyan, purple, t / 0.60);
  } else if (t < 0.80) {
    return mix(purple, magenta, (t - 0.60) / 0.20);
  } else {
    return mix(magenta, cyan, (t - 0.80) / 0.20);
  }
}

vec4 tanhApprox(vec4 x) {
  vec4 x2 = x * x;
  return x * (3.0 + x2) / (3.0 + 3.0 * x2);
}

void main() {
  vec2 I = gl_FragCoord.xy;
  vec4 O = vec4(0.0);
  float d = 0.0;
  float z = 0.0;

  vec2 offset = u_offset * uResolution;

  for (float i = 0.0; i < 20.0; i++) {
    vec3 p = z * normalize(vec3(I + I - uResolution.xy + offset, -uResolution.x)) + 0.1 * u_depth;
    p = vec3(atan(p.y / 0.2, p.x) * 2.0, p.z / 3.0, length(p.xy) - 5.0 - z * 0.2);
    for (float turb = 0.0; turb < 7.0; turb++) {
      p += sin(p.yzx * (turb + 1.0) + uTime * u_speed + 0.3 * i * u_turbulence) / (turb + 1.0);
    }
    d = length(vec4(0.4 * cos(p) - 0.4, p.z));
    z += d;
    float phase = (p.x + i * 0.4 + z) * 0.15;
    vec3 col = brandPalette(phase);
    O.rgb += col / d * u_brightness;
  }

  O = tanhApprox(O * O / 400.0);

  gl_FragColor = O;
}
`;

/* ─── Constants ───────────────────────────────────────────────────────── */

const CSS_FALLBACK_GRADIENT =
  "radial-gradient(ellipse at 35% 45%, rgba(0,238,255,0.10) 0%, rgba(153,0,255,0.06) 30%, rgba(255,0,255,0.03) 50%, rgba(5,5,5,1) 70%)";

const BRIGHTNESS = 0.5;
const SPEED = 0.8;
const TURBULENCE = 0.8;
const DEPTH = 1.0;
const OFFSET_X = -0.35;
const OFFSET_Y = 0.10;

/* ─── Helper: compile & link shader program ───────────────────────────── */

function compileShader(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "Shader compile error:",
      gl.getShaderInfoLog(shader),
      "\nSource:\n",
      source
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  vertSrc: string,
  fragSrc: string
): WebGLProgram | null {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vert || !frag) return null;

  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  // Shaders attached; can flag for deletion (cleaned up when program is deleted)
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  return prog;
}

/* ─── React Component ─────────────────────────────────────────────────── */

interface AccretionBackgroundProps {
  className?: string;
  reducedMotion?: boolean;
}

export default function AccretionBackground({
  className,
  reducedMotion,
}: AccretionBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // All mutable animation / state refs (no React state to avoid re-renders)
  const rafRef = useRef<number>(0);
  const glRef = useRef<WebGLRenderingContext | WebGL2RenderingContext | null>(
    null
  );
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const isVisibleRef = useRef(true);
  const isTabVisibleRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const showFallbackRef = useRef(false);
  const fallbackNodeRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef(0);

  /* ── Resize helper ─────────────────────────────────────────────────── */

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const dpr = Math.min(window.devicePixelRatio, isMobile ? 0.75 : 1.5);

    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }, []);

  /* ── Show / hide CSS fallback ──────────────────────────────────────── */

  const showFallback = useCallback(() => {
    showFallbackRef.current = true;
    if (canvasRef.current) canvasRef.current.style.display = "none";
    if (fallbackNodeRef.current)
      fallbackNodeRef.current.style.display = "block";
  }, []);

  const hideFallback = useCallback(() => {
    showFallbackRef.current = false;
    if (canvasRef.current) canvasRef.current.style.display = "block";
    if (fallbackNodeRef.current)
      fallbackNodeRef.current.style.display = "none";
  }, []);

  /* ── Init WebGL ────────────────────────────────────────────────────── */

  const initGL = useCallback((): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const ctxOpts: WebGLContextAttributes = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    };

    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    let vertSrc = VERT_SRC;
    let fragSrc = FRAG_SRC;

    // Try WebGL2 first
    gl = canvas.getContext("webgl2", ctxOpts) as WebGL2RenderingContext | null;

    if (!gl) {
      // Fall back to WebGL1
      gl = canvas.getContext(
        "webgl",
        ctxOpts
      ) as WebGLRenderingContext | null;
      if (!gl) {
        gl = canvas.getContext(
          "experimental-webgl",
          ctxOpts
        ) as WebGLRenderingContext | null;
      }
      if (gl) {
        vertSrc = VERT_SRC_V1;
        fragSrc = FRAG_SRC_V1;
      }
    }

    if (!gl) return false;

    glRef.current = gl;

    // Compile program
    const program = createProgram(gl, vertSrc, fragSrc);
    if (!program) {
      glRef.current = null;
      return false;
    }
    programRef.current = program;
    gl.useProgram(program);

    // Fullscreen quad buffer
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Cache uniform locations
    uniformsRef.current = {
      uTime: gl.getUniformLocation(program, "uTime"),
      uResolution: gl.getUniformLocation(program, "uResolution"),
      u_brightness: gl.getUniformLocation(program, "u_brightness"),
      u_speed: gl.getUniformLocation(program, "u_speed"),
      u_turbulence: gl.getUniformLocation(program, "u_turbulence"),
      u_depth: gl.getUniformLocation(program, "u_depth"),
      u_offset: gl.getUniformLocation(program, "u_offset"),
    };

    // Initial sizing
    handleResize();

    return true;
  }, [handleResize]);

  /* ── Render loop ───────────────────────────────────────────────────── */

  const renderLoop = useCallback(() => {
    if (!isVisibleRef.current || !isTabVisibleRef.current) {
      rafRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    const u = uniformsRef.current;
    if (!gl || !program || !canvas) return;

    const now = performance.now() * 0.001; // seconds
    if (startTimeRef.current === 0) startTimeRef.current = now;
    const t = reducedMotionRef.current ? 0 : now - startTimeRef.current;

    // Set uniforms
    gl.uniform1f(u.uTime, t);
    gl.uniform2f(u.uResolution, canvas.width, canvas.height);
    gl.uniform1f(u.u_brightness, BRIGHTNESS);
    gl.uniform1f(u.u_speed, SPEED);
    gl.uniform1f(u.u_turbulence, TURBULENCE);
    gl.uniform1f(u.u_depth, DEPTH);
    gl.uniform2f(u.u_offset, OFFSET_X, OFFSET_Y);

    // Draw fullscreen quad
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    rafRef.current = requestAnimationFrame(renderLoop);
  }, []);

  /* ── Keep reducedMotion ref in sync ──────────────────────────────── */

  useEffect(() => {
    reducedMotionRef.current = !!reducedMotion;
  }, [reducedMotion]);

  /* ── Main effect: setup everything ─────────────────────────────────── */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check reduced motion: prop OR system preference
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = !!reducedMotion || motionMq.matches;

    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches || !!reducedMotion;
      if (reducedMotionRef.current) {
        cancelAnimationFrame(rafRef.current);
        showFallback();
      } else {
        hideFallback();
        if (glRef.current) {
          rafRef.current = requestAnimationFrame(renderLoop);
        } else if (initGL()) {
          rafRef.current = requestAnimationFrame(renderLoop);
        } else {
          showFallback();
        }
      }
    };
    motionMq.addEventListener("change", onMotionChange);

    // If reduced motion is active, render one frame then stop
    if (reducedMotionRef.current) {
      if (initGL()) {
        // Render a single frozen frame (time = 0)
        const gl = glRef.current;
        const u = uniformsRef.current;
        if (gl && canvas) {
          gl.uniform1f(u.uTime, 0);
          gl.uniform2f(u.uResolution, canvas.width, canvas.height);
          gl.uniform1f(u.u_brightness, BRIGHTNESS);
          gl.uniform1f(u.u_speed, SPEED);
          gl.uniform1f(u.u_turbulence, TURBULENCE);
          gl.uniform1f(u.u_depth, DEPTH);
          gl.uniform2f(u.u_offset, OFFSET_X, OFFSET_Y);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
      } else {
        showFallback();
      }
      return () => {
        motionMq.removeEventListener("change", onMotionChange);
      };
    }

    // Initialize WebGL
    if (!initGL()) {
      showFallback();
      return () => {
        motionMq.removeEventListener("change", onMotionChange);
      };
    }

    hideFallback();

    // ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(canvas);

    // IntersectionObserver — pause when canvas not visible
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    // Document visibility — pause when tab hidden
    const onVisibilityChange = () => {
      isTabVisibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // WebGL context loss / restore
    const onContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(rafRef.current);
      showFallback();
    };

    const onContextRestored = () => {
      if (reducedMotionRef.current) return;
      if (initGL()) {
        hideFallback();
        rafRef.current = requestAnimationFrame(renderLoop);
      }
    };

    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    // Start render loop
    startTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(renderLoop);

    /* ── Cleanup ─────────────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(rafRef.current);
      motionMq.removeEventListener("change", onMotionChange);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);

      // Tear down GL resources
      const gl = glRef.current;
      if (gl && programRef.current) {
        gl.deleteProgram(programRef.current);
        programRef.current = null;
      }
      glRef.current = null;
    };
  }, [initGL, renderLoop, handleResize, showFallback, hideFallback, reducedMotion]);

  /* ── Render ────────────────────────────────────────────────────────── */

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      <div
        ref={fallbackNodeRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "none",
          background: CSS_FALLBACK_GRADIENT,
        }}
      />
    </div>
  );
}
