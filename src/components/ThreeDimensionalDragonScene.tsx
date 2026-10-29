/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Rotate3d,
  Layers,
  Sparkles,
  Eye,
  Camera,
  Play,
  Pause,
  Maximize2,
  ShieldAlert,
  Zap,
} from "lucide-react";

export function ThreeDimensionalDragonScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [pulseSpeed, setPulseSpeed] = useState<number>(1.5);
  const [particleDensity, setParticleDensity] = useState<"standard" | "high">("high");
  const [cameraPreset, setCameraPreset] = useState<"front" | "top" | "core">("front");
  const [fps, setFps] = useState(60);

  // References to internal Three.js objects for dynamic updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const crystalCageRef = useRef<THREE.Mesh | null>(null);
  const ring1Ref = useRef<THREE.Mesh | null>(null);
  const ring2Ref = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Helper to generate a procedural glowing grid/nebula CanvasTexture (zero external 404s!)
  const createProceduralGlowTexture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
      gradient.addColorStop(0, "rgba(6, 182, 212, 1)");
      gradient.addColorStop(0.3, "rgba(14, 165, 233, 0.8)");
      gradient.addColorStop(0.7, "rgba(59, 130, 246, 0.3)");
      gradient.addColorStop(1, "rgba(8, 12, 20, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);

      // Fine geometric grid matrix
      ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 256; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 256);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(256, i);
        ctx.stroke();
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x050811);
    scene.fog = new THREE.FogExp2(0x050811, 0.035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.5);
    cameraRef.current = camera;

    // 2. Renderer setup with studio PBR standards
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 3. Studio PBR Lighting
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xf59e0b, 2.0);
    keyLight.position.set(5, 8, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x06b6d4, 1.5);
    fillLight.position.set(-5, -3, -2);
    scene.add(fillLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 3.5, 8, 2);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // 4. Procedural Canvas Texture
    const glowTex = createProceduralGlowTexture();

    // 5. Composite Procedural Multi-part Dragon Sovereign Core
    // Part 1: Central Pulsing Quantum Dragon Core (Icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(1.0, 3);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.85,
      map: glowTex,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // Part 2: Outer Faceted Celestial Crystal Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.4, 1);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.4,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.9,
    });
    const crystalCage = new THREE.Mesh(cageGeo, cageMat);
    scene.add(crystalCage);
    crystalCageRef.current = crystalCage;

    // Part 3: Gyroscopic Torus Ring 1 (Horizontal Equatorial Orbital Ring)
    const ring1Geo = new THREE.TorusGeometry(2.0, 0.04, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.7,
      roughness: 0.3,
      metalness: 0.9,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);
    ring1Ref.current = ring1;

    // Part 4: Gyroscopic Torus Ring 2 (Polar Orbit Ring)
    const ring2Geo = new THREE.TorusGeometry(2.4, 0.03, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xb45309,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.9,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);
    ring2Ref.current = ring2;

    // Part 5: Orbiting Quantum Dragon Shield Drones (4 satellites)
    const satellitesGroup = new THREE.Group();
    const satGeo = new THREE.OctahedronGeometry(0.18, 0);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.9,
    });
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4;
      const sat = new THREE.Mesh(satGeo, satMat);
      sat.position.set(Math.cos(angle) * 2.0, 0, Math.sin(angle) * 2.0);
      satellitesGroup.add(sat);
    }
    scene.add(satellitesGroup);

    // Part 6: Stardust Particle Matrix (1,500 quantum points)
    const particleCount = 1500;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const r = 2.0 + Math.random() * 5.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Gradient between Cyan (0.02, 0.71, 0.83) and Gold (0.96, 0.62, 0.04)
      const isGold = Math.random() > 0.6;
      colors[i * 3] = isGold ? 0.96 : 0.02;
      colors[i * 3 + 1] = isGold ? 0.62 : 0.71;
      colors[i * 3 + 2] = isGold ? 0.04 : 0.83;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 6. Interactive Drag & Pointer Easing
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotationY += deltaX * 0.005;
      targetRotationX += deltaY * 0.005;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // 7. 60fps Damped Animation Loop
    let clock = new THREE.Clock();
    let frameCounter = 0;
    let lastFpsTime = performance.now();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // FPS tracking
      frameCounter++;
      const now = performance.now();
      if (now - lastFpsTime >= 1000) {
        setFps(frameCounter);
        frameCounter = 0;
        lastFpsTime = now;
      }

      // Smooth lerp rotation based on drag or auto-rotation
      if (coreMeshRef.current) {
        if (autoRotate) {
          targetRotationY += 0.008;
        }
        coreMeshRef.current.rotation.y += (targetRotationY - coreMeshRef.current.rotation.y) * 0.08;
        coreMeshRef.current.rotation.x += (targetRotationX - coreMeshRef.current.rotation.x) * 0.08;

        // Dynamic pulsing breathing cycle
        const pulse = 1.0 + Math.sin(elapsedTime * pulseSpeed) * 0.08;
        coreMeshRef.current.scale.set(pulse, pulse, pulse);
      }

      if (crystalCageRef.current) {
        crystalCageRef.current.rotation.y -= 0.006;
        crystalCageRef.current.rotation.z += 0.003;
      }

      if (ring1Ref.current) {
        ring1Ref.current.rotation.z += 0.012;
      }

      if (ring2Ref.current) {
        ring2Ref.current.rotation.x += 0.008;
        ring2Ref.current.rotation.y += 0.005;
      }

      satellitesGroup.rotation.y += 0.015;

      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.002;
        particlesRef.current.rotation.x -= 0.001;
      }

      if (pointLightRef.current) {
        pointLightRef.current.intensity = 3.0 + Math.sin(elapsedTime * pulseSpeed * 2) * 1.2;
      }

      // Camera preset easing
      if (cameraRef.current) {
        let targetPos = new THREE.Vector3(0, 1.2, 5.5);
        if (cameraPreset === "top") {
          targetPos = new THREE.Vector3(0, 6.0, 1.5);
        } else if (cameraPreset === "core") {
          targetPos = new THREE.Vector3(0, 0.4, 2.5);
        }
        cameraRef.current.position.lerp(targetPos, 0.05);
        cameraRef.current.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    // 9. Pristine Cleanup & Resource Disposal on unmount
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener("resize", handleResize);
      domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      coreGeo.dispose();
      coreMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      satGeo.dispose();
      satMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      glowTex.dispose();
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [pulseSpeed, cameraPreset]);

  // Handle wireframe toggle
  useEffect(() => {
    if (coreMeshRef.current) {
      (coreMeshRef.current.material as THREE.MeshStandardMaterial).wireframe = wireframe;
    }
  }, [wireframe]);

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950/90 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* 3D Scene Header Bar */}
      <div className="relative z-10 flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-300 font-bold tracking-wider">
            THREE.JS // QUANTUM DRAGON NEXUS CORE
          </span>
          <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px]">
            60 FPS DAMPED PBR
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px]">
            FPS: <span className="text-emerald-400 font-bold">{fps}</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            PARTICLES: <span className="text-amber-400 font-bold">1,500</span>
          </span>
        </div>
      </div>

      {/* Primary WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full h-full min-h-[300px] cursor-grab active:cursor-grabbing overflow-hidden"
      >
        {/* Viewport Overlay Telemetry */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none space-y-1 font-mono text-[10px] text-cyan-400/80 bg-slate-950/70 p-2 rounded-lg border border-cyan-900/40 backdrop-blur-sm">
          <div>COORDINATE: 0.00, 1.20, 5.50</div>
          <div>COLORSPACE: sRGB / ACES Filmic</div>
          <div>EMISSIVE FLUX: 840nm CYAN / 590nm GOLD</div>
          <div>NODE: UNIVERSAL DRAGON SOVEREIGN</div>
        </div>
      </div>

      {/* Bottom Compact Control Dock */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-slate-900/90 border-t border-slate-800 text-xs font-mono">
        {/* Left: Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
              autoRotate
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                : "bg-slate-800 text-slate-400 border border-slate-700"
            }`}
          >
            {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{autoRotate ? "ROTATING" : "PAUSED"}</span>
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
              wireframe
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                : "bg-slate-800 text-slate-400 border border-slate-700"
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>WIREFRAME</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>PULSE:</span>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.2"
              value={pulseSpeed}
              onChange={(e) => setPulseSpeed(parseFloat(e.target.value))}
              className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="text-[10px] text-cyan-300 font-bold">{pulseSpeed.toFixed(1)}x</span>
          </div>
        </div>

        {/* Right: Camera Presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[10px] hidden md:inline">CAMERA:</span>
          {(
            [
              { id: "front", label: "FRONT VIEW" },
              { id: "top", label: "TOP ORBIT" },
              { id: "core", label: "CORE MACRO" },
            ] as const
          ).map((preset) => (
            <button
              key={preset.id}
              onClick={() => setCameraPreset(preset.id)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                cameraPreset === preset.id
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
