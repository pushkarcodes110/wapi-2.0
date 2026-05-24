import type { Metadata } from "next";
import { Geist_Mono, Mona_Sans } from "next/font/google";
import "./globals.css";
import MainProvider from "./MainProvider";
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "@/src/elements/ui/sonner";
import { ToastManager } from "../components/providers/ToastManager";

const APP_NAME = "Synqzy";
const APP_URL = process.env.NEXT_PUBLIC_WAPI_ADMIN_URL || "https://admin.synqzy.com";
const APP_DESCRIPTION = "Synqzy admin portal for WhatsApp automation, CRM, campaigns, and business messaging.";
const APP_ICON = "/assets/logos/app.png";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} Admin`,
    template: `%s | ${APP_NAME} Admin`,
  },
  description: APP_DESCRIPTION,
  applicationName: `${APP_NAME} Admin`,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: APP_ICON, type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: APP_ICON, sizes: "192x192", type: "image/png" }],
  },
  openGraph: {
    title: `${APP_NAME} Admin`,
    description: APP_DESCRIPTION,
    url: APP_URL,
    siteName: APP_NAME,
    images: [{ url: APP_ICON, width: 192, height: 192, alt: `${APP_NAME} logo` }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${APP_NAME} Admin`,
    description: APP_DESCRIPTION,
    images: [APP_ICON],
  },
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
