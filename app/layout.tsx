import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const FALLBACK: Metadata = {
    title: "Heavi Beats - Beatstore",
    description: "Beats professionnels pour artistes exigeants",
  };

  try {
    const result = await db.execute(sql`SELECT * FROM design_config LIMIT 1`);
    const row = result.rows?.[0];
    if (!row) return FALLBACK;

    return {
      title: (row.site_name as string) || FALLBACK.title,
      description: (row.description as string) || FALLBACK.description,
      icons: row.favicon ? { icon: row.favicon as string } : undefined,
    };
  } catch (error) {
    console.error("generateMetadata /api/design fallback:", error);
    return FALLBACK;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
