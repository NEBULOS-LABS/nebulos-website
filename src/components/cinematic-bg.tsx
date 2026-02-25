"use client";

import React, { useRef, useEffect, useCallback } from "react";

/* ─── Shader Sources ──────────────────────────────────────────────────── */

const VERT_SRC = `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAG_SRC = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uMouse;
uniform float uDpr;

/* ── 1. Noise Functions ────────────────────────────────────────────── */

float hash21(vec2 p) {
  p = fract(p * vec2(233.34, 851.73));
  p += dot(p, p + 23.45);
  return fract(p.x * p.y);
}

vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)),
           dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453123);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  // Bicubic interpolation (smootherstep)
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

  float a = hash21(i + vec2(0.0, 0.0));
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x),
             mix(c, d, u.x), u.y);
}

float fbm(vec2 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 4; i++) {
    if (i >= octaves) break;
    value += amplitude * valueNoise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

/* ── Main ──────────────────────────────────────────────────────────── */

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;

  /* ── 2. Corner Light Source ──────────────────────────────────────── */

  vec2 lightPos = vec2(0.82, 0.82) + uMouse * 0.05;
  // Note: vUv.y is 0 at bottom, 1 at top after our vertex transform
  // We want light in top-right so (0.82, 0.82) maps to top-right in GL coords
  // But UV 0.18 from top = 0.82 in GL UV. Let's use 0.82 directly since
  // UV (0,0) is bottom-left in GL.

  vec2 delta = (uv - lightPos) * vec2(aspect, 1.0);
  float dist = length(delta);

  // Inverse-square falloff
  float falloff = 1.0 / (1.0 + dist * dist * 8.0);

  // Directional mask — beam toward bottom-left (~225 degrees from right = toward (-1, -1) normalized)
  vec2 beamDir = normalize(vec2(-1.0, -1.0));
  float dirDot = dot(normalize(delta + 1e-6), beamDir);
  float dirMask = pow(max(dirDot, 0.0), 0.6);
  dirMask = mix(0.3, 1.0, dirMask); // 30% minimum

  // Breathing
  float breathe = 1.0 + sin(uTime * 0.8) * 0.05;

  float light = falloff * dirMask * breathe;

  // Color journey from core outward
  vec3 coreColor  = vec3(0.78, 0.88, 1.0);   // blue-white
  vec3 innerColor = vec3(0.0,  0.93, 1.0);    // cyan
  vec3 midColor   = vec3(0.6,  0.0,  1.0);    // purple
  vec3 edgeColor  = vec3(1.0,  0.0,  1.0);    // pink

  float tInner = smoothstep(0.0,  0.15, dist);
  float tMid   = smoothstep(0.15, 0.4,  dist);
  float tEdge  = smoothstep(0.4,  0.7,  dist);

  vec3 lightColor = coreColor;
  lightColor = mix(lightColor, innerColor, tInner);
  lightColor = mix(lightColor, midColor,   tMid);
  lightColor = mix(lightColor, edgeColor,  tEdge);

  /* ── 3. Nebula Cloud Layers ─────────────────────────────────────── */

  // Layer 1: Large-scale purple clouds
  float n1 = fbm(uv * 2.5 + uTime * 0.008, 3) * 0.12;
  vec3 nebula = n1 * vec3(0.6, 0.0, 1.0);

  // Layer 2: Mid-scale cyan wisps
  float n2 = fbm(uv * 4.0 + vec2(uTime * 0.006, -uTime * 0.004), 3) * 0.08;
  nebula += n2 * vec3(0.0, 0.93, 1.0);

  // Layer 3: Fine pink filaments
  float n3 = fbm(uv * 6.0 - uTime * 0.005, 2) * 0.05;
  nebula += n3 * vec3(1.0, 0.0, 1.0);

  /* ── 4. Volumetric Ray Approximation ────────────────────────────── */

  vec3 rays = vec3(0.0);
  for (int i = 0; i < 4; i++) {
    float t = float(i) * 0.1;
    vec2 samplePos = mix(uv, lightPos, t);
    float noiseSample = valueNoise(samplePos * 5.0 + uTime * 0.02);
    float weight = (1.0 - t);
    rays += weight * noiseSample * lightColor * light;
  }
  rays *= 0.12;

  /* ── 5. Procedural Dust Motes ───────────────────────────────────── */

  float dust = 0.0;
  for (int layer = 0; layer < 3; layer++) {
    float fl = float(layer);
    float speed   = 0.015 + fl * 0.008;
    float size    = 0.3  + fl * 0.15;
    float bright  = 1.0  - fl * 0.25;
    float gridRes = 20.0 + fl * 15.0;

    // Diagonal flow from top-right to bottom-left
    vec2 flowOffset = vec2(-uTime * speed * 0.7, -uTime * speed * 0.5);
    vec2 gridUv = uv * gridRes + flowOffset + fl * 73.1;

    vec2 cellId = floor(gridUv);
    vec2 cellFract = fract(gridUv);

    // Check neighboring cells for smoother motes
    for (int cx = -1; cx <= 1; cx++) {
      for (int cy = -1; cy <= 1; cy++) {
        vec2 neighbor = vec2(float(cx), float(cy));
        vec2 id = cellId + neighbor;
        vec2 rnd = hash22(id);

        // 8% probability
        if (rnd.x > 0.08) continue;

        vec2 motePos = neighbor + rnd - cellFract;
        float d = length(motePos);
        float radius = size * (0.01 + rnd.y * 0.02);
        float mote = smoothstep(radius, radius * 0.2, d);
        // Twinkle
        float twinkle = 0.5 + 0.5 * sin(uTime * (2.0 + rnd.x * 4.0) + rnd.y * 6.28);
        // Brighter near light
        float lightBoost = 0.3 + light * 2.0;
        dust += mote * bright * twinkle * lightBoost * 0.4;
      }
    }
  }

  /* ── 7. Vignette ────────────────────────────────────────────────── */

  float vignette = 1.0 - smoothstep(0.4, 1.2, length((uv - 0.5) * vec2(1.3, 1.0)));

  /* ── 6. Film Grain ──────────────────────────────────────────────── */

  float grainTime = floor(uTime * 24.0) / 24.0;
  float grain = (hash21(uv * uResolution / uDpr + grainTime * 1000.0) - 0.5) * 0.025;

  /* ── 8. Final Composition ───────────────────────────────────────── */

  vec3 color = vec3(0.02, 0.02, 0.03);
  color += nebula * vignette;
  color += lightColor * light * 0.55;
  color += lightColor * rays;
  color += vec3(dust);
  color *= vignette;
  color += grain;

  fragColor = vec4(color, 1.0);
}
`;

