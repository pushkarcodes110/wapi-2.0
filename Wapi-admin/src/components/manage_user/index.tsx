"use client";

import { useDeleteUsersMutation, useGetAllUsersQuery } from "@/src/redux/api/userApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { GetUsersParams } from "@/src/types/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ROUTES } from "../../constants";
import UserList from "./UserList";

const UserListContainer = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [columns, setColumns] = useState([
    { id: "user", label: t("subscription_table_user"), isVisible: true },
    { id: "role", label: t("nav_roles_permission"), isVisible: true },
    { id: "phone", label: t("auth_phone") || "Phone", isVisible: true },
    { id: "status", label: t("common_status"), isVisible: true },
    { id: "plan", label: t("common_plan") || "Plan", isVisible: true },
    { id: "joined", label: t("common_joined") || "Joined", isVisible: true },
  ]);

  const handleColumnToggle = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, isVisible: !col.isVisible } : col,
      ),
    );
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const queryParams: GetUsersParams = {
    page,
    limit,
    search: search || undefined,
    role: "all",
    sort_by: sortBy,
    sort_order: sortOrder.toUpperCase() as "ASC" | "DESC",
  };

  const { data, isLoading, refetch } = useGetAllUsersQuery(queryParams);
  const [deleteUsers, { isLoading: isDeleting }] = useDeleteUsersMutation();

  const users = data?.data?.users ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.totalItems ?? 0;

  const handleDelete = async (id: string) => {
    try {
      await deleteUsers({ ids: [id] }).unwrap();
      toast.success(t("manage_users_delete_success"));
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    } catch {
      toast.error(t("manage_users_delete_error"));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteUsers({ ids: selectedIds }).unwrap();
      toast.success(t("manage_users_bulk_delete_success", { count: selectedIds.length }));
      setSelectedIds([]);
      setShowBulkDeleteModal(false);
    } catch {
      toast.error(t("manage_users_bulk_delete_error"));
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.info(t("manage_users_refreshed"));
  };

  return (
    <div className="flex flex-col min-h-full">
      <CommonHeader
        title={t("manage_users_title")}
        description={t("manage_users_description")}
        searchTerm={search}
        onSearch={setSearch}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        onAddClick={() => router.push(ROUTES.ManageUsersAdd)}
        addLabel={t("manage_users_add_user_label")}
        addPermission="create.users"
        bulkDeletePermission="delete.users"
        selectedCount={selectedIds.length}
        onBulkDelete={() => setShowBulkDeleteModal(true)}
        bulkActionLoading={isDeleting}
        columns={columns}
        onColumnToggle={handleColumnToggle}
      />

      <UserList
        users={users}
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        isLoading={isLoading || isDeleting}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        onDelete={handleDelete}
        onBulkDelete={() => setShowBulkDeleteModal(true)}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onSortChange={handleSortChange}
        columnVisibility={columns}
        searchTerm={search}
      />

      <ConfirmModal isOpen={showBulkDeleteModal} onClose={() => setShowBulkDeleteModal(false)} onConfirm={handleBulkDelete} isLoading={isDeleting} title={t("manage_users_confirm_delete_title")} subtitle={t("manage_users_confirm_delete_subtitle", { count: selectedIds.length })} confirmText={t("manage_users_confirm_delete_btn")} cancelText={t("common_cancel")} variant="danger" />
    </div>
  );
};

export default UserListContainer;
