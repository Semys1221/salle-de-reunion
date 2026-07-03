import type { Metadata } from "next";
import { ReunionFunnel } from "@/components/reunionfunnel/reunionfunnel";

export const metadata: Metadata = {
  title: "Salle de réunion | SYLK Conseils",
  description: "Interface de visioconférence sécurisée pour vos entretiens conseil.",
  robots: { index: false, follow: false },
};

export default function ReunionPage() {
  return <ReunionFunnel />;
}
