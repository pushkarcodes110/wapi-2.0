import "@xyflow/react/dist/style.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Mona_Sans } from "next/font/google";
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
import { ToastManager } from "../components/providers/ToastManager";

const APP_NAME = "Synqzy";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://synqzy.com";
const APP_DESCRIPTION = "Synqzy WhatsApp automation platform for CRM, campaigns, live chat, lead generation, and business messaging.";
const APP_ICON = "/assets/logos/app.png";

const geistSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} | WhatsApp Automation Platform`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: APP_ICON, type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: APP_ICON, sizes: "192x192", type: "image/png" }],
  },
  openGraph: {
    title: `${APP_NAME} | WhatsApp Automation Platform`,
    description: APP_DESCRIPTION,
    url: APP_URL,
    siteName: APP_NAME,
    images: [
      {
        url: APP_ICON,
        width: 192,
        height: 192,
        alt: `${APP_NAME} logo`,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${APP_NAME} | WhatsApp Automation Platform`,
    description: APP_DESCRIPTION,
    images: [APP_ICON],
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authoption);

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#059669" />
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
