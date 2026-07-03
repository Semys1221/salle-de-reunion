"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useFlowStore } from "./store";
import { GlassCard } from "./glass-card";
import { WelcomeStep } from "./welcome-step";
import { IntroStep } from "./intro-step";
import { tenantConfig } from "@/lib/tenant-config";

const ConfigStep = dynamic(() => import("./config-step").then((m) => m.ConfigStep), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
    </div>
  ),
});

const MeetingRoom = dynamic(() => import("./meeting-room").then((m) => m.MeetingRoom), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
    </div>
  ),
});

export function ReunionFunnel() {
  const step = useFlowStore((s) => s.step);
  const advance = useFlowStore((s) => s.advance);
  const streamRef = useRef<MediaStream | null>(null);
  const [date, setDate] = useState("");

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t: MediaStreamTrack) => t.stop());
      streamRef.current = null;
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setDate(
        now
          .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
          .toUpperCase()
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleContinue = useCallback(async () => {
    if (step === "welcome") {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = s;
      } catch {
        console.warn("Permission caméra/micro refusée ou indisponible");
      }
    }
    advance();
  }, [advance, step]);

  return (
    <div className="h-dvh w-full overflow-hidden relative">
      {/* Light background — misty slate/blue */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
        }}
      />

      {/* ===== Peripheral Elements ===== */}

      {/* Top Left — Brand */}
      <div className="fixed top-8 left-8 z-40 hidden md:flex items-center gap-2.5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src={tenantConfig.avatarUrl}
            alt={tenantConfig.name}
            width={28}
            height={28}
            className="rounded-full ring-1 ring-slate-400/30 group-hover:ring-slate-400/60 transition-all"
            priority
          />
          <span className="text-sm font-serif font-normal tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">
            {tenantConfig.name}
          </span>
        </Link>
      </div>

      {/* Left Center — Navigation */}
      <div className="fixed top-28 left-8 z-40 hidden md:flex flex-col gap-5">
        <a href="https://sylkconseils.com" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors">
          Accueil
        </a>
        <a href="https://sylkconseils.com/expertises" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors">
          Services
        </a>
        <a href="https://sylkconseils.com/le-cabinet" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors">
          Conseil
        </a>
        <a href="https://sylkconseils.com/consultation" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors">
          Contact
        </a>
      </div>

      {/* Bottom Left — Info */}
      <div className="fixed bottom-8 left-8 z-40 max-w-[200px] hidden md:block">
        <p className="text-[10px] uppercase leading-relaxed text-slate-400 tracking-wider">
          {tenantConfig.tagline}
        </p>
      </div>

      {/* Top Right — Time */}
      <div className="fixed top-8 right-8 z-40 hidden md:flex flex-col items-end gap-2">
        {date && (
          <span className="text-[10px] font-mono text-slate-400 tracking-widest">
            {date}
          </span>
        )}
      </div>

      {/* Bottom Right — Copyright */}
      <div className="fixed bottom-8 right-8 z-40 hidden md:flex flex-col items-end gap-0.5">
        <span className="text-[10px] text-slate-400 tracking-wider">
          &copy; 2026 {tenantConfig.name}
        </span>
        <a
          href={tenantConfig.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-slate-400 hover:text-slate-600 tracking-wider transition-colors"
        >
          LINKEDIN
        </a>
      </div>

      {/* ===== Glass Card (centered) ===== */}
      <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
        <GlassCard currentStep={step}>
          {step !== "meeting" ? (
            <div key={step} className="animate-slide-in flex-1 flex">
              {step === "welcome" && <WelcomeStep onContinue={handleContinue} />}
              {step === "config" && <ConfigStep stream={streamRef.current} onContinue={handleContinue} />}
              {step === "intro" && <IntroStep onContinue={handleContinue} />}
            </div>
          ) : (
            <MeetingRoom />
          )}
        </GlassCard>
      </div>
    </div>
  );
}
