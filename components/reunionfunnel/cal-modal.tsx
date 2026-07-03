"use client";

import { Calendar } from "lucide-react";
import { tenantConfig } from "@/lib/tenant-config";

export function CalModal() {
  return (
    <a
      href={tenantConfig.calendlyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-all text-sm font-medium"
    >
      <Calendar size={16} />
      Réserver le prochain rendez-vous
    </a>
  );
}
