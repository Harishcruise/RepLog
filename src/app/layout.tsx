import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "RepLog", template: "%s · RepLog" },
  description: "Log every set. Watch it climb.",
  applicationName: "RepLog",
  appleWebApp: {
    capable: true,
    title: "RepLog",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0f0d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
