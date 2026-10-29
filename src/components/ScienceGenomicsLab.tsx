/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  Dna,
  Atom,
  Search,
  ExternalLink,
  ShieldCheck,
  Activity,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

interface ScienceData {
  gene: string;
  name: string;
  uniprotAccession: string;
  organism: string;
  pdbId: string;
  resolution: string;
  alphaFoldUrl: string;
  plddtScore: number;
  plddtTier: string;
  plddtColor: string;
  functionSummary: string;
  pathways: string[];
  provenance: string;
  keyResidues: { pos: number; name: string; role: string; status: string; color: string }[];
  chemicalSmiles: string | null;
}

const QUICK_TARGETS = ["TP53", "BRCA1", "EGFR", "PCSK9", "IMATINIB"];

export function ScienceGenomicsLab() {
  const [selectedTarget, setSelectedTarget] = useState("TP53");
  const [queryInput, setQueryInput] = useState("");
  const [data, setData] = useState<ScienceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"structure" | "pathways" | "residues">("structure");

  // 3D Canvas ref for molecular ribbon visualizer
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const moleculeGroupRef = useRef<THREE.Group | null>(null);

  const fetchScienceData = async (target: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/science/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: target }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        setData(result.data);
      }
    } catch (err) {
      console.error("Science query failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScienceData(selectedTarget);
  }, [selectedTarget]);

  // Setup interactive 3D Ribbon Molecular Viewer
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f1d);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.0);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf59e0b, 1.5);
    dirLight2.position.set(-5, -5, 2);
    scene.add(dirLight2);

    // Create 3D Molecular Ribbon / Alpha-helix Curve Structure
    const moleculeGroup = new THREE.Group();
    moleculeGroupRef.current = moleculeGroup;
    scene.add(moleculeGroup);

    // Build alpha-helical spline ribbon
    const curvePoints: THREE.Vector3[] = [];
    const numPoints = 60;
    for (let i = 0; i < numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 6;
      const radius = 1.0 + Math.sin(t * 0.5) * 0.3;
      const x = Math.sin(t) * radius;
      const y = (i / numPoints - 0.5) * 4.5;
      const z = Math.cos(t) * radius;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 100, 0.12, 12, false);

    // Color code based on AlphaFold pLDDT
    const plddtColorHex = data?.plddtColor || "#0053D6";
    const tubeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(plddtColorHex),
      roughness: 0.25,
      metalness: 0.4,
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    moleculeGroup.add(tubeMesh);

    // Add Key Residue / Atom Spheres along the backbone
    const atomGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const atomMatCyan = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.2 });
    const atomMatGold = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2 });
    const atomMatRed = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.2 });

    for (let i = 0; i < curvePoints.length; i += 4) {
      const sphere = new THREE.Mesh(
        atomGeo,
        i % 8 === 0 ? atomMatRed : i % 2 === 0 ? atomMatCyan : atomMatGold
      );
      sphere.position.copy(curvePoints[i]);
      moleculeGroup.add(sphere);
    }

    // Animation Loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (moleculeGroup) {
        moleculeGroup.rotation.y += 0.008;
        moleculeGroup.rotation.x += 0.003;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
      tubeGeo.dispose();
      tubeMat.dispose();
      atomGeo.dispose();
      atomMatCyan.dispose();
      atomMatGold.dispose();
      atomMatRed.dispose();
      renderer.dispose();
    };
  }, [data]);

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryInput.trim()) {
      setSelectedTarget(queryInput.trim().toUpperCase());
      setQueryInput("");
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950/95 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Dna className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono text-teal-300">
                DEEPMIND SCIENCE // STRUCTURAL BIOLOGY & GENOMICS LAB
              </span>
              <span className="px-1.5 py-0.2 rounded bg-teal-950 text-teal-400 border border-teal-800 text-[10px] font-mono">
                AlphaFold DB v6
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Curated biological pathways, AlphaFold pLDDT confidence modeling & 3D macromolecular structures.
            </p>
          </div>
        </div>

        {/* Quick-try Chips */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-500 mr-1 hidden sm:inline">QUICK TARGETS:</span>
          {QUICK_TARGETS.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTarget(t)}
              className={`px-2 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedTarget === t
                  ? "bg-teal-500 text-slate-950 shadow-md font-extrabold"
                  : "bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleCustomSearch} className="px-5 py-2 bg-slate-900/40 border-b border-slate-800/80 flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder="Search any Gene Symbol, UniProt ID, or PDB accession (e.g. KRAS, P04637, MYC, 1TSR)..."
          className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white text-xs font-mono font-bold transition-all cursor-pointer"
        >
          {isLoading ? "QUERYING..." : "QUERY TARGET"}
        </button>
      </form>

      {/* Main Multi-Pane Workbench Stage */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 overflow-y-auto">
        {/* Left Pane: Interactive 3D Molecular Ribbon Viewer */}
        <div className="lg:col-span-7 flex flex-col p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Atom className="w-4 h-4 text-teal-400" />
              <span className="text-white font-bold">3D MOLECULAR RIBBON VIEW</span>
              <span className="text-slate-500">//</span>
              <span className="text-teal-400 font-bold">{data?.gene}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono">
                PDB ID: <span className="text-amber-400 font-bold">{data?.pdbId}</span>
              </span>
            </div>
          </div>

          {/* 3D WebGL Canvas */}
          <div
            ref={canvasRef}
            className="relative flex-1 min-h-[260px] w-full rounded-xl border border-slate-800 overflow-hidden bg-slate-950"
          >
            {/* AlphaFold Confidence Scale Legend (Canonical 4-band pLDDT scale) */}
            <div className="absolute bottom-2 left-2 z-10 p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] font-mono space-y-1 backdrop-blur-sm">
              <div className="text-slate-400 font-bold">ALPHAFOLD pLDDT SCALE:</div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0053D6]" />
                <span className="text-slate-300">Very High (&gt;90)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#65CBF3]" />
                <span className="text-slate-300">Confident (70-90)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFDB13]" />
                <span className="text-slate-300">Low (50-70)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF7D45]" />
                <span className="text-slate-300">Very Low (&lt;50)</span>
              </div>
            </div>
          </div>

          {/* AlphaFold Confidence Meter for Target */}
          {data && (
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">AlphaFold Per-Residue Confidence Score:</span>
                <span className="font-bold text-teal-400">
                  {data.plddtScore} / 100 ({data.plddtTier})
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${data.plddtScore}%`,
                    backgroundColor: data.plddtColor,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Pane: Synchronized Inspector & Pathways */}
        <div className="lg:col-span-5 flex flex-col p-4 space-y-3 overflow-y-auto">
          {/* Epistemic Provenance Badge */}
          <div className="flex items-center justify-between text-[11px] font-mono p-2.5 rounded-lg bg-teal-950/40 border border-teal-800/60 text-teal-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>PROVENANCE:</span>
            </div>
            <span className="text-right text-[10px] text-slate-300 font-sans">
              [{data?.provenance || "Literature curated"}]
            </span>
          </div>

          {/* Target Identity Card */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-mono text-white">{data?.gene}</h3>
              <a
                href={data?.alphaFoldUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] font-mono text-teal-400 hover:text-teal-300 hover:underline"
              >
                <span>AlphaFold DB</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-slate-300 font-medium">{data?.name}</p>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
              <span>UniProt: <strong className="text-cyan-300">{data?.uniprotAccession}</strong></span>
              <span>•</span>
              <span>Organism: <strong className="text-slate-200">{data?.organism}</strong></span>
            </div>
          </div>

          {/* Biological Function Summary */}
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Molecular Function & Biological Role
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {data?.functionSummary}
            </p>
          </div>

          {/* Reactome Biological Pathways */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-teal-400" />
              <span>Curated Reactome Pathways & STRING Interactions</span>
            </div>
            <div className="space-y-1.5">
              {data?.pathways.map((p, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-2"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Mutation Hotspots / Residues */}
          {data?.keyResidues && data.keyResidues.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Critical Residues & Cancer Hotspots
              </div>
              <div className="space-y-1.5">
                {data.keyResidues.map((res, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-slate-900/40 border border-slate-800 text-[11px] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: res.color }}
                      />
                      <span className="font-mono font-bold text-white">{res.name} (pos {res.pos})</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-mono">
                      {res.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chemical SMILES if present */}
          {data?.chemicalSmiles && (
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 font-mono text-[10px]">
              <span className="text-slate-400">Canonical SMILES: </span>
              <span className="text-amber-300 break-all">{data.chemicalSmiles}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
