"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { cn } from "@/src/lib/utils";
import { useFormik } from "formik";
import { RefreshCw } from "lucide-react";
import React, { useEffect } from "react";

import { useTranslation } from "react-i18next";
import * as Yup from "yup";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { priority: string; isArchived: boolean }) => void;
  item: {
    _id: string;
    title: string;
    priority?: string;
    isArchived?: boolean;
  } | null;
  isLoading?: boolean;
}

const priorities = [
  { value: "low", label: "Low", color: "emerald" },
  { value: "medium", label: "Medium", color: "amber" },
  { value: "high", label: "High", color: "red" },
];

const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose, onSave, item, isLoading }) => {
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      priority: item?.priority || "medium",
      isArchived: item?.isArchived || false,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      priority: Yup.string().required("Required"),
      isArchived: Yup.boolean(),
    }),
    onSubmit: (values) => {
      onSave(values);
    },
  });

  // Explicitly reset form when item changes or modal opens
  useEffect(() => {
    if (isOpen && item) {
      formik.resetForm({
        values: {
          priority: item.priority || "medium",
          isArchived: !!item.isArchived,
        },
      });
    }
  }, [item, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl p-0! overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex flex-col gap-2">
            {t("edit_item")}
            {item && <span className="text-xs font-normal text-slate-500 truncate max-w-50">{item.title}</span>}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="p-6 pt-2 space-y-8">
          <div className="space-y-4">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("priority")}</Label>
            <div className="grid grid-cols-3 gap-3">
              {priorities.map((p) => {
                const isSelected = formik.values.priority === p.value;
                return (
                  <button key={p.value} type="button" onClick={() => formik.setFieldValue("priority", p.value)} className={cn("flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2 group", isSelected ? (p.value === "low" ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20" : p.value === "medium" ? "border-amber-500 bg-amber-50/50 dark:bg-amber-900/20" : "border-red-500 bg-red-50/50 dark:bg-red-900/20") : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900")}>
                    <div className={cn("w-3 h-3 rounded-full", p.value === "low" ? "bg-emerald-500" : p.value === "medium" ? "bg-amber-500" : "bg-red-500")} />
                    <span className={cn("text-xs font-bold uppercase tracking-wider", isSelected ? (p.value === "low" ? "text-emerald-600 dark:text-emerald-400" : p.value === "medium" ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400") : "text-slate-500")}>{t(p.value)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold text-slate-900 dark:text-white">{t("archive_item")}</Label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t("archived_items_will_be_hidden_from_the_board")}</p>
            </div>
            <Switch checked={formik.values.isArchived} onCheckedChange={(checked) => formik.setFieldValue("isArchived", checked)} />
          </div>

          <DialogFooter className="pt-4 border-t border-slate-50 dark:border-slate-800/50">
            <div className="flex gap-3 w-full">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1 rounded-xl h-11 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1 rounded-xl h-11 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20">
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : t("save_changes")}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemModal;
