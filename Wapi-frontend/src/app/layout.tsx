import "@xyflow/react/dist/style.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Geist_Mono, Mona_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import InternetConnectionWrapper from "../components/layouts/InternetConnectionWrapper";
import DynamicSettingsProvider from "../components/providers/DynamicSettingsProvider";
import MaintenanceGuard from "../components/providers/MaintenanceGuard";
import FeatureGuard from "../shared/FeatureGuard";
import SocketProvider from "../components/providers/SocketProvider";
import ImagePreviewModal from "../components/shared/ImagePreviewModal";
import { TooltipProvider } from "../elements/ui/tooltip";
import RoleGuard from "../shared/RoleGuard";
import SessionWrapper from "../shared/SessionWrapper";
import SubscriptionGuard from "../shared/SubscriptionGuard";
import { authoption } from "./api/auth/[...nextauth]/authOption";
import FacebookSDKProvider from "./FacebookSDKProvider";
import "./globals.css";
import I18nProvider from "./I18nProvider";
import ReduxProvider from "./ReduxProvider";
import { ThemeProvider } from "./ThemeProvider";
import Script from "next/script";
import { ToastManager } from "../components/providers/ToastManager";

const geistSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  description: "All-in-One WhatsApp Marketing & Automation Platform with CRM, Campaigns, Live Chat, Lead Generation, Business API SaaS Platform",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authoption);

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/assets/logos/app.png" />
      </head>
      <body className={`${geistSans.variable} antialiased h-full custom-scrollbar`} suppressHydrationWarning>
        <ThemeProvider>
          <TooltipProvider>
            <ReduxProvider>
              <SessionWrapper session={session}>
                <I18nProvider>
                  <SocketProvider>
                    <DynamicSettingsProvider>
                      <AntdRegistry>
                        <MaintenanceGuard>
                          <InternetConnectionWrapper>
                            <FacebookSDKProvider>
                              <SubscriptionGuard>
                                <RoleGuard>
                                  <FeatureGuard>{children}</FeatureGuard>
                                </RoleGuard>
                              </SubscriptionGuard>
                            </FacebookSDKProvider>
                          </InternetConnectionWrapper>
                        </MaintenanceGuard>
                      </AntdRegistry>
                    </DynamicSettingsProvider>
                  </SocketProvider>
                </I18nProvider>
              </SessionWrapper>
              <ImagePreviewModal />
            </ReduxProvider>
            <Toaster position="top-center" theme="dark" richColors closeButton />
            <ToastManager />
            <NextTopLoader color="primary" showSpinner={false}/>
            {/* <div data-id="69aa78266d6db6e00a12ed3a" id="vf_root_" />
            <Script src="http://localhost:5000/uploads/widget.js" strategy="afterInteractive" /> */}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
