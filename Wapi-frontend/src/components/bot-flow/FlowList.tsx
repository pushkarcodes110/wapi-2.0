/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Can from "@/src/components/shared/Can";
import { ROUTES } from "@/src/constants/route";
import { Button } from "@/src/elements/ui/button";
import { Switch } from "@/src/elements/ui/switch";
import { useDeleteAutomationFlowMutation, useGetAutomationFlowsQuery, useToggleAutomationFlowMutation } from "@/src/redux/api/automationApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import useDebounce from "@/src/utils/hooks/useDebounce";
import { Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function FlowList() {
  const { t } = useTranslation();
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const searchTerm = useDebounce(inputValue, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const {
    data: flowsResult,
    isLoading,
    refetch,
    isFetching,
  } = useGetAutomationFlowsQuery({
    page,
    limit,
    search: searchTerm,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const [deleteFlow, { isLoading: isDeleting }] = useDeleteAutomationFlowMutation();
  const [toggleFlow] = useToggleAutomationFlowMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [localStatuses, setLocalStatuses] = useState<Record<string, boolean>>({});

  const flows = flowsResult?.data || [];
  const totalCount = flowsResult?.pagination?.totalItems || 0;

  const [visibleColumns, setVisibleColumns] = useState([
    { id: "Name", label: "Name", isVisible: true },
    { id: "Nodes", label: "Nodes", isVisible: true },
    { id: "Status", label: "Status", isVisible: true },
    { id: "Created At", label: "Created At", isVisible: true },
    { id: "Actions", label: "Actions", isVisible: true },
  ]);

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteFlow([deleteId]).unwrap();
        toast.success("Flow deleted successfully");
        setDeleteId(null);
      } catch {
        toast.error("Failed to delete flow");
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setBulkConfirmOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await deleteFlow(selectedIds).unwrap();
      toast.success(`${selectedIds.length} flows deleted successfully`);
      setSelectedIds([]);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.data?.message || "Failed to delete flows");
    } finally {
      setBulkConfirmOpen(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setLocalStatuses((prev) => ({ ...prev, [id]: !currentStatus }));
    try {
      await toggleFlow({ flowId: id, is_active: !currentStatus }).unwrap();
      toast.success(`Flow ${!currentStatus ? "activated" : "deactivated"}`);
    } catch {
      setLocalStatuses((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      toast.error("Failed to toggle status");
    }
  };

  const handleSearch = (value: string) => {
    setInputValue(value);
    setPage(1);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Successfully refresh table.");
  };

  const handleSort = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const onAddClick = () => {
    router.push(ROUTES.BuilderBotFlow);
  };

  const columns: Column<any>[] = [
    {
      header: "Name",
      sortable: true,
      sortKey: "name",
      cell: (flow) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{flow.name}</div>
          <div className="text-xs text-gray-500">{flow.description || "No description"}</div>
        </div>
      ),
    },
    {
      header: "Nodes",
      sortable: true,
      sortKey: "nodes",
      cell: (flow) => <div className="text-sm text-gray-600">{flow.nodes?.length || 0} nodes</div>,
    },
    {
      header: "Status",
      sortable: true,
      sortKey: "is_active",
      cell: (flow) => (
        <div className="flex items-center gap-2">
          <Can permission="update.automation_flows">
            <Switch checked={localStatuses[flow._id] ?? flow.is_active} onCheckedChange={() => handleToggle(flow._id, flow.is_active)} />
          </Can>
          {/* <span className={`text-xs font-medium ${flow.is_active ? "text-emerald-600" : "text-gray-400"}`}>{flow.is_active ? "Active" : "Inactive"}</span> */}
        </div>
      ),
    },
    {
      header: "Created At",
      sortable: true,
      sortKey: "created_at",
      cell: (flow) => <span className="text-sm text-gray-500">{new Date(flow.created_at).toLocaleDateString()}</span>,
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (flow) => (
        <div className="flex justify-end gap-2">
          <Can permission="update.automation_flows">
            <Link href={`${ROUTES.BuilderBotFlow}/${flow._id}`}>
              <Button variant="outline" size="sm" className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all">
                <Edit2 size={14} />
              </Button>
            </Link>
          </Can>
          <Can permission="delete.automation_flows">
            <Button variant="outline" size="sm" className="w-10 h-10 border-none text-red-600 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20" onClick={() => setDeleteId(flow._id)}>
              <Trash2 size={14} />
            </Button>
          </Can>
        </div>
      ),
    },
  ];

  return (
    <div className="sm:p-8 pt-0! p-4 space-y-8 bg-(--page-body-bg) dark:bg-(--dark-body)">
      <CommonHeader title={t("flow_builder_page_title")} description={t("flow_builder_page_description")} onSearch={handleSearch} searchTerm={inputValue} searchPlaceholder="Search flows..." featureKey="template_bots_used" onRefresh={handleRefresh} onAddClick={onAddClick} addLabel="Add New Flow" addPermission="create.automation_flows" deletePermission="delete.automation_flows" isLoading={isLoading} columns={visibleColumns} onColumnToggle={handleColumnToggle} onBulkDelete={handleBulkDelete} selectedCount={selectedIds.length} />

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden mt-8 dark:bg-(--card-color) dark:border-(--card-border-color)">
        <DataTable data={flows} columns={columns.filter((col) => visibleColumns.find((vc) => vc.id === col.header)?.isVisible !== false)} isLoading={isLoading} isFetching={isFetching || isDeleting} totalCount={totalCount} page={page} limit={limit} onPageChange={handlePageChange} onLimitChange={handleLimitChange} enableSelection={true} selectedIds={selectedIds} onSelectionChange={setSelectedIds} getRowId={(item) => item._id} emptyMessage={searchTerm ? `No flows found matching "${searchTerm}"` : "No automation flows found. Create your first one!"} className="border-none shadow-none rounded-none" onSortChange={handleSort} sortBy={sortBy} sortOrder={sortOrder} />
      </div>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={isDeleting} title="Delete Automation Flow" subtitle="Are you sure you want to delete this automation flow? This action cannot be undone and all associated data will be permanently removed." confirmText="Delete Flow" variant="danger" />
      <ConfirmModal isOpen={bulkConfirmOpen} onClose={() => setBulkConfirmOpen(false)} onConfirm={confirmBulkDelete} isLoading={isDeleting} title="Bulk Delete Flows" subtitle={`Are you sure you want to delete ${selectedIds.length} selected flows? This action cannot be undone.`} confirmText="Delete All" variant="danger" />
    </div>
  );
}
