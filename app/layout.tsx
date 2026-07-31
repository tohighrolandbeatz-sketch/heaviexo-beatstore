import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HEAVIEXO BEATS - Pro Beatstore",
  description: "High-definition music production studio & beatstore. Dark Trap, Melodic Drill, Boom Bap beats.",
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico", apple: "/favicon.ico" },
  openGraph: {
    title: "HEAVIEXO BEATS - Pro Beatstore",
    description: "High-definition music production studio & beatstore.",
    url: "https://heaviexo-beatstore.vercel.app",
    siteName: "HEAVIEXO BEATS",
    images: [{ url: "/LOGO-BEAT.png", width: 500, height: 500 }],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HEAVIEXO BEATS - Pro Beatstore",
    description: "High-definition music production studio & beatstore.",
    images: ["/LOGO-BEAT.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}