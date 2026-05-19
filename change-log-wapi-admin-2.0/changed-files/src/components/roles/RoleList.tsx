"use client";

import { Button } from "@/src/elements/ui/button";
import { Switch } from "@/src/elements/ui/switch";
import { usePermissions } from "@/src/hooks/usePermissions";
import DataTable from "@/src/shared/DataTable";
import { Role } from "@/src/types/store";
import { Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Can from "../shared/Can";
import { ROUTES } from "@/src/constants";

interface RoleListProps {
  roles: Role[];
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onToggleStatus: (id: string) => void;
  isLoading: boolean;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  onSelectionChange: (ids: string[]) => void;
  selectedIds: string[];
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  visibleColumns?: string[];
  searchTerm?: string;
}

const RoleList = ({ roles, onDelete, onBulkDelete, onToggleStatus, isLoading, total, page, totalPages, onPageChange, limit, onLimitChange, onSelectionChange, selectedIds, onSortChange, visibleColumns, searchTerm }: RoleListProps) => {
  const router = useRouter();
  const { hasPermission } = usePermissions();

  const allColumns = [
    {
      id: "name",
      header: "Role Name",
      className: "[@media(max-width:810px)]:min-w-[165px] font-bold text-gray-900 dark:text-gray-100",
      accessorKey: "name" as keyof Role,
      sortable: true,
    },
    {
      id: "description",
      header: "Description",
      className: "[@media(max-width:810px)]:min-w-[215px]",
      accessorKey: "description" as keyof Role,
      sortable: false,
      cell: (row: Role) => <span className="text-slate-500 dark:text-gray-400 text-sm">{row.description || "No description provided"}</span>,
    },
    {
      id: "system_reserved",
      className: "[@media(max-width:810px)]:min-w-[150px]",
      header: "Type",
      cell: (row: Role) => (row.system_reserved ? <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">System</span> : <span className="text-[10px] uppercase font-medium tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-page-body dark:text-slate-400 border border-slate-200 dark:border-(--card-border-color)">Custom</span>),
    },
    {
      id: "status",
      header: "Status",
      cell: (row: Role) => <Switch checked={row.status === "active"} onCheckedChange={() => !row.system_reserved && onToggleStatus(row._id)} disabled={row.system_reserved || isLoading || !hasPermission("update.roles")} className="data-[state=checked]:bg-(--text-green-primary)" />,
    },
  ];

  const columns = visibleColumns ? allColumns.filter((col) => visibleColumns.includes(col.id)) : allColumns;

  const renderActions = (row: Role) => (
    <div className="flex items-center gap-2">
      <Can permission="update.roles">
        <Button variant="ghost" size="icon" onClick={() => router.push(`${ROUTES.Roles}/edit/${row._id}`)} className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs dark:bg-(--page-body-bg)" title="Edit Role">
          <Edit2 size={16} />
        </Button>
      </Can>
    </div>
  );

  return <DataTable data={roles} columns={columns} page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} onLimitChange={onLimitChange} limit={limit} onDelete={(item: Role) => onDelete(item._id)} canDelete={(row: Role) => !row.system_reserved} deletePermission="delete.roles" actionPermissions={["update.roles"]} onBulkDelete={onBulkDelete} isLoading={isLoading} itemLabel="Roles" itemLabelSingular="Role" renderActions={renderActions} onSelectionChange={onSelectionChange} selectedIds={selectedIds} onSortChange={onSortChange} searchTerm={searchTerm} />;
};

export default RoleList;
