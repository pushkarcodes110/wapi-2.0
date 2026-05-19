"use client";

import { Edit, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Can from "../shared/Can";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import DataTable from "@/src/shared/DataTable";
import { ColumnDef } from "@/src/types/shared";
import { Tax } from "@/src/types/store";
import { ROUTES } from "@/src/constants";

interface TaxListProps {
  taxes: Tax[];
  isLoading: boolean;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  onDelete: (item: Tax) => void;
  onBulkDelete: (ids: string[]) => void;
  onSelectionChange: (ids: string[]) => void;
  selectedIds: string[];
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  visibleColumns?: string[];
  searchTerm?: string;
}

const TaxList = ({ taxes, isLoading, total, page, totalPages, onPageChange, limit, onLimitChange, onDelete, onBulkDelete, onSelectionChange, selectedIds, onSortChange, visibleColumns, searchTerm }: TaxListProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const allColumns: (ColumnDef<Tax> & { id: string })[] = [
    {
      id: "name",
      header: t("tax_column_name") || " Name",
      className: "[@media(max-width:768px)]:min-w-[160px]",
      sortable: true,
      sortKey: "name",
      cell: (row) => <span className="font-medium text-gray-900 dark:text-gray-100">{row.name}</span>,
    },
    {
      id: "rate",
      header: t("tax_column_rate") || "Rate",
      className: "[@media(max-width:768px)]:min-w-[110px]",
      sortable: true,
      sortKey: "rate",
      cell: (row) => (
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {row.rate}
          {row.type === "percentage" ? "%" : ""}
        </span>
      ),
    },
    {
      id: "type",
      header: t("tax_column_type") || "Type",
      className: "[@media(max-width:768px)]:min-w-[160px]",
      sortable: true,
      sortKey: "type",
      cell: (row) => (
        <Badge variant="outline" className="capitalize border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
          {row.type}
        </Badge>
      ),
    },
    {
      id: "status",
      className: "[@media(max-width:768px)]:min-w-[125px]",
      header: t("tax_column_status") || "Status",
      sortable: true,
      sortKey: "is_active",
      cell: (row) => <Badge className={row.is_active ? "bg-emerald-100 text-(--text-green-primary) dark:bg-emerald-900/20 hover:bg-emerald-100" : "bg-gray-100 text-gray-700 dark:bg-page-body dark:text-gray-500 "}>{row.is_active ? t("common_active") : t("common_inactive")}</Badge>,
    },
  ];

  const columns = visibleColumns ? allColumns.filter((col) => visibleColumns.includes(col.id)) : allColumns;

  const renderActions = (tax: Tax) => (
    <div className="flex items-center gap-2">
      <Can permission="update.taxes">
        <Button variant="ghost" size="icon" className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs dark:bg-(--page-body-bg)" onClick={() => router.push(`${ROUTES.Taxes}/edit/${tax._id}`)} title={t("common_edit")}>
          <Edit2 className="w-4 h-4" />
        </Button>
      </Can>
    </div>
  );

  return <DataTable data={taxes} columns={columns} page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} onLimitChange={onLimitChange} limit={limit} isLoading={isLoading} onDelete={(item: Tax) => onDelete(item)} deletePermission="delete.taxes" actionPermissions={["update.taxes"]} onBulkDelete={onBulkDelete} renderActions={renderActions} onSelectionChange={onSelectionChange} selectedIds={selectedIds} onSortChange={onSortChange} searchTerm={searchTerm} emptyMessage={t("tax_no_taxes_found") || "No taxes found."} itemLabel="Taxes" itemLabelSingular={t("tax_item") || "tax"} />;
};

export default TaxList;
