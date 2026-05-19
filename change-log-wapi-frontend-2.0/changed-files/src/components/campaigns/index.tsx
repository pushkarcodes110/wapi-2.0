/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Progress } from "@/src/elements/ui/progress";
import { useDeleteCampaignByIdMutation, useGetCampaignsQuery } from "@/src/redux/api/campaignApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import ExportModal from "@/src/shared/ExportModal";
import { Campaign } from "@/src/types/components";
import { Column } from "@/src/types/shared";
import { formatDateTime } from "@/src/utils";
import { exportToCSV, exportToExcel, exportToPrint } from "@/src/utils/exportUtils";
import { AlertCircle, Calendar, CheckCircle2, Clock, FileDown, Info, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import CampaignDetailModal from "./CampaignDetailModal";
import CampaignStats from "./CampaignStats";

const CampaignsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [infoCampaignId, setInfoCampaignId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportCampaignId, setExportCampaignId] = useState<string | null>(null);

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const {
    data: campaignsResult,
    isLoading,
    refetch,
    isFetching,
  } = useGetCampaignsQuery({
    page,
    limit,
    search: searchTerm,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignByIdMutation();

  const campaigns: Campaign[] = campaignsResult?.data?.campaigns || [];
  const totalCount = campaignsResult?.data?.pagination?.totalItems || 0;

  const columns: Column<Campaign>[] = [
    {
      header: "Name",
      accessorKey: "name",
      sortable: true,
      sortKey: "name",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-gray-200">{row.name}</span>
          <span className="text-xs text-gray-400 truncate max-w-50">{row.description || "No description"}</span>
        </div>
      ),
    },
    {
      header: "Presets",
      sortable: true,
      sortKey: "template_name",
      accessorKey: "template_name",
      cell: (row) => (
        <Badge variant="outline" className="bg-gray-50 text-slate-600 border-blue-100 dark:bg-(--dark-sidebar) dark:text-amber-50 dark:border-(--card-border-color)">
          {row.template_name}
        </Badge>
      ),
    },
    {
      header: "Progress",
      cell: (row) => {
        const stats = row.stats;
        const progress = stats?.total_recipients ? Math.round(((stats.total_recipients - (stats.pending_count || 0)) / stats.total_recipients) * 100) : 0;
        return (
          <div className="flex flex-col gap-1 w-24">
            <Progress value={progress} className="h-1.5" />
            <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
              {progress}% ({stats?.total_recipients - (stats?.pending_count || 0)}/{stats?.total_recipients})
            </span>
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => {
        const statusConfig: any = {
          draft: {
            icon: Clock,
            className: "bg-gray-100 text-gray-600 border-gray-200 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)",
            label: "Draft",
          },
          scheduled: {
            icon: Calendar,
            className: "bg-amber-50 text-amber-600 border-amber-100 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)",
            label: "Scheduled",
          },
          sending: {
            icon: Loader2,
            className: "bg-blue-50 text-blue-600 dark:text-primary border-blue-100 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover) animate-pulse",
            label: "Sending",
          },
          completed: {
            icon: CheckCircle2,
            className: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)",
            label: "Completed",
          },
          failed: {
            icon: AlertCircle,
            className: "bg-red-50 text-red-600 border-red-100 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)",
            label: "Failed",
          },
          completed_with_errors: {
            icon: AlertCircle,
            className: "bg-red-50 text-red-600 border-red-100 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)",
            label: "Failed",
          },
          cancelled: {
            icon: AlertCircle,
            className: "bg-slate-100 text-slate-600 border-slate-200 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)",
            label: "Cancelled",
          },
        };
        const config = statusConfig[row.status] || statusConfig.draft;
        const Icon = config.icon;
        return (
          <Badge className={`flex items-center gap-1 border ${config.className}`}>
            <Icon size={12} className={row.status === "sending" ? "animate-spin" : ""} />
            {config.label}
          </Badge>
        );
      },
    },
    {
      header: "Send",
      cell: (row) => (
        <div className="flex items-center gap-1 text-xs">
          <span className="text-blue-600 font-bold" title="Sent">
            {row.stats?.sent_count || 0}
          </span>
        </div>
      ),
    },
    {
      header: "Delivered",
      cell: (row) => (
        <div className="flex items-center gap-1 text-xs">
          <span className="text-emerald-600 font-bold" title="Delivered">
            {row.stats?.delivered_count || 0}
          </span>
        </div>
      ),
    },
    {
      header: "Read",
      cell: (row) => (
        <div className="flex items-center gap-1 text-xs">
          <span className="text-purple-600 font-bold" title="Read">
            {row.stats?.read_count || 0}
          </span>
        </div>
      ),
    },
    {
      header: "Failed",
      cell: (row) => (
        <div className="flex items-center gap-1 text-xs">
          <span className="text-red-500 font-bold" title="Failed">
            {row.stats?.failed_count || 0}
          </span>
        </div>
      ),
    },
    {
      header: "Sent At",
      sortable: true,
      sortKey: "sent_at",
      cell: (row) => <span className="text-gray-500 dark:text-gray-400 text-xs">{row?.sent_at ? formatDateTime(row.sent_at) : "-"}</span>,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs"
            onClick={() => {
              setInfoCampaignId(row._id || (row as any).id);
            }}
            title="Info"
          >
            <Info size={14} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs"
            onClick={() => {
              setExportCampaignId(row._id || (row as any).id);
              setExportModalOpen(true);
            }}
            disabled={row.status !== "completed" && row.status !== "failed" && row.status !== "completed_with_errors"}
            title="Download Report"
          >
            <FileDown size={14} />
          </Button>
          {(row.status === "draft" || row.status === "scheduled") && (
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 border-none text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-500/10 transition-all shadow-xs"
              onClick={() => setDeleteId(row._id || (row as any).id)}
              title="Delete"
            >
              <Trash2 size={14} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteCampaign(deleteId).unwrap();
        toast.success("Campaign deleted successfully");
        setDeleteId(null);
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete campaign");
      }
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Campaigns refreshed");
  };

  const handleExport = (type: "csv" | "excel" | "print") => {
    const campaignAction = campaigns.find((c) => (c._id || (c as any).id) === exportCampaignId);
    if (!campaignAction) {
      toast.error("Campaign not found");
      return;
    }

    const headers = ["Campaign Name", "Template", "Status", "Sent", "Delivered", "Read", "Failed", "Sent At"];
    const rowData = [[campaignAction.name, campaignAction.template_name, campaignAction.status, String(campaignAction.stats?.sent_count || 0), String(campaignAction.stats?.delivered_count || 0), String(campaignAction.stats?.read_count || 0), String(campaignAction.stats?.failed_count || 0), campaignAction.sent_at ? formatDateTime(campaignAction.sent_at) : "-"]];

    if (type === "csv") {
      exportToCSV(headers, rowData, "campaign_report");
    } else if (type === "excel") {
      exportToExcel(headers, rowData, "campaign_report", "Campaign Report");
    } else if (type === "print") {
      exportToPrint(headers, rowData, "Campaign Report", `Report for campaign: ${campaignAction.name}`);
    }
    setExportModalOpen(false);
  };

  return (
    <div className="sm:p-8 pt-0! p-4 space-y-8 bg-(--page-body-bg) dark:bg-(--dark-body)">
      <CommonHeader
        title={t("campaigns_page_title")}
        description={t("campaigns_page_description")}
        middleContent={<CampaignStats stats={campaignsResult?.data?.campaignStatistics} isLoading={isLoading} />}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        featureKey="contacts_used"
        searchPlaceholder="Search campaigns..."
        onRefresh={handleRefresh}
        onAddClick={() => {
          router.push(ROUTES.MessageCampaignsAdd);
        }}
        addLabel="Add Campaign"
        addPermission="create.campaigns"
        deletePermission="delete.campaigns"
        isLoading={isLoading}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:border-(--card-border-color) dark:bg-(--card-color)">
        <DataTable data={campaigns} columns={columns} isLoading={isLoading} isFetching={isFetching} totalCount={totalCount} page={page} limit={limit} onPageChange={setPage} onLimitChange={setLimit} getRowId={(item) => item._id || (item as any).id} emptyMessage={searchTerm ? `No campaigns found matching "${searchTerm}"` : "No campaigns created yet."} className="border-none shadow-none rounded-none" onSortChange={handleSortChange} sortBy={sortBy} sortOrder={sortOrder} />
      </div>

      <CampaignDetailModal isOpen={!!infoCampaignId} onClose={() => setInfoCampaignId(null)} campaignId={infoCampaignId} />

      <ExportModal isOpen={exportModalOpen} onClose={() => setExportModalOpen(false)} onExport={handleExport} title="Download Campaign Report" description="Select your preferred format to download the campaign report." />

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={isDeleting} title="Delete Campaign" subtitle="Are you sure you want to delete this campaign? This action cannot be undone." confirmText="Delete" variant="danger" />
    </div>
  );
};

export default CampaignsPage;
