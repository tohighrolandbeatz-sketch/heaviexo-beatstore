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
  title: "HEAVIEXO BEATS - Pro Beatstore",
  description: "High-definition music production studio & beatstore. Dark Trap, Melodic Drill, Boom Bap beats. Mix & Mastering services.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              history.scrollRestoration = 'manual';
              window.addEventListener('beforeunload', function() {
                window.scrollTo(0, 0);
              });
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}