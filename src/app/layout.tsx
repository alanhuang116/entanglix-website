import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Entanglix | Data-driven SaaS, data services & AI agents",
  description:
    "Entanglix builds data-driven SaaS products and AI agents: Research Architect for hypothesis framing, FloodVuln Global for flood vulnerability in banking and insurance, and the GH-PM25 Observatory for daily 1-km air quality in Ghana.",
  keywords: [
    "SaaS",
    "Data services",
    "AI agents",
    "Research Architect",
    "FloodVuln Global",
    "Flood vulnerability",
    "Climate risk",
    "Air quality",
    "PM2.5",
    "GeoAI",
  ],
  openGraph: {
    title: "Entanglix | Data in. Decisions out.",
    description:
      "Data-driven SaaS, data services and a growing collection of AI agents for research, climate risk and the environment.",
    url: "https://entanglix.tech",
    siteName: "Entanglix Tech",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
