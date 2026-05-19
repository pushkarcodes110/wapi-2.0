"use client";

import { Button } from "@/src/elements/ui/button";
import { Switch } from "@/src/elements/ui/switch";
import { usePermissions } from "@/src/hooks/usePermissions";
import DataTable from "@/src/shared/DataTable";
import { Page } from "@/src/types/store";
import { format } from "date-fns";
import { Edit, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../constants";
import Can from "../shared/Can";

interface PageListProps {
  pages: Page[];
  isLoading: boolean;
  onDelete: (page: Page) => void;
  onBulkDelete: (ids: string[]) => void;
  onToggleStatus: (id: string) => void;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  onSelectionChange: (ids: string[]) => void;
  selectedIds: string[];
  onSortChange: (key: string, order: "asc" | "desc") => void;
  visibleColumns: Record<string, boolean>;
  searchTerm?: string;
  isFilterActive?: boolean;
}

const PageList = ({ pages, isLoading, onDelete, onBulkDelete, onToggleStatus, total, page, totalPages, onPageChange, limit, onLimitChange, onSelectionChange, selectedIds, onSortChange, visibleColumns, searchTerm, isFilterActive }: PageListProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { hasPermission } = usePermissions();

  const handleEdit = (page: Page) => {
    router.push(`${ROUTES.ManagePagesEdit}/${page._id}`);
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, "");
  };

  const columns = [
    {
      header: t("pages_title_header", "Title"),
      className: "[@media(max-width:1560px)]:min-w-[290px]",
      sortable: true,
      sortKey: "title",
      copyable: true,
      copyField: "title",
      accessor: (row: Page) => (
        <div className="flex flex-col cursor-pointer" onClick={() => handleEdit(row)}>
          <span className="font-medium text-sm text-gray-900 dark:text-white capitalize">{row.title}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{row.slug}</span>
        </div>
      ),
    },
    {
      header: t("pages_content_section"),
      className: "[@media(max-width:1560px)]:min-w-[470px]",
      sortable: true,
      sortKey: "content",
      copyable: true,
      copyField: "content",
      accessor: (row: Page) => (
        <div className="flex flex-col cursor-pointer" onClick={() => handleEdit(row)}>
          <span className="font-medium text-gray-700 dark:text-white break-word line-clamp-2 text-sm">{stripHtml(row.content)}</span>
        </div>
      ),
    },
    {
      header: t("common_status", "Status"),
      className: "[@media(max-width:1560px)]:min-w-[120px]",
      sortable: true,
      sortKey: "status",
      accessor: (row: Page) => <Switch checked={row.status} onCheckedChange={() => onToggleStatus(row._id)} disabled={isLoading || !hasPermission("update.pages")} className="data-[state=checked]:bg-(--text-green-primary)" />,
    },
    {
      header: t("common_created_at", "Created At"),
      className: "[@media(max-width:1560px)]:min-w-[150px]",
      sortable: true,
      sortKey: "created_at",
      accessor: (row: Page) => <span className="text-sm text-gray-500 dark:text-gray-400">{row.created_at ? format(new Date(row.created_at), "MMMM d, yyyy") : "N/A"}</span>,
    },
  ].filter((col) => {
    if (col.sortKey && visibleColumns[col.sortKey] !== undefined) {
      return visibleColumns[col.sortKey];
    }
    return true;
  });

  const renderActions = (row: Page) => (
    <div className="flex items-center gap-2">
      <Can permission="update.pages">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(row)} className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs dark:bg-(--page-body-bg)" title={t("common_edit")} disabled={isLoading}>
          <Edit2 className="w-4 h-4" />
        </Button>
      </Can>
    </div>
  );

  return <DataTable data={pages} columns={columns} page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} onLimitChange={onLimitChange} limit={limit} isLoading={isLoading} onDelete={(item: Page) => onDelete(item)} deletePermission="delete.pages" actionPermissions={["update.pages"]} onBulkDelete={onBulkDelete} onSelectionChange={onSelectionChange} selectedIds={selectedIds} itemLabel="Pages" renderActions={renderActions} onSortChange={onSortChange} searchTerm={searchTerm} isFilterActive={isFilterActive} />;
};

export default PageList;
