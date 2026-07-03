import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Salle de réunion | SYLK Conseils",
  description: "Interface de visioconférence sécurisée pour vos entretiens conseil.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
