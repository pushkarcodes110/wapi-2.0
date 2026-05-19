/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Order, OrderItem, useBulkDeleteOrdersMutation, useGetOrdersQuery } from "@/src/redux/api/orderApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import { format } from "date-fns";
import { Eye, MessageSquareCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import OrderItemsModal from "./OrderItemsModal";
import { maskSensitiveData } from "@/src/utils/masking";
import { useAppSelector } from "@/src/redux/hooks";
import Can from "@/src/components/shared/Can";
import { ROUTES } from "@/src/constants";

const OrderPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { is_demo_mode } = useAppSelector((state) => state.setting);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);

  const { data, isLoading, isFetching, refetch } = useGetOrdersQuery({ page, limit, search, sort_by: sortBy, sort_order: sortOrder });
  const [bulkDelete, { isLoading: isDeleting }] = useBulkDeleteOrdersMutation();

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleDelete = async () => {
    try {
      const res = await bulkDelete({ ids: selectedIds }).unwrap();
      if (res.success) {
        toast.success(res.message || t("orders_deleted_success"));
        setSelectedIds([]);
        setIsDeleteModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || t("orders_delete_failed"));
    }
  };

  const handleViewItems = (order: Order) => {
    setSelectedOrderItems(order.items);
    setSelectedOrderId(order.wa_order_id || order._id);
    setIsItemsModalOpen(true);
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "shipped":
        return "success";
      case "pending":
        return "warning";
      case "ready_to_ship":
      case "on_the_way":
        return "info";
      default:
        return "secondary";
    }
  };

  const columns: Column<Order>[] = [
    {
      header: t("order_id_label"),
      sortable: true,
      sortKey: "wa_order_id",
      accessorKey: "wa_order_id",
      copyable: true,
      cell: (row) => row.wa_order_id || "N/A",
    },
    {
      header: t("customer_label"),
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700 dark:text-slate-200">{maskSensitiveData(row.contact_id?.name, "phone", is_demo_mode)}</span>
          <span className="text-xs text-slate-400">{maskSensitiveData(row.contact_id?.email, "email", is_demo_mode) || t("no_email")}</span>
        </div>
      ),
    },
    {
      header: t("contact_label"),
      sortable: true,
      sortKey: "phone_number",
      cell: (row) => maskSensitiveData(row.contact_id?.phone_number, "phone", is_demo_mode),
    },
    {
      header: t("amount_label"),
      sortable: true,
      sortKey: "total_price",
      cell: (row) => (
        <span className="font-black text-primary">
          {row?.total_price?.toFixed(2)} {row.currency || "INR"}
        </span>
      ),
    },
    {
      header: t("status"),
      sortable: true,
      sortKey: "status",
      cell: (row) => (
        <Badge variant={getStatusVariant(row?.status)} className="capitalize font-black px-3 py-1">
          {row?.status?.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      header: t("date_label"),
      sortable: true,
      sortKey: "created_at",
      cell: (row) => <span className="text-xs font-medium text-slate-500">{row?.created_at ? format(new Date(row.created_at), "MMMM dd, yyyy HH:mm") : "—"}</span>,
    },
    {
      header: t("items_label"),
      cell: (row) => (
        <Can permission="view.ecommerce_orders">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewItems(row);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/8 dark:bg-primary/15 hover:bg-primary/15 dark:hover:bg-primary/25 text-primary transition-all group"
            title={t("view_items_title", { count: row.items?.length || 0 })}
          >
            <Eye size={14} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">{row.items?.length || 0}</span>
          </button>
        </Can>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-8 bg-(--page-body-bg) dark:bg-(--dark-body) pt-0!">
      <CommonHeader
        title={t("orders_page_title")}
        description={t("orders_page_description")}
        onSearch={handleSearch}
        searchTerm={search}
        onRefresh={refetch}
        selectedCount={selectedIds.length}
        onBulkDelete={() => setIsDeleteModalOpen(true)}
        deletePermission="delete.ecommerce_orders"
        isLoading={isLoading || isFetching}
        rightContent={
          <Can permission="update.ecommerce_orders">
            <Button onClick={() => router.push(ROUTES.OrdersAutoMessage)} className="flex items-center gap-2 px-6 bg-primary text-white h-12 rounded-lg font-bold transition-all active:scale-95">
              <MessageSquareCode size={20} />
              {t("auto_message")}
            </Button>
          </Can>
        }
      />

      <DataTable data={data?.data?.orders || []} columns={columns as any} isLoading={isLoading} isFetching={isFetching} totalCount={data?.data?.pagination?.totalItems} page={page} limit={limit} onPageChange={setPage} onLimitChange={setLimit} enableSelection={true} selectedIds={selectedIds} onSelectionChange={setSelectedIds} getRowId={(row: Order) => row._id} emptyMessage={t("no_orders_found")} onSortChange={handleSortChange} />

      <OrderItemsModal isOpen={isItemsModalOpen} onClose={() => setIsItemsModalOpen(false)} items={selectedOrderItems} orderId={selectedOrderId} />

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title={t("delete_orders_title")} subtitle={t("delete_orders_desc", { count: selectedIds.length })} confirmText={t("delete")} isLoading={isDeleting} variant="danger" />
    </div>
  );
};

export default OrderPage;
