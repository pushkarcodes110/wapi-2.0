/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAppSelector } from "@/src/redux/hooks";
import WabaRequired from "@/src/shared/WabaRequired";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminTemplateLibrary from "./AdminTemplateLibrary";
import MessageTemplates from "./MessageTemplates";
import TemplatesSidebar, { TemplateView } from "./TemplatesSidebar";
import { usePermissions } from "@/src/hooks/usePermissions";

const UnifiedTemplatesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hasPermission, isAuthenticated } = usePermissions();
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const wabaId = selectedWorkspace?.waba_id;
  const canViewExplore = hasPermission("view.admin-template");

  // Initialize view from URL if present
  const [activeView, setActiveView] = useState<TemplateView>("custom");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const tab = searchParams.get("tab");
    if (tab === "explore" && canViewExplore) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveView("explore");
    } else if (tab === "custom") {
      setActiveView("custom");
    } else {
      // Default fallback
      setActiveView(canViewExplore ? "explore" : "custom");
    }
  }, [searchParams, canViewExplore, isAuthenticated]);

  // Explore tab state (passed to AdminTemplateLibrary)
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // All tab state (passed to MessageTemplates)
  const [selectedStatus, setSelectedStatus] = useState("all");

  const handleViewChange = (view: TemplateView) => {
    setActiveView(view);
    setSidebarOpen(false);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", view);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (!wabaId) {
    return <WabaRequired title="WABA Connection Required" description="To manage WhatsApp message templates, you first need to connect a WhatsApp Business Account (WABA) to this workspace." />;
  }

  return (
    <div className="flex h-full bg-slate-50/50 dark:bg-(--dark-body) overflow-hidden relative">
      {sidebarOpen && <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-60 [@media(min-width:1600px)]:hidden" onClick={() => setSidebarOpen(false)} />}

      <div
        className={`
          absolute top-0 ltr:left-0 rtl:right-0 h-full z-70 transition-transform duration-300 ease-in-out
          [@media(min-width:1600px)]:static [@media(min-width:1600px)]:translate-x-0 [@media(min-width:1600px)]:z-auto [@media(min-width:1600px)]:h-full [@media(min-width:1600px)]:shrink-0
          ${sidebarOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"}
        `}
      >
        <TemplatesSidebar activeView={activeView} selectedSector={selectedSector} selectedCategory={selectedCategory} selectedStatus={selectedStatus} onViewChange={handleViewChange} onSectorChange={setSelectedSector} onCategoryChange={setSelectedCategory} onStatusChange={setSelectedStatus} onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 h-screen overflow-hidden relative flex flex-col">
        <div className="flex-1 overflow-hidden">{activeView === "explore" ? <AdminTemplateLibrary selectedSector={selectedSector} selectedCategory={selectedCategory} wabaId={wabaId} onToggleSidebar={() => setSidebarOpen(true)} /> : <MessageTemplates wabaId={wabaId} statusFilter={selectedStatus} onToggleSidebar={() => setSidebarOpen(true)} />}</div>
      </div>
    </div>
  );
};

export default UnifiedTemplatesPage;
