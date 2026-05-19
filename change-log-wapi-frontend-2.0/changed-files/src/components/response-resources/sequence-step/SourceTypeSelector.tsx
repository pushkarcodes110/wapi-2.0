"use client";

import { cn } from "@/src/lib/utils";
import { useAppSelector } from "@/src/redux/hooks";
import { SourceTypeSelectorProps } from "@/src/types/replyMaterial";
import { ReplyMaterialSourceType } from "@/src/types/sequence";
import { ExternalLink, Plus } from "lucide-react";
import React from "react";
import { ROUTES } from "@/src/constants";

const SOURCE_TYPES: { label: string; value: ReplyMaterialSourceType }[] = [
  { label: "Reply Material", value: "ReplyMaterial" },
  { label: "Template", value: "Template" },
  { label: "Catalog", value: "EcommerceCatalog" },
];

const SourceTypeSelector: React.FC<SourceTypeSelectorProps> = ({ value, onChange }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const isBaileys = selectedWorkspace?.waba_type === "baileys";

  const filteredSourceTypes = SOURCE_TYPES.filter((src) => {
    if (isBaileys && (src.value === "Template" || src.value === "EcommerceCatalog")) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 flex flex-col mb-3!">
      <div className="flex items-center justify-between">
        <label className="text-sm font-black  text-slate-400 dark:text-gray-400">1. Select Source</label>
        <button type="button" onClick={() => window.open(ROUTES.ReplyMaterials, "_blank")} className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">
          <Plus size={12} strokeWidth={3} />
          Add Response Resources
          <ExternalLink size={10} className="ml-0.5 opacity-50" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1 bg-slate-50 dark:bg-(--dark-body) rounded-xl">
        {filteredSourceTypes.map((src) => (
          <button key={src.value} type="button" onClick={() => onChange(src.value)} className={cn("h-10 rounded-lg text-xs font-bold transition-all", value === src.value ? "bg-white dark:bg-(--card-color) text-primary shadow-sm ring-1 ring-primary/10" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200")}>
            {src.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SourceTypeSelector;
