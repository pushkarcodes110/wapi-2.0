"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/redux/hooks";
import { useGetUserSettingsQuery } from "@/src/redux/api/settingsApi";
import { LayoutList, X } from "lucide-react";
import { ROUTES } from "@/src/constants";
import DeveloperSidebar from "./IntegrationToolsSidebar";
import ApiKeyManager from "./ApiKeyManager";
import ApiDocViewer from "./ApiDocViewer";

const IntegrationTools = () => {
  const [activeTab, setActiveTab] = useState("conversational");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const { data: userSetting, isLoading } = useGetUserSettingsQuery();
  const router = useRouter();

  const restApiEnabled = userSetting?.data?.features?.rest_api;

  const { user } = useAppSelector((state) => state.auth);
  const isAgent = user?.role === "agent";

  useEffect(() => {
    if (!isLoading && userSetting && !restApiEnabled) {
      router.push(isAgent ? ROUTES.WAChat : ROUTES.Dashboard);
    }
  }, [isLoading, userSetting, restApiEnabled, router, isAgent]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!restApiEnabled) {
    return null;
  }

  return (
    <div className="flex h-full bg-slate-50/50 dark:bg-(--dark-body) overflow-hidden relative">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[105] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 h-full z-[110] transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:z-auto lg:h-full lg:shrink-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="relative h-full">
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-3 right-3 z-50 w-8 h-8 rounded-lg bg-slate-100 dark:bg-(--card-color) flex items-center justify-center text-slate-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-(--table-hover) transition-colors shadow-sm"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
          <DeveloperSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-primary border border-emerald-100 dark:border-emerald-500/20 text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors shadow-sm"
            aria-label="Open API menu"
          >
            <LayoutList size={16} />
            <span>API Menu</span>
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTab === "dashboard" ? (
            <ApiKeyManager />
          ) : (
            <ApiDocViewer sectionId={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationTools;
