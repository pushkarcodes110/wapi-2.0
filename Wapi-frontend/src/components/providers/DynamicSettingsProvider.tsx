/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, ReactNode } from "react";
import { useGetSettingsQuery } from "@/src/redux/api/settingsApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setSetting } from "@/src/redux/reducers/settingSlice";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

const API_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";

const resolveUrl = (url?: string): string => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_URL}${url}`;
};

const DEFAULT_FAVICON = "/assets/logos/sidebarLogo.png";

function applyFavicon(href: string) {
  if (typeof window === "undefined" || !href) return;

  const links = document.querySelectorAll("link[rel*='icon']");
  const normalizedHref = href.startsWith("http") ? href : new URL(href, window.location.origin).href;

  if (links.length > 0) {
    links.forEach((link: any) => {
      const normalizedLinkHref = new URL(link.href, window.location.origin).href;
      if (normalizedLinkHref !== normalizedHref) {
        link.href = href;
      }
    });
  } else {
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = href;
    document.head.appendChild(link);
  }
}

interface DynamicSettingsProviderProps {
  children: ReactNode;
}

const DynamicSettingsProvider = ({ children }: DynamicSettingsProviderProps) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { data: settingsData, isSuccess } = useGetSettingsQuery({});
  const { app_name, favicon_url, app_description, pageTitle, pageDescription } = useAppSelector((state) => state.setting);
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    try {
      const cached = localStorage.getItem("app_settings");
      if (cached) {
        const parsed = JSON.parse(cached);
        const settingsToSet = parsed.data || parsed;
        dispatch(setSetting({ ...settingsToSet, maintenance_mode: false }));
      }
    } catch {}
  }, [dispatch]);

  useEffect(() => {
    if (settingsData) {
      const dataToSet = settingsData.data || settingsData;
      dispatch(setSetting(dataToSet));
    }
  }, [settingsData, dispatch]);

  useEffect(() => {
    if (mounted && settingsData?.data?.default_theme_mode) {
      const saved = localStorage.getItem("theme");
      if (!saved || saved === "system") {
        setTheme(settingsData.data.default_theme_mode);
      }
    }
  }, [mounted, settingsData, setTheme]);

  useEffect(() => {
    if (!mounted) return;

    const faviconHref = resolveUrl(favicon_url) || DEFAULT_FAVICON;

    // Title update
    const baseTitle = app_name || "Wapi";
    const fullTitle = pageTitle 
      ? `${pageTitle} | ${baseTitle}`
      : `${baseTitle} | All-in-One WhatsApp Marketing & Automation Platform`;

    if (document.title !== fullTitle) {
      document.title = fullTitle;
    }

    // Description update
    const description = pageDescription || app_description;
    if (description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      if (meta.getAttribute("content") !== description) {
        meta.setAttribute("content", description);
      }
    }

    // Favicon update
    if (faviconHref) {
      applyFavicon(faviconHref);
    }
  }, [app_name, app_description, favicon_url, pathname, mounted, pageTitle, pageDescription]);

  return <>{children}</>;
};

export default DynamicSettingsProvider;
