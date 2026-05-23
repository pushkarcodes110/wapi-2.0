import type { Metadata } from "next";
import { Geist_Mono, Mona_Sans } from "next/font/google";
import "./globals.css";
import MainProvider from "./MainProvider";
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "@/src/elements/ui/sonner";
import { ToastManager } from "../components/providers/ToastManager";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Synqzy",
  description: "One solution...",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${monaSans.variable} ${geistMono.variable} antialiased custom-scrollbar`} suppressHydrationWarning>
        <ThemeProvider>
          <MainProvider>{children}</MainProvider>
          <Toaster position="top-center" />
          <ToastManager />
        </ThemeProvider>
      </body>
    </html>
  );
}
