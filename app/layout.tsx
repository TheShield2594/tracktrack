import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "TrackTrack – Subscription Manager",
  description: "A modern subscription tracker that helps you stay on top of recurring costs.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TrackTrack",
  },
  applicationName: "TrackTrack",
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/apple-icon" />
      </head>
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-60 min-h-screen">
            <div className="max-w-6xl mx-auto px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
