/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetAdminTemplatesQuery, useLazyGetAdminTemplateByIdQuery } from "@/src/redux/api/adminTemplateApi";
import { useGetConnectionsQuery } from "@/src/redux/api/whatsappApi";
import CommonHeader from "@/src/shared/CommonHeader";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AdminTemplateCard } from "./AdminTemplateCard";
import { SelectWabaModal } from "./list/SelectWabaModal";
import { TemplatePreviewModal } from "./list/TemplatePreviewModal";
import { ROUTES } from "@/src/constants";

interface AdminTemplateLibraryProps {
  selectedSector?: string;
  selectedCategory?: string;
  wabaId?: string;
  onToggleSidebar?: () => void;
}

const AdminTemplateLibrary = ({ selectedSector: sectorProp, selectedCategory: categoryProp, wabaId: wabaIdProp, onToggleSidebar }: AdminTemplateLibraryProps = {}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Priority: prop from parent workspace > URL search param (legacy)
  const preSelectedWabaId = wabaIdProp || searchParams.get("wabaId");

  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [usingTemplateId, setUsingTemplateId] = useState<string | null>(null);
  const [isWabaModalOpen, setIsWabaModalOpen] = useState(false);

  // Use props from sidebar if provided, otherwise default to "all"
  const selectedSector = sectorProp ?? "all";
  const selectedCategory = categoryProp ?? "all";

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetAdminTemplatesQuery({
    search: searchQuery || undefined,
    sector: selectedSector === "all" ? undefined : selectedSector,
    template_category: selectedCategory === "all" ? undefined : selectedCategory,
  });
  const [getAdminTemplateById] = useLazyGetAdminTemplateByIdQuery();
  const { data: connectionsResponse } = useGetConnectionsQuery({});

  const templates: any[] = response?.data || [];
  const connections = connectionsResponse?.data || [];

  const handleRefresh = () => {
    refetch();
    toast.success("Templates refreshed successfully");
  };

  const handleConfirmWabaSelection = async (selectedWabaId: string, templateId?: string) => {
    const idToUse = templateId || usingTemplateId;
    if (!idToUse) return;

    try {
      await getAdminTemplateById(idToUse).unwrap();
      router.push(`${ROUTES.MessageTemplates}/${selectedWabaId}/create?templateId=${idToUse}`);
    } catch {
      toast.error("Failed to load admin template. Please try again.");
    } finally {
      setUsingTemplateId(null);
    }
  };

  const handleUseTemplate = (templateId: string) => {
    if (connections.length === 0) {
      toast.error("No WABA connection found. Please connect a WhatsApp account first.");
      return;
    }

    if (preSelectedWabaId) {
      handleConfirmWabaSelection(preSelectedWabaId, templateId);
      return;
    }

    setUsingTemplateId(templateId);
    setIsWabaModalOpen(true);
  };

  return (
    <div className="p-4 pt-0! sm:p-6 space-y-8 h-screen flex flex-col min-w-0 overflow-[unset]">
      <CommonHeader title={t("admin_library_page_title")} description={t("admin_library_page_description")} onSearch={setSearchQuery} searchTerm={searchQuery} searchPlaceholder="Search templates..." onRefresh={handleRefresh} isLoading={isLoading} onToggleSidebar={onToggleSidebar} />

      <div className="flex-1 overflow-y-auto px-1 pb-10 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm text-slate-500 font-medium tracking-wide">Loading admin templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-32 bg-white/50 dark:bg-(--card-color) rounded-lg border border-dashed border-slate-200 dark:border-(--card-border-color)">
            <p className="text-sm text-slate-500 dark:text-amber-50">{searchQuery ? "No templates found matching your search." : "No admin templates available yet."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-4">
            {templates.map((template) => (
              <AdminTemplateCard key={template._id} template={template} onPreview={setPreviewTemplate} onUse={handleUseTemplate} isUsing={usingTemplateId === template._id} />
            ))}
          </div>
        )}
      </div>

      <TemplatePreviewModal isOpen={!!previewTemplate} onClose={() => setPreviewTemplate(null)} template={previewTemplate} />

      <SelectWabaModal
        isOpen={isWabaModalOpen}
        onClose={() => {
          setIsWabaModalOpen(false);
          setUsingTemplateId(null);
        }}
        connections={connections}
        onConfirm={handleConfirmWabaSelection}
      />
    </div>
  );
};

export default AdminTemplateLibrary;
