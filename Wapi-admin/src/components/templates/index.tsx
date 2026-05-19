"use client";

import { SECTOR_LABELS, SectorKey } from "@/src/data/sectorTemplateCategory";
import { Badge } from "@/src/elements/ui/badge";
import {
  useBulkDeleteAdminTemplatesMutation,
  useDeleteAdminTemplateMutation,
  useGetAllAdminTemplatesQuery,
} from "@/src/redux/api/adminTemplateApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import DataTable from "@/src/shared/DataTable";
import { AdminTemplate } from "@/src/types/store";
import { Edit, Edit2, LayoutTemplate, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Can from "../shared/Can";

import { Button } from "@/src/elements/ui/button";
import TemplateFilterModal from "./TemplateFilterModal";
import { ROUTES } from "@/src/constants";
import { format } from "date-fns";

const CATEGORY_COLORS: Record<string, string> = {
  UTILITY: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  MARKETING:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
  AUTHENTICATION:
    "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
};

const AdminTemplateContainer = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<{
    sector?: string;
    template_category?: string;
    status?: string;
  }>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeletingSingle, setIsDeletingSingle] = useState(false);

  const [columnsVisibility, setColumnsVisibility] = useState([
    { id: "template_name", label: t("templates_library_table_template_name"), isVisible: true },
    { id: "message_body", label: t("templates_library_table_message_body"), isVisible: true },
    { id: "sector", label: t("templates_library_table_sector"), isVisible: true },
    { id: "template_category", label: t("templates_library_table_category"), isVisible: true },
    { id: "category", label: t("templates_library_table_wa_category"), isVisible: true },
    { id: "status", label: t("templates_library_table_status"), isVisible: true },
    { id: "created_at", label: t("templates_library_table_created"), isVisible: true },
  ]);

  const handleColumnToggle = (columnId: string) => {
    setColumnsVisibility((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, isVisible: !col.isVisible } : col
      )
    );
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const { data, isLoading, isFetching } = useGetAllAdminTemplatesQuery({
    page,
    limit,
    search: search || undefined,
    sector: filters.sector,
    template_category: filters.template_category,
    status: filters.status,
    sort_by: sortBy,
    sort_order: sortOrder.toUpperCase() as "ASC" | "DESC",
  });

  const [deleteTemplate] = useDeleteAdminTemplateMutation();
  const [bulkDelete, { isLoading: isBulkDeleting }] =
    useBulkDeleteAdminTemplatesMutation();

  const templates = data?.data?.templates ?? [];
  const pagination = data?.data?.pagination;

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeletingSingle(true);
    try {
      await deleteTemplate(deleteId).unwrap();
      toast.success(t("templates_library_delete_success"));
      setDeleteId(null);
    } catch {
      toast.error(t("templates_library_delete_error"));
    } finally {
      setIsDeletingSingle(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDelete(selectedIds).unwrap();
      toast.success(
        t("templates_library_bulk_delete_success", {
          count: selectedIds.length,
        }),
      );
      setSelectedIds([]);
      setShowBulkDeleteModal(false);
    } catch {
      toast.error(t("templates_library_bulk_delete_error"));
    }
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const allColumns = [
    {
      id: "template_name",
      header: t("templates_library_table_template_name"),
      className: "[@media(max-width:1920px)]:min-w-[390px]",
      sortable: true,
      sortKey: "template_name",
      copyable: true,
      copyField: "template_name",
      accessor: (template: AdminTemplate) => (
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() =>
            router.push(`${ROUTES.TemplatesLibrary}/${template._id}/edit`)
          }
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-primary shrink-0">
            <LayoutTemplate size={16} />
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm break-all">
              {template.template_name}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-gray-500 uppercase tracking-wider">
              {template.language}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "message_body",
      header: t("templates_library_table_message_body"),
      className: "[@media(max-width:1920px)]:min-w-[389px]",
      sortable: true,
      sortKey: "message_body",
      copyable: true,
      copyField: "message_body",
      accessor: (template: AdminTemplate) =>
        template.message_body ? (
          <span className="text-sm text-slate-600 break-all dark:text-gray-400 line-clamp-2">
            {template.message_body}
          </span>
        ) : (
          <span className="text-slate-300 dark:text-gray-600 text-xs">—</span>
        ),
    },
    {
      id: "sector",
      header: t("templates_library_table_sector"),
      className: "[@media(max-width:1920px)]:min-w-[170px]",
      sortable: true,
      sortKey: "sector",
      accessor: (template: AdminTemplate) =>
        template.sector ? (
          <span className="text-sm text-slate-600 dark:text-gray-400 capitalize">
            {t(`templates_library_sector_${template.sector}`, {
              defaultValue:
                SECTOR_LABELS[template.sector as SectorKey] || template.sector,
            })}
          </span>
        ) : (
          <span className="text-slate-300 dark:text-gray-600 text-xs">—</span>
        ),
    },
    {
      id: "template_category",
      header: t("templates_library_table_category"),
      className: "[@media(max-width:1920px)]:min-w-[205px]",
      sortable: true,
      sortKey: "template_category",
      accessor: (template: AdminTemplate) =>
        template.template_category ? (
          <span className="text-sm text-slate-600 dark:text-gray-400 capitalize">
            {t(`templates_library_category_${template.template_category}`, {
              defaultValue: template.template_category.replace(/_/g, " "),
            })}
          </span>
        ) : (
          <span className="text-slate-300 dark:text-gray-600 text-xs">—</span>
        ),
    },
    {
      id: "category",
      header: t("templates_library_table_wa_category"),
      className: "[@media(max-width:1920px)]:min-w-[170px]",
      sortable: true,
      sortKey: "category",
      accessor: (template: AdminTemplate) => (
        <Badge
          className={`text-[10px] font-bold uppercase tracking-wider rounded-md px-2 py-0.5 border-0 ${CATEGORY_COLORS[template.category] ?? ""}`}
        >
          {template.category}
        </Badge>
      ),
    },
    {
      id: "status",
      header: t("templates_library_table_status"),
      className: "[@media(max-width:1920px)]:min-w-[120px]",
      sortable: true,
      sortKey: "status",
      accessor: (template: AdminTemplate) => (
        <Badge
          variant={template.status === "approved" ? "default" : "secondary"}
          className="capitalize text-[10px] font-bold text-white"
        >
          {template.status || t("common_draft")}
        </Badge>
      ),
    },
    {
      id: "created_at",
      header: t("templates_library_table_created"),
      className: "[@media(max-width:1920px)]:min-w-[150px]",
      sortable: true,
      sortKey: "created_at",
      accessor: (template: AdminTemplate) => (
        <span className="text-xs text-slate-500 dark:text-gray-400">
          {template.created_at
            ? format(new Date(template.created_at), "MMMM dd, yyyy")
            : "—"}
        </span>
      ),
    },
  ];

  const columns = allColumns.filter((col) => {
    const visibility = columnsVisibility.find((v) => v.id === col.id);
    return visibility ? visibility.isVisible : true;
  });

  return (
    <div>
      <CommonHeader
        title={t("templates_library_title")}
        description={t("templates_library_description")}
        onSearch={(q) => {
          setSearch(q);
          setPage(1);
        }}
        searchTerm={search}
        searchPlaceholder={t("templates_library_search_placeholder")}
        onAddClick={() => router.push(`${ROUTES.TemplatesLibrary}/create`)}
        addLabel={t("templates_library_create_label")}
        addPermission="create.admin-template"
        isLoading={isLoading}
        selectedCount={selectedIds.length}
        onBulkDelete={
          selectedIds.length > 0
            ? () => setShowBulkDeleteModal(true)
            : undefined
        }
        bulkDeletePermission="delete.admin-template"
        bulkActionLoading={isBulkDeleting}
        onFilter={() => setIsFilterModalOpen(true)}
        columns={columnsVisibility}
        onColumnToggle={handleColumnToggle}
      />

      <DataTable<AdminTemplate>
        data={templates}
        columns={columns}
        page={pagination?.currentPage ?? page}
        totalPages={pagination?.totalPages ?? 1}
        total={pagination?.totalItems ?? 0}
        itemsPerPage={pagination?.itemsPerPage}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        isLoading={isLoading || isFetching}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        emptyMessage={t("templates_library_no_templates")}
        onSortChange={handleSortChange}
        searchTerm={search}
        isFilterActive={Object.values(filters).some((v) => !!v)}
        renderActions={(template) => (
          <div className="flex items-center gap-2">
            <Can permission="update.admin-template">
              <Button
                onClick={() =>
                  router.push(`${ROUTES.TemplatesLibrary}/${template._id}/edit`)
                }
                className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 bg-white rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs dark:bg-(--page-body-bg)"
                title={t("templates_library_edit_tooltip")}
              >
                <Edit2 size={16} />
              </Button>
            </Can>
            <Can permission="delete.admin-template">
              <Button
                onClick={() => setDeleteId(template._id)}
                className="w-10 h-10 border-none text-red-600 hover:text-red-600 bg-white hover:bg-red-50 rounded-lg transition-all shadow-xs dark:bg-(--page-body-bg) dark:hover:bg-red-900/20"
                title={t("templates_library_delete_tooltip")}
              >
                <Trash2 size={16} />
              </Button>
            </Can>
          </div>
        )}
        deletePermission="delete.admin-template"
        actionPermissions={["update.admin-template", "delete.admin-template"]}
      />

      <ConfirmModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={handleBulkDelete}
        isLoading={isBulkDeleting}
        title={t("templates_library_bulk_delete_title")}
        subtitle={t("templates_library_bulk_delete_subtitle", {
          count: selectedIds.length,
        })}
        confirmText={t("templates_library_delete_all_confirm")}
        cancelText={t("common_cancel")}
        variant="danger"
      />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeletingSingle}
        title={t("templates_library_delete_title")}
        subtitle={t("templates_library_delete_subtitle")}
        confirmText={t("templates_library_delete_confirm")}
        cancelText={t("common_cancel")}
        variant="danger"
      />

      <TemplateFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  );
};

export default AdminTemplateContainer;
