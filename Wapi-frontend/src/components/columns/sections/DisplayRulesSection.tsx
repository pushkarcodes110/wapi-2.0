/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { LayoutTemplate, AlignLeft, Asterisk, Eye } from "lucide-react";

interface DisplayRulesSectionProps {
  formik: any;
  isLoading?: boolean;
}

const DisplayRulesSection: React.FC<DisplayRulesSectionProps> = ({
  formik,
  isLoading,
}) => {
  return (
    <div className="bg-white dark:bg-(--page-body-bg) p-4 rounded-lg border border-(--input-border-color) dark:border-(--card-border-color) shadow-sm space-y-4 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-md">
          <LayoutTemplate size={16} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
          Display Rules
        </h3>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
          <AlignLeft size={14} className="text-gray-400" />
          Input Hint (Placeholder)
        </Label>
        <Input
          name="placeholder"
          placeholder="e.g., +1 234 567 8900"
          value={formik.values.placeholder}
          onChange={formik.handleChange}
          className="h-10 focus:border-none focus-visible:ring-1 focus-visible:ring-primary border-(--input-border-color) bg-(--input-color) dark:bg-(--card-color) dark:border-(--card-border-color) transition-all hover:border-gray-400 dark:hover:border-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        <div className="group p-3 border border-(--input-border-color) rounded-lg flex items-center justify-between dark:border-(--card-border-color) bg-gray-50/50 dark:bg-black/20 hover:border-red-200 dark:hover:border-red-900/50 transition-colors">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold flex items-center gap-1.5 text-gray-800 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
              <Asterisk size={14} className="text-red-500" />
              Mandatory
            </p>
            <p className="text-[11px] text-gray-500">Require user input</p>
          </div>
          <Switch
            checked={formik.values.is_required}
            onCheckedChange={(val) => formik.setFieldValue("is_required", val)}
            disabled={isLoading}
            className="data-[state=checked]:bg-red-500"
          />
        </div>

        <div className="group p-3 border border-(--input-border-color) rounded-xl flex items-center justify-between dark:border-(--card-border-color) bg-gray-50/50 dark:bg-black/20 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-colors">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold flex items-center gap-1.5 text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <Eye size={14} className="text-primary" />
              Visible
            </p>
            <p className="text-[11px] text-gray-500">Show on frontend</p>
          </div>
          <Switch
            checked={formik.values.is_active}
            onCheckedChange={(val) => formik.setFieldValue("is_active", val)}
            disabled={isLoading}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default DisplayRulesSection;