/* ─── WebGL1 Fallback Shaders ─────────────────────────────────────────── */

const VERT_SRC_V1 = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAG_SRC_V1 = `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uMouse;
uniform float uDpr;

float hash21(vec2 p) {
  p = fract(p * vec2(233.34, 851.73));
  p += dot(p, p + 23.45);
  return fract(p.x * p.y);
}

vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)),
           dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453123);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = hash21(i + vec2(0.0, 0.0));
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm3(vec2 p) {
  float v = 0.0; float a = 0.5; float f = 1.0;
  for (int i = 0; i < 3; i++) {
    v += a * valueNoise(p * f); f *= 2.0; a *= 0.5;
  }
  return v;
}

float fbm2(vec2 p) {
  float v = 0.0; float a = 0.5; float f = 1.0;
  for (int i = 0; i < 2; i++) {
    v += a * valueNoise(p * f); f *= 2.0; a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;

  vec2 lightPos = vec2(0.82, 0.82) + uMouse * 0.05;
  vec2 delta = (uv - lightPos) * vec2(aspect, 1.0);
  float dist = length(delta);
  float falloff = 1.0 / (1.0 + dist * dist * 8.0);

  vec2 beamDir = normalize(vec2(-1.0, -1.0));
  float dirDot = dot(normalize(delta + 1e-6), beamDir);
  float dirMask = pow(max(dirDot, 0.0), 0.6);
  dirMask = mix(0.3, 1.0, dirMask);

  float breathe = 1.0 + sin(uTime * 0.8) * 0.05;
  float light = falloff * dirMask * breathe;

  vec3 coreColor  = vec3(0.78, 0.88, 1.0);
  vec3 innerColor = vec3(0.0,  0.93, 1.0);
  vec3 midColor   = vec3(0.6,  0.0,  1.0);
  vec3 edgeColor  = vec3(1.0,  0.0,  1.0);

  float tInner = smoothstep(0.0,  0.15, dist);
  float tMid   = smoothstep(0.15, 0.4,  dist);
  float tEdge  = smoothstep(0.4,  0.7,  dist);

  vec3 lightColor = coreColor;
  lightColor = mix(lightColor, innerColor, tInner);
  lightColor = mix(lightColor, midColor,   tMid);
  lightColor = mix(lightColor, edgeColor,  tEdge);

  float n1 = fbm3(uv * 2.5 + uTime * 0.008) * 0.12;
  vec3 nebula = n1 * vec3(0.6, 0.0, 1.0);
  float n2 = fbm3(uv * 4.0 + vec2(uTime * 0.006, -uTime * 0.004)) * 0.08;
  nebula += n2 * vec3(0.0, 0.93, 1.0);
  float n3 = fbm2(uv * 6.0 - uTime * 0.005) * 0.05;
  nebula += n3 * vec3(1.0, 0.0, 1.0);

  vec3 rays = vec3(0.0);
  for (int i = 0; i < 4; i++) {
    float t = float(i) * 0.1;
    vec2 samplePos = mix(uv, lightPos, t);
    float noiseSample = valueNoise(samplePos * 5.0 + uTime * 0.02);
    float weight = (1.0 - t);
    rays += weight * noiseSample * lightColor * light;
  }
  rays *= 0.12;

  float dust = 0.0;
  for (int layer = 0; layer < 3; layer++) {
    float fl = float(layer);
    float speed   = 0.015 + fl * 0.008;
    float sz      = 0.3  + fl * 0.15;
    float bright  = 1.0  - fl * 0.25;
    float gridRes = 20.0 + fl * 15.0;
    vec2 flowOffset = vec2(-uTime * speed * 0.7, -uTime * speed * 0.5);
    vec2 gridUv = uv * gridRes + flowOffset + fl * 73.1;
    vec2 cellId = floor(gridUv);
    vec2 cellFract = fract(gridUv);
    for (int cx = -1; cx <= 1; cx++) {
      for (int cy = -1; cy <= 1; cy++) {
        vec2 neighbor = vec2(float(cx), float(cy));
        vec2 id = cellId + neighbor;
        vec2 rnd = hash22(id);
        if (rnd.x > 0.08) continue;
        vec2 motePos = neighbor + rnd - cellFract;
        float d = length(motePos);
        float radius = sz * (0.01 + rnd.y * 0.02);
        float mote = smoothstep(radius, radius * 0.2, d);
        float twinkle = 0.5 + 0.5 * sin(uTime * (2.0 + rnd.x * 4.0) + rnd.y * 6.28);
        float lightBoost = 0.3 + light * 2.0;
        dust += mote * bright * twinkle * lightBoost * 0.4;
      }
    }
  }

  float vignette = 1.0 - smoothstep(0.4, 1.2, length((uv - 0.5) * vec2(1.3, 1.0)));
  float grainTime = floor(uTime * 24.0) / 24.0;
  float grain = (hash21(uv * uResolution / uDpr + grainTime * 1000.0) - 0.5) * 0.025;

  vec3 color = vec3(0.02, 0.02, 0.03);
  color += nebula * vignette;
  color += lightColor * light * 0.55;
  color += lightColor * rays;
  color += vec3(dust);
  color *= vignette;
  color += grain;

  gl_FragColor = vec4(color, 1.0);
}
`;

