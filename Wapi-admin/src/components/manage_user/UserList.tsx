/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { useStartImpersonationMutation } from "@/src/redux/api/impersonationApi";
import { useResetSubscriptionLimitsMutation } from "@/src/redux/api/subscriptionApi";
import DataTable from "@/src/shared/DataTable";
import { ColumnDef } from "@/src/types/shared";
import { User } from "@/src/types/store";
import { format } from "date-fns";
import { CreditCard, Edit2, UserCheck, User as UserIcon, Key, ShieldAlert, RotateCcw, MoreVertical, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { useSendResetPasswordLinkMutation } from "@/src/redux/api/userApi";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../constants";
import Can from "../shared/Can";
import AssignPlanModal from "./AssignPlanModal";
import OverrideLimitsModal from "./OverrideLimitsModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/elements/ui/dropdown-menu";

interface UserListProps {
  users: User[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  columnVisibility: { id: string; isVisible: boolean }[];
  searchTerm?: string;
}

const WAPI_FRONT_URL = process.env.NEXT_PUBLIC_WAPI_FRONT_URL || "http://localhost:3000";

const UserList = ({
  users,
  page,
  totalPages,
  total,
  limit,
  isLoading,
  onPageChange,
  onLimitChange,
  onDelete,
  onBulkDelete,
  selectedIds,
  onSelectionChange,
  onSortChange,
  columnVisibility,
  searchTerm,
}: UserListProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isResetConfirmModalOpen, setIsResetConfirmModalOpen] = useState(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [isResetLimitsConfirmOpen, setIsResetLimitsConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);
  const [startImpersonation] = useStartImpersonationMutation();
  const [sendResetLink, { isLoading: isSendingReset }] = useSendResetPasswordLinkMutation();
  const [resetLimits, { isLoading: isResettingLimits }] = useResetSubscriptionLimitsMutation();

  const openDeleteConfirmModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      onDelete(selectedUser._id);
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleOpenAssignModal = (user: User) => {
    setSelectedUser(user);
    setIsAssignModalOpen(true);
  };

  const handleImpersonate = async (user: User) => {
    try {
      setImpersonatingId(user._id);
      const result = await startImpersonation({
        targetUserId: user._id,
      }).unwrap();
      window.location.href = `${WAPI_FRONT_URL}/auth/impersonate?token=${result.token}`;
    } catch (err: any) {
      toast.error(err?.data?.message || t("common_error"));
      setImpersonatingId(null);
    }
  };

  const handleSendResetLink = async () => {
    if (!selectedUser) return;
    try {
      const result = await sendResetLink(selectedUser._id).unwrap();
      toast.success(result.message || t("common_success"));
      setIsResetConfirmModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || t("common_error"));
    }
  };

  const handleResetLimits = async () => {
    if (!selectedUser) return;
    try {
      const result = await resetLimits({ userId: selectedUser._id }).unwrap();
      toast.success(result.message || t("subscription_reset_limits_success"));
      setIsResetLimitsConfirmOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || t("common_error"));
    }
  };

  const openResetConfirmModal = (user: User) => {
    setSelectedUser(user);
    setIsResetConfirmModalOpen(true);
  };

  const openOverrideModal = (user: User) => {
    setSelectedUser(user);
    setIsOverrideModalOpen(true);
  };

  const openResetLimitsModal = (user: User) => {
    setSelectedUser(user);
    setIsResetLimitsConfirmOpen(true);
  };

  const allColumns: (ColumnDef<User> & { id: string })[] = [
    {
      id: "user",
      header: t("subscription_table_user"),
      className: "[@media(max-width:1620px)]:min-w-[160px]",
      copyable: true,
      copyField: "email",
      sortable: true,
      sortKey: "name",
      accessor: (user) => (
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => router.push(`${ROUTES.ManageUsersAdd}?id=${user._id}`)}
        >
          <div className="w-8 h-8 rounded-lg bg-(--light-primary) dark:bg-(--dark-body) flex items-center justify-center shrink-0">
            <UserIcon className="w-4 h-4 text-(--text-green-primary)" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
              {user.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "role",
      header: "Role",
      className: "[@media(max-width:1620px)]:min-w-[165px]",
      sortable: true,
      sortKey: "role_id",
      accessor: (user) => {
        const roleName =
          typeof user.role_id === "object"
            ? user.role_id?.name
            : user.role || "—";
        return (
          <Badge className="bg-blue-50 text-blue-600 border-none hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 capitalize">
            {roleName}
          </Badge>
        );
      },
    },
    {
      id: "phone",
      header: t("auth_phone"),
      className: "[@media(max-width:1620px)]:min-w-[220px]",
      copyable: true,
      copyField: "phone",
      sortable: true,
      sortKey: "phone",
      accessor: (user) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {user.phone || "—"}
        </span>
      ),
    },
    {
      id: "status",
      header: t("common_status"),
      className: "[@media(max-width:1620px)]:min-w-[125px]",
      sortable: true,
      sortKey: "status",
      accessor: (user) => (
        <Badge
          className={`border-none text-xs font-medium ${user.status
            ? "bg-(--light-primary) hover:bg-(--light-primary) text-primary dark:bg-emerald-900/20 dark:text-primary"
            : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}
        >
          {user.status ? t("common_active") : t("common_inactive")}
        </Badge>
      ),
    },
    {
      id: "plan",
      header: t("common_plan"),
      className: "[@media(max-width:1620px)]:min-w-[120px]",
      accessor: (user) =>
        user.current_plan ? (
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
              {user.current_plan.name}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">
              {user.current_plan.billing_cycle}
            </p>
          </div>
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {t("common_no_plan", { defaultValue: "No plan" })}
          </span>
        ),
    },
    {
      id: "joined",
      header: t("common_joined"),
      className: "[@media(max-width:1620px)]:min-w-[180px]",
      sortable: true,
      sortKey: "created_at",
      accessor: (user) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {user.created_at
            ? format(new Date(user.created_at), "MMMM d, yyyy")
            : "—"}
        </span>
      ),
    },
  ];

  const columns = allColumns.filter((col) => {
    const visibility = columnVisibility.find((cv) => cv.id === col.id);
    return visibility ? visibility.isVisible : true;
  });

  const renderActions = (user: User) => {
    const roleName = (typeof user.role_id === "object" ? user.role_id?.name : user.role) || "—";
    const isUserOrAgent = roleName.toLowerCase() === "user" || roleName.toLowerCase() === "agent";
    const isSuperAdmin = roleName.toLowerCase() === "super_admin";
    const isBeingImpersonated = impersonatingId === user._id;
    const hasActivePlan = !!user.current_plan;

    // Determine which actions are available and NOT disabled
    const canAssignPlan = !isLoading;
    const canOverrideLimits = !isLoading && hasActivePlan;
    const canResetLimits = !isLoading && hasActivePlan;
    const canImpersonate = !isLoading && !impersonatingId;
    const canSendReset = !isLoading && !isSendingReset;
    const canEdit = !isLoading;
    const canDeleteUser = !isLoading && !isSuperAdmin;

    return (
      <div className="flex items-center gap-1">
        {/* Primary Actions: Edit & Delete */}
        {canEdit && (
          <Can permission="update.users">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`${ROUTES.ManageUsersAdd}?id=${user._id}`)}
              className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs dark:bg-page-body"
              title={t("common_edit")}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </Can>
        )}

        {canDeleteUser && (
          <Can permission="delete.users">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openDeleteConfirmModal(user)}
              className="w-10 h-10 border-none text-red-600 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 dark:bg-page-body shadow-xs"
              title={t("common_delete")}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Can>
        )}

        {/* Other Actions: Dropdown Menu */}
        {isUserOrAgent && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 border-none text-gray-500 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all shadow-xs dark:bg-page-body"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {canAssignPlan && (
                <Can permission="create.subscriptions">
                  <DropdownMenuItem onClick={() => handleOpenAssignModal(user)}>
                    <CreditCard className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{t("common_assign_plan", { defaultValue: "Assign Plan" })}</span>
                  </DropdownMenuItem>
                </Can>
              )}
              {canOverrideLimits && (
                <Can permission="update.subscriptions">
                  <DropdownMenuItem onClick={() => openOverrideModal(user)}>
                    <ShieldAlert className="w-4 h-4 mr-2 text-amber-500" />
                    <span>{t("subscription_override_limits_title")}</span>
                  </DropdownMenuItem>
                </Can>
              )}
              {canResetLimits && (
                <Can permission="update.subscriptions">
                  <DropdownMenuItem onClick={() => openResetLimitsModal(user)}>
                    <RotateCcw className="w-4 h-4 mr-2 text-violet-500" />
                    <span>{t("subscription_reset_limits_title")}</span>
                  </DropdownMenuItem>
                </Can>
              )}
              {canImpersonate && (
                <DropdownMenuItem onClick={() => handleImpersonate(user)}>
                  <UserCheck className={`w-4 h-4 mr-2 text-amber-600 ${isBeingImpersonated ? "animate-pulse" : ""}`} />
                  <span>{t("common_impersonate", { defaultValue: "Start Impersonation" })}</span>
                </DropdownMenuItem>
              )}
              {canSendReset && (
                <Can permission="update.users">
                  <DropdownMenuItem onClick={() => openResetConfirmModal(user)}>
                    <Key className="w-4 h-4 mr-2 text-emerald-600" />
                    <span>{t("common_send_reset_link", { defaultValue: "Send Reset password link" })}</span>
                  </DropdownMenuItem>
                </Can>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  };

  return (
    <>
      <DataTable
        data={users}
        columns={columns}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        limit={limit}
        canDelete={(user: User) => {
          const role = typeof user.role_id === "object" ? user.role_id?.name : user.role;
          return role?.toLowerCase() !== "super_admin";
        }}
        deletePermission="delete.users"
        actionPermissions={["update.users"]}
        onBulkDelete={onBulkDelete}
        isLoading={isLoading}
        itemLabel={t("nav_all_users")}
        itemLabelSingular={t("nav_add_user")}
        renderActions={renderActions}
        onSelectionChange={onSelectionChange}
        selectedIds={selectedIds}
        onSortChange={onSortChange}
        searchTerm={searchTerm}
      />

      {/* Assign Plan Modal */}
      <AssignPlanModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} user={selectedUser} />

      {/* Override Limits Modal */}
      <OverrideLimitsModal isOpen={isOverrideModalOpen} onClose={() => setIsOverrideModalOpen(false)} user={selectedUser} />

      {/* Reset Limits Confirm Modal */}
      <ConfirmModal
        isOpen={isResetLimitsConfirmOpen}
        onClose={() => setIsResetLimitsConfirmOpen(false)}
        onConfirm={handleResetLimits}
        title={t("subscription_reset_limits_title")}
        subtitle={t("subscription_reset_limits_subtitle", { name: selectedUser?.name })}
        confirmText={t("common_reset")}
        isLoading={isResettingLimits}
        variant="danger"
      />

      {/* Send Reset Password Link Confirm Modal */}
      <ConfirmModal
        isOpen={isResetConfirmModalOpen}
        onClose={() => setIsResetConfirmModalOpen(false)}
        onConfirm={handleSendResetLink}
        title={t("common_send_reset_link", { defaultValue: "Send Reset Password Link" })}
        subtitle={t("common_reset_password_subtitle", { defaultValue: `Are you sure you want to send a reset password link to ${selectedUser?.email}?`, email: selectedUser?.email })}
        confirmText={t("common_send_link", { defaultValue: "Send Link" })}
        isLoading={isSendingReset}
        variant="success"
      />

      {/* Delete User Confirm Modal */}
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t("common_delete_user", { defaultValue: "Delete User" })}
        subtitle={t("common_delete_user_subtitle", { defaultValue: `Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`, name: selectedUser?.name })}
        confirmText={t("common_delete")}
        isLoading={isLoading}
        variant="danger"
      />
    </>
  );
};

export default UserList;
