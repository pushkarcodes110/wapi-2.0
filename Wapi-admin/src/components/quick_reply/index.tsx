"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import useDebounce from "@/src/utils/hooks/useDebounce";
import {
  useGetQuickRepliesQuery,
  useCreateQuickReplyMutation,
  useUpdateQuickReplyMutation,
  useDeleteQuickReplyMutation,
  useToggleFavoriteQuickReplyMutation,
} from "@/src/redux/api/quickReplyApi";
import QuickReplyHeader from "./QuickReplyHeader";
import QuickReplyList from "./QuickReplyList";
import QuickReplyModal from "./QuickReplyModal";
import ConfirmModal from "@/src/shared/ConfirmModal";

const QuickReplyContainer = () => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const searchTerm = useDebounce(inputValue, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading, refetch, isFetching } = useGetQuickRepliesQuery({
    search: searchTerm,
    page: page,
    limit: limit,
    sort: sortBy,
    order: sortOrder,
  });

  const [createQuickReply, { isLoading: isCreating }] = useCreateQuickReplyMutation();
  const [updateQuickReply, { isLoading: isUpdating }] = useUpdateQuickReplyMutation();
  const [deleteQuickReply, { isLoading: isDeleting }] = useDeleteQuickReplyMutation();
  const [toggleFavorite] = useToggleFavoriteQuickReplyMutation();

  const handleSearch = (value: string) => {
    setInputValue(value);
    setPage(1);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleAddClick = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (qr: any) => {
    setEditingData(qr);
    setIsModalOpen(true);
  };

  const handleSave = async (payload: any) => {
    try {
      if (editingData) {
        await updateQuickReply({ id: editingData._id, ...payload }).unwrap();
        toast.success(t("quick_reply_success_updated"));
      } else {
        await createQuickReply(payload).unwrap();
        toast.success(t("quick_reply_success_created"));
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t("common_error"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQuickReply([id]).unwrap();
      toast.success(t("quick_reply_success_deleted"));
    } catch (error: any) {
      toast.error(error?.data?.message || t("common_error"));
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await deleteQuickReply(ids).unwrap();
      toast.success(t("quick_reply_success_bulk_deleted", { count: ids.length }));
      setSelectedIds([]);
      setIsBulkDeleteModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t("common_error"));
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      await toggleFavorite(id).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || t("common_error"));
    }
  };

  return (
    <div className="space-y-6">
      <QuickReplyHeader
        onSearch={handleSearch}
        searchTerm={inputValue}
        onRefresh={handleRefresh}
        isLoading={isFetching}
        selectedCount={selectedIds.length}
        onBulkDelete={() => setIsBulkDeleteModalOpen(true)}
        onAddClick={handleAddClick}
      />

      <QuickReplyList
        quickReplies={data?.data || []}
        page={page}
        total={data?.count || 0}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
        onLimitChange={handleLimitChange}
        limit={limit}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onToggleFavorite={handleToggleFavorite}
        isLoading={isLoading || isDeleting || isUpdating || isCreating}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onSortChange={handleSortChange}
        searchTerm={searchTerm}
      />

      <QuickReplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editData={editingData}
        isLoading={isCreating || isUpdating}
      />

      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={() => handleBulkDelete(selectedIds)}
        isLoading={isDeleting}
        title={t("common_bulk_delete", { count: selectedIds.length })}
        subtitle={t("quick_reply_bulk_delete_warning", { count: selectedIds.length })}
        confirmText={t("common_delete")}
        cancelText={t("common_cancel")}
        variant="danger"
        loadingText={t("common_deleting")}
      />
    </div>
  );
};

export default QuickReplyContainer;