/* ─── CSS Fallback Gradient ───────────────────────────────────────────── */

const CSS_FALLBACK_GRADIENT =
  "radial-gradient(ellipse at 78% 22%, rgba(0,238,255,0.12) 0%, rgba(153,0,255,0.06) 25%, rgba(5,5,5,1) 60%)";

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

interface CinematicBgProps {
  className?: string;
}

export default function CinematicBg({ className }: CinematicBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // All mutable animation / state refs (no React state to avoid re-renders)
  const rafRef = useRef<number>(0);
  const glRef = useRef<WebGLRenderingContext | WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const isVisibleRef = useRef(true);
  const isTabVisibleRef = useRef(true);
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });
  const hasPointerRef = useRef(false);
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
    const dpr = Math.min(
      window.devicePixelRatio,
      isMobile ? 0.75 : 1.5
    );

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
    if (fallbackNodeRef.current) fallbackNodeRef.current.style.display = "block";
  }, []);

  const hideFallback = useCallback(() => {
    showFallbackRef.current = false;
    if (canvasRef.current) canvasRef.current.style.display = "block";
    if (fallbackNodeRef.current) fallbackNodeRef.current.style.display = "none";
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
      gl = canvas.getContext("webgl", ctxOpts) as WebGLRenderingContext | null;
      if (!gl) {
        gl = canvas.getContext("experimental-webgl", ctxOpts) as WebGLRenderingContext | null;
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
      uMouse: gl.getUniformLocation(program, "uMouse"),
      uDpr: gl.getUniformLocation(program, "uDpr"),
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
    const t = now - startTimeRef.current;

    // Mouse smoothing
    const lerpFactor = 0.03;
    mouseCurrentRef.current.x +=
      (mouseTargetRef.current.x - mouseCurrentRef.current.x) * lerpFactor;
    mouseCurrentRef.current.y +=
      (mouseTargetRef.current.y - mouseCurrentRef.current.y) * lerpFactor;

    // Autonomous drift (always present as base)
    const driftX = Math.sin(t * 0.08) * 0.15;
    const driftY = Math.cos(t * 0.11) * 0.15;

    let finalX: number;
    let finalY: number;

    if (hasPointerRef.current) {
      finalX = mouseCurrentRef.current.x * 0.7 + driftX;
      finalY = mouseCurrentRef.current.y * 0.7 + driftY;
    } else {
      // Mobile: autonomous drift only, with different slow frequencies
      finalX = Math.sin(t * 0.15) * 0.3 + driftX;
      finalY = Math.cos(t * 0.11) * 0.3 + driftY;
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const dpr = Math.min(window.devicePixelRatio, isMobile ? 0.75 : 1.5);

    // Set uniforms
    gl.uniform1f(u.uTime, t);
    gl.uniform2f(u.uResolution, canvas.width, canvas.height);
    gl.uniform2f(u.uMouse, finalX, finalY);
    gl.uniform1f(u.uDpr, dpr);

    // Draw fullscreen quad
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    rafRef.current = requestAnimationFrame(renderLoop);
  }, []);

  /* ── Main effect: setup everything ─────────────────────────────────── */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check reduced motion preference
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = motionMq.matches;

    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      if (e.matches) {
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

    if (reducedMotionRef.current) {
      showFallback();
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

    // Pointer detection
    const pointerMq = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );
    hasPointerRef.current = pointerMq.matches;

    const onPointerChange = (e: MediaQueryListEvent) => {
      hasPointerRef.current = e.matches;
    };
    pointerMq.addEventListener("change", onPointerChange);

    // Mouse tracking (only when pointer device)
    const onMouseMove = (e: MouseEvent) => {
      if (!hasPointerRef.current) return;
      mouseTargetRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseTargetRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

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
      pointerMq.removeEventListener("change", onPointerChange);
      window.removeEventListener("mousemove", onMouseMove);
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
  }, [initGL, renderLoop, handleResize, showFallback, hideFallback]);

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
