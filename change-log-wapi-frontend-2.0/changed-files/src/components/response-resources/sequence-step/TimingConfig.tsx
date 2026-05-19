"use client";

import { Input } from "@/src/elements/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { TimingConfigProps } from "@/src/types/replyMaterial";
import { DelayUnit } from "@/src/types/sequence";
import { Clock } from "lucide-react";
import React from "react";

const DELAY_UNITS: { label: string; value: DelayUnit }[] = [
  { label: "Minutes", value: "minutes" },
  { label: "Hours", value: "hours" },
  { label: "Days", value: "days" },
];

const TimingConfig: React.FC<TimingConfigProps> = ({ delayValue, onDelayValueChange, delayUnit, onDelayUnitChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5 flex flex-col">
        <label className="text-[12px] font-bold text-slate-400 flex items-center gap-1">
          <Clock size={12} /> Delay Value
        </label>
        <Input type="number" min={0} value={delayValue} onChange={(e) => onDelayValueChange(e.target.value === "" ? "" : (parseInt(e.target.value) || 0))} className="h-10 rounded-lg bg-slate-50 dark:bg-(--dark-body) border-slate-100 dark:border-slate-800" />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 px-1">Unit</label>
        <Select value={delayUnit} onValueChange={(v: DelayUnit) => onDelayUnitChange(v)}>
          <SelectTrigger className="h-10 rounded-lg bg-slate-50 dark:bg-(--dark-body) border-slate-100 dark:border-(--card-border-color)">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-(--card-color)">
            {DELAY_UNITS.map((u) => (
              <SelectItem className="dark:hover:bg-(--table-hover)" key={u.value} value={u.value}>
                {u.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TimingConfig;
