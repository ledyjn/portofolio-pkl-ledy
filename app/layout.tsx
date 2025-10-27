import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClickSpark from "@/components/ClickSpark";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ledy Jentri Meiza - XII RPL A",
  description: "Projek Praktek Kerja Lapangan - Ledy Jentri Meiza, Siswa XII RPL A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <ClickSpark
          sparkColor="#F97316"
          sparkSize={10}
          sparkRadius={20}
          sparkCount={8}
          duration={500}
        >
          {children}
        </ClickSpark>
      </body>
    </html>
  );
}
