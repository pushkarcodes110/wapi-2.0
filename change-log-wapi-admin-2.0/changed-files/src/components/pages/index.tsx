/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { useDeletePagesMutation, useGetPagesQuery, useTogglePageStatusMutation } from "@/src/redux/api/pageApi";
import PageList from "./PageList";
import CommonHeader from "@/src/shared/CommonHeader";
import FilterModal from "./FilterModal";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { toast } from "sonner";
import useDebounce from "@/src/utils/hooks/useDebounce";
import { useTranslation } from "react-i18next";
import { Page } from "@/src/types/store";
import { useRouter } from "next/navigation";
import { ROUTES } from "../../constants";

const PagesContainer = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const searchTerm = useDebounce(inputValue, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [filters, setFilters] = useState<{ status?: string }>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    title: true,
    status: true,
    created_at: true,
  });

  const columns = useMemo(
    () => [
      { id: "title", label: t("pages_title_header", "Title"), isVisible: visibleColumns.title },
      { id: "status", label: t("common_status", "Status"), isVisible: visibleColumns.status },
      { id: "created_at", label: t("common_created_at", "Created At"), isVisible: visibleColumns.created_at },
    ],
    [t, visibleColumns]
  );

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const { data, isLoading, isFetching } = useGetPagesQuery({
    search: searchTerm,
    page: page,
    limit: limit,
    status: filters.status,
    sort_by: sortBy,
    sort_order: sortOrder.toUpperCase() as "ASC" | "DESC",
  });

  const [toggleStatus, { isLoading: isToggling }] = useTogglePageStatusMutation();
  const [deletePages, { isLoading: isDeleting }] = useDeletePagesMutation();

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success(t("pages_success_status_updated", "Status updated successfully"));
    } catch (error: any) {
      toast.error(error?.data?.message || t("pages_error_status_update", "Failed to update status"));
    }
  };

  const handleDelete = async (pageObj: Page) => {
    try {
      await deletePages([pageObj._id]).unwrap();
      toast.success(t("pages_success_deleted", "Page deleted successfully"));
    } catch (error: any) {
      toast.error(error?.data?.message || t("pages_error_delete", "Failed to delete page"));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await deletePages(selectedIds).unwrap();
      toast.success(t("pages_success_bulk_deleted", { count: selectedIds.length }));
      setSelectedIds([]);
      setIsBulkDeleteModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t("pages_error_delete", "Failed to delete pages"));
    }
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setInputValue(value);
    setPage(1);
  };

  const handleApplyFilters = (newFilters: { status?: string }) => {
    setFilters(newFilters);
    setPage(1);
  };

  const pages = data?.data?.pages || [];
  const pagination = data?.data?.pagination;
  const isFilterActive = Object.values(filters).some((v) => !!v);

  return (
    <div className="space-y-6">
      <CommonHeader title={t("nav_pages")} description={t("pages_subtitle", "Manage your website pages, content, and SEO.")} onSearch={handleSearch} searchTerm={inputValue} onFilter={() => setIsFilterModalOpen(true)} isLoading={isFetching} columns={columns} onColumnToggle={handleColumnToggle} selectedCount={selectedIds.length} onBulkDelete={() => setIsBulkDeleteModalOpen(true)} onAddClick={() => router.push(ROUTES.ManagePagesAdd)} addLabel={t("pages_add_new", "Add New Page")} addPermission="create.pages" bulkDeletePermission="delete.pages" bulkActionLoading={isDeleting} />

      <PageList
        pages={pages}
        isLoading={isLoading || isFetching || isDeleting || isToggling}
        onDelete={handleDelete}
        onBulkDelete={(ids) => {
          setSelectedIds(ids);
          setIsBulkDeleteModalOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
        total={pagination?.totalItems || 0}
        page={pagination?.currentPage || page}
        totalPages={pagination?.totalPages || 1}
        onPageChange={setPage}
        limit={limit}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        onSelectionChange={setSelectedIds}
        selectedIds={selectedIds}
        onSortChange={handleSortChange}
        visibleColumns={visibleColumns}
        searchTerm={searchTerm}
        isFilterActive={isFilterActive}
      />

      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApply={handleApplyFilters} currentFilters={filters} />

      <ConfirmModal isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} onConfirm={handleBulkDelete} isLoading={isDeleting} title={t("common_are_you_sure", "Are you sure?")} subtitle={t("pages_delete_multiple_modal_subtitle", { count: selectedIds.length })} confirmText={t("common_delete", "Delete")} cancelText={t("common_cancel", "Cancel")} variant="danger" loadingText={t("common_deleting", "Deleting...")} />
    </div>
  );
};

export default PagesContainer;
