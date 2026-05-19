/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { useGetAllPermissionsQuery } from "@/src/redux/api/roleApi";
import { CreateRoleRequest, Role } from "@/src/types/store";
import { ArrowLeft, Check, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PermissionPicker from "./PermissionPicker";
import { Badge } from "@/src/elements/ui/badge";
import { ROUTES } from "@/src/constants";

interface RoleFormProps {
  initialValues?: Role & { permissions: string[] };
  onSubmit: (values: CreateRoleRequest) => Promise<void>;
  isLoading: boolean;
  mode: "create" | "edit";
}

const RoleForm = ({ initialValues, onSubmit, isLoading, mode }: RoleFormProps) => {
  const router = useRouter();
  const { data: permissionsData, isLoading: isLoadingPermissions } = useGetAllPermissionsQuery();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(initialValues.name || "");
      setDescription(initialValues.description || "");
      setIsActive(initialValues.status === "active");
      setSelectedPermissions(initialValues.permissions || []);
    }
  }, [initialValues]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Role name is required";
    if (selectedPermissions.length === 0) errs.permissions = "Assign at least one permission";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please provide a name and at least one permission.");
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        status: isActive ? "active" : "inactive",
        permissions: selectedPermissions,
      });
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(err?.data?.message || "Failed to save role");
    }
  };

  return (
    <div className="w-full pb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="sticky top-[100px] z-[50] -mx-4 pt-0! sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-light-body-bg dark:bg-(--dark-body) shadow-[0_-55px_0px_0px_var(--light-body-bg)] dark:shadow-[0_-55px_0px_0px_var(--dark-body)] py-4 mb-5 sm:mb-2 flex flex-col sm:flex-row sm:items-center gap-4 transition-all">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(ROUTES.Roles)}
          className="w-10 h-10 rounded-lg bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) shadow-sm hover:scale-105 transition-all"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            {mode === "create" ? "Create New Role" : "Edit Role Settings"}
          </h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            {mode === "create"
              ? "Define administrative access levels"
              : "Update role properties and access control"}
          </p>
        </div>
      </div>

      <form id="role-form" onSubmit={handleSubmit}>
        {/* Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Sidebar — 4 columns: General Information */}
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-lg sm:p-6 p-4 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-(--card-border-color) pb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-medium text-slate-800 dark:text-white">General Information</h2>
              </div>

              <div className="space-y-6 pt-2">
                {/* Role Name */}
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="role-name" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Role Display Name <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="role-name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((p) => ({ ...p, name: "" }));
                    }}
                    className="h-12 bg-(--input-color) dark:bg-page-body border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary transition-all rounded-lg"
                    placeholder="e.g. System Administrator"
                    disabled={initialValues?.system_reserved}
                  />
                  {errors.name && <p className="text-red-500 text-xs font-bold mt-1 px-1">{errors.name}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="role-description" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Description
                  </Label>
                  <Input
                    id="role-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-12 bg-(--input-color) dark:bg-page-body border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary transition-all rounded-lg"
                    placeholder="Briefly explain what this role can do..."
                  />
                </div>

                {/* Active Status */}
                <div
                  className="flex items-center justify-between p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/10 cursor-pointer group hover:bg-primary/10 transition-all"
                  onClick={() => !initialValues?.system_reserved && setIsActive(!isActive)}
                >
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">Active Status</p>
                    <p className="text-xs text-slate-400">Determines if this role is currently available for assignment</p>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={setIsActive}
                    disabled={initialValues?.system_reserved}
                    onClick={(e) => e.stopPropagation()}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content — 8 columns: Access Permissions */}
          <div className="xl:col-span-8">
            <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-lg sm:p-6 p-4">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-(--card-border-color) pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Check className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-medium text-slate-800 dark:text-white">Access Permissions</h2>
                </div>
                {errors.permissions && (
                  <Badge variant="destructive" className="animate-bounce bg-red-500/20 text-red-500">
                    {errors.permissions}
                  </Badge>
                )}
              </div>

              {isLoadingPermissions ? (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-slate-400 font-medium">Loading permissions..</p>
                </div>
              ) : (
                <PermissionPicker
                  permissions={permissionsData?.data || []}
                  selectedSlugs={selectedPermissions}
                  onChange={(slugs) => {
                    setSelectedPermissions(slugs);
                    setErrors((p) => ({ ...p, permissions: "" }));
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end flex-wrap gap-3 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(ROUTES.Roles)}
            className="px-6 py-5 h-11 bg-white dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) dark:text-gray-200 shadow-sm dark:hover:bg-(--dark-sidebar) hover:bg-slate-50 font-bold rounded-lg transition-all"
            disabled={isLoading}
          >
            Go Back
          </Button>
          <Button
            type="submit"
            className="px-6 py-5 h-11 bg-primary hover:bg-primary/90 text-white font-black rounded-lg transition-all active:scale-95 disabled:opacity-50 gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Check className="w-5 h-5" />
            )}
            {isLoading ? "Working..." : mode === "create" ? "Create Role Now" : "Edit Role"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RoleForm;
