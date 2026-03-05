import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";

export const metadata: Metadata = {
  title: "Pool Leaderboard",
  description: "Track your pool hall rankings with ELO ratings",
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎱</text></svg>" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070a08",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
