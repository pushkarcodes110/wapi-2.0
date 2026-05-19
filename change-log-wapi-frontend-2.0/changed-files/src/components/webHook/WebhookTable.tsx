/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { Switch } from "@/src/elements/ui/switch";
import { DataTable } from "@/src/shared/DataTable";
import { Webhook, WebhookTableProps } from "@/src/types/webhook";
import { cn } from "@/src/utils";
import { Edit2, LayoutTemplate, Trash2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const WebhookTable = ({ data, isLoading, localStatuses, onEdit, onDelete, onToggle, onViewPayload, onSortChange, page, limit, onPageChange, onLimitChange, totalCount }: WebhookTableProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const columns = [
    {
      header: "Name",
      accessorKey: "webhook_name",
      copyable: true,
      copyValue: "webhook_name",
      sortable: true,
      sortKey: "webhook_name",
      cell: (row: Webhook) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 dark:text-white break-all whitespace-normal">{row.webhook_name}</span>
          {row.platform && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{row.platform}</span>}
        </div>
      ),
    },
    {
      header: "URL",
      accessorKey: "webhook_url",
      copyable: true,
      copyValue: "webhook_url",
      sortable: true,
      sortKey: "webhook_url",
      cell: (row: Webhook) => (
        <span className="text-slate-500 dark:text-slate-400 truncate max-w-62.5 block font-mono text-[12px]" title={row.webhook_url}>
          {row.webhook_url}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "is_active",
      sortable: true,
      sortKey: "is_active",
      cell: (row: Webhook) => {
        const id = (typeof row._id === "string" ? row._id : row._id?.$oid) || row.id;
        return (
          <div className="flex items-center gap-2">
            <Switch checked={localStatuses[id || ""] ?? row.is_active} onCheckedChange={() => id && onToggle(id, row.is_active)} className="data-[state=checked]:bg-primary" />
          </div>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: (row: Webhook) => {
        const id = (typeof row._id === "string" ? row._id : row._id?.$oid) || row.id;
        const isConfigured = row.is_template_mapped;
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" title="View Payload" className="h-10 w-10   text-blue-600 dark:text-slate-400 hover:text-blue-600 border-none hover:bg-blue-100 dark:hover:bg-blue-500/20" onClick={() => onViewPayload(row)}>
              <Zap size={16} />
            </Button>
            <Button variant="outline" size="icon" title="Edit Webhook" className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs" onClick={() => onEdit(row)}>
              <Edit2 size={16} />
            </Button>
            <Button variant="outline" size="icon" title={isConfigured ? t("edit_template") : t("map_template")} className={cn("h-10 w-10   text-amber-600 border-none", row.first_payload ? "hover:text-amber-600 hover:bg-amber-50" : "opacity-50 cursor-not-allowed")} onClick={() => row.first_payload && router.push(`${ROUTES.WebhooksMapTemplate}/${id}`)} disabled={!row.first_payload}>
              <LayoutTemplate size={16} />
            </Button>
            <Button variant="outline" size="icon" title="Delete Webhook" className="w-10 h-10 border-none text-red-600 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 shadow-xs" onClick={() => id && onDelete(id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-xl border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden">
      <DataTable columns={columns as any} data={data} isLoading={isLoading} totalCount={totalCount} page={page} limit={limit} onPageChange={onPageChange} onLimitChange={onLimitChange} enableSelection={false} getRowId={(item) => ((typeof item._id === "string" ? item._id : item._id?.$oid) || item.id || "") as string} emptyMessage="No webhooks found. Create your first webhook!" onSortChange={onSortChange} />
    </div>
  );
};

export default WebhookTable;
