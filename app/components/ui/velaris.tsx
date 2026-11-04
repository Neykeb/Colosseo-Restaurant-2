import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "~/lib/utils";

const vertexShaderSource = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;
varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_grain;
uniform vec3 u_colors[4];
uniform vec3 u_bg;
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
void main() {
  vec2 uv = vUv;
  float ratio = u_resolution.x / u_resolution.y;
  vec2 p = uv - 0.5;
  p.x *= ratio;
  float t = u_time * 0.1;
  float n1 = snoise(p * 0.4 + vec2(t * 0.2, -t * 0.3));
  float n2 = snoise(p * 0.55 + vec2(-t * 0.15, t * 0.25) + n1 * 0.25);
  float n3 = snoise(p * 0.75 + vec2(t * 0.1, -t * 0.2) + n2 * 0.2);
  vec3 col = u_bg;
  float dist = length(p) * 1.5;
  float vignette = 1.0 - smoothstep(0.3, 1.2, dist);
  col = mix(col, u_colors[0], smoothstep(-0.2, 0.5, n1) * 0.78);
  col = mix(col, u_colors[1], smoothstep(-0.1, 0.6, n2) * 0.62);
  col = mix(col, u_colors[2], smoothstep(-0.3, 0.4, n3) * 0.38);
  col = mix(col, u_colors[3], smoothstep(0.0, 0.7, n1 * n2) * 0.46);
  float glow = smoothstep(0.85, 0.0, dist) * 0.16;
  col += u_colors[2] * glow;
  col = mix(col * 0.28, col, vignette);
  float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453 + u_time);
  col += (grain - 0.5) * u_grain * 0.1;
  gl_FragColor = vec4(col, 1.0);
}
`;

export interface VelarisProps {
  background?: string;
  colors?: readonly [string, string, string, string];
  speed?: number;
  grain?: number;
  className?: string;
  children?: ReactNode;
}

const defaultColors = ["#241512", "#4c1515", "#8f432f", "#d89478"] as const;

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const value = /^[0-9a-f]{6}$/i.test(normalized) ? normalized : "000000";
  return [Number.parseInt(value.slice(0, 2), 16) / 255, Number.parseInt(value.slice(2, 4), 16) / 255, Number.parseInt(value.slice(4, 6), 16) / 255];
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function Velaris({ background = "#160e0c", colors = defaultColors, speed = 0.45, grain = 0.12, className, children }: VelarisProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) return;
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = {
      resolution: gl.getUniformLocation(program, "u_resolution"),
      time: gl.getUniformLocation(program, "u_time"),
      grain: gl.getUniformLocation(program, "u_grain"),
      colors: gl.getUniformLocation(program, "u_colors"),
      background: gl.getUniformLocation(program, "u_bg"),
    };
    const flatColors = new Float32Array(colors.flatMap(hexToRgb));
    const backgroundColor = hexToRgb(background);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactViewport = window.matchMedia("(max-width: 767px)");
    let frame = 0;
    let visible = false;
    let pageVisible = !document.hidden;
    let animationStart = performance.now();

    const draw = (timestamp: number) => {
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, ((timestamp - animationStart) / 1000) * speed);
      gl.uniform1f(uniforms.grain, grain);
      gl.uniform3f(uniforms.background, ...backgroundColor);
      gl.uniform3fv(uniforms.colors, flatColors);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const shouldAnimate = () => visible && pageVisible && !reducedMotion.matches && !compactViewport.matches;
    const animate = (timestamp: number) => {
      draw(timestamp);
      frame = shouldAnimate() ? window.requestAnimationFrame(animate) : 0;
    };
    const syncAnimation = () => {
      if (!shouldAnimate()) {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        draw(animationStart);
      } else if (!frame) {
        animationStart = performance.now();
        frame = window.requestAnimationFrame(animate);
      }
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, compactViewport.matches ? 1 : 1.5);
      const width = Math.max(1, Math.round(container.clientWidth * dpr));
      const height = Math.max(1, Math.round(container.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      draw(animationStart);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    }, { rootMargin: "120px 0px" });
    intersectionObserver.observe(container);
    const handleVisibility = () => {
      pageVisible = !document.hidden;
      syncAnimation();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    reducedMotion.addEventListener("change", syncAnimation);
    compactViewport.addEventListener("change", syncAnimation);
    resize();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      reducedMotion.removeEventListener("change", syncAnimation);
      compactViewport.removeEventListener("change", syncAnimation);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [background, colors, grain, speed]);

  return <div className={cn("velaris", className)} ref={containerRef}>
    <canvas aria-hidden="true" className="velaris-canvas" ref={canvasRef} />
    <div className="velaris-content">{children}</div>
  </div>;
}
