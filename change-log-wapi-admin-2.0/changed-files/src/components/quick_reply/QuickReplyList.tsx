"use client";

import { Button } from "@/src/elements/ui/button";
import DataTable from "@/src/shared/DataTable";
import { ColumnDef } from "@/src/types/shared";
import { format } from "date-fns";
import { Edit2, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import Can from "../shared/Can";

interface QuickReply {
  _id: string;
  content: string;
  is_admin_reply: boolean;
  is_favorite?: boolean;
  createdAt: string;
}

interface QuickReplyListProps {
  quickReplies: QuickReply[];
  page: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  limit: number;
  onEdit: (data: QuickReply) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onToggleFavorite: (id: string) => void;
  isLoading: boolean;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onSortChange?: (key: string, order: "asc" | "desc") => void;
  searchTerm?: string;
}

const QuickReplyList = ({
  quickReplies,
  page,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  limit,
  onEdit,
  onDelete,
  onBulkDelete,
  onToggleFavorite,
  isLoading,
  selectedIds,
  onSelectionChange,
  onSortChange,
  searchTerm,
}: QuickReplyListProps) => {
  const { t } = useTranslation();

  const columns: ColumnDef<QuickReply>[] = [
    {
      header: t("quick_reply_content_label"),
      className: "min-w-[400px]",
      sortable: true,
      sortKey: "content",
      copyable: true,
      copyField: "content",
      accessor: (qr) => (
        <div className="flex items-start gap-2">
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(qr._id);
              }}
              className={`mt-1 transition-colors ${qr.is_favorite
                ? "text-amber-400 hover:text-amber-500"
                : "text-slate-300 hover:text-slate-400"
                }`}
            >
              <Star
                size={16}
                className={qr.is_favorite ? "text-amber-400 fill-amber-400" : "text-slate-300 fill-none"}
              />
            </button>
          )}
          <span
            className="text-slate-700 dark:text-slate-200 line-clamp-3 whitespace-pre-wrap transition-colors"
          >
            {qr.content}
          </span>
        </div>
      ),
    },
    {
      header: t("common_created_at"),
      className: "min-w-[150px]",
      sortable: true,
      sortKey: "createdAt",
      accessor: (qr) => (
        <span className="text-slate-500 dark:text-slate-400 text-sm">
          {qr.createdAt ? format(new Date(qr.createdAt), "MMMM d, yyyy") : "N/A"}
        </span>
      ),
    },
  ];

  const renderActions = (qr: QuickReply) => (
    <div className="flex items-center gap-2">
      <Can permission="update.quick_replies">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(qr)}
          className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs dark:bg-(--page-body-bg)"
          title={t("common_edit")}
          disabled={isLoading}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
      </Can>
    </div>
  );

  return (
    <DataTable
      data={quickReplies}
      columns={columns}
      page={page}
      total={total}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      limit={limit}
      isLoading={isLoading}
      onDelete={(item: QuickReply) => onDelete(item._id)}
      deletePermission="delete.quick_replies"
      actionPermissions={["update.quick_replies"]}
      onBulkDelete={onBulkDelete}
      onSelectionChange={onSelectionChange}
      selectedIds={selectedIds}
      emptyMessage={t("quick_reply_no_replies")}
      itemLabel="Quick Replies"
      renderActions={renderActions}
      onSortChange={onSortChange}
      searchTerm={searchTerm}
    />
  );
};

export default QuickReplyList;
