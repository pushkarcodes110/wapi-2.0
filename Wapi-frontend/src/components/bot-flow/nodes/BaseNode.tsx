/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/src/lib/utils";
import { BaseNodeProps } from "@/src/types/botFlow";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { X } from "lucide-react";
import React from "react";

export function BaseNode({ id, title, icon, iconBgColor = "bg-gray-100", iconColor = "text-gray-600", borderColor = "border-gray-200", handleColor = "bg-emerald-500!", errors = [], children, showInHandle = true, showOutHandle = true, headerRight, className }: BaseNodeProps) {
  const { deleteElements } = useReactFlow();

  return (
    <div className={cn("group relative w-72 rounded-lg border bg-white shadow-md transition-all hover:shadow-xl dark:bg-(--card-color) dark:border-(--card-border-color)", errors.length > 0 ? "border-red-400 ring-1 ring-red-400/20" : borderColor, className)}>
      {/* Target Handle */}
      {showInHandle && <Handle type="target" id="tgt" position={Position.Left} className={cn("w-3! h-3! border-2! border-white! dark:border-(--card-border-color)! shadow-sm z-50", handleColor)} />}

      {/* Node Header */}
      <div className={cn("flex items-center gap-2.5 px-4 py-3 border-b rounded-t-lg", iconBgColor)}>
        <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg shadow-sm bg-white/20 backdrop-blur-sm", iconColor)}>{React.cloneElement(icon as React.ReactElement<any>, { size: 16 })}</div>
        <div className="flex-1 min-w-0">
          <div className={cn("text-[13px] font-semibold truncate", iconColor)}>{title}</div>
        </div>
        <div className="flex items-center gap-2">
          {headerRight}
          <button onClick={() => deleteElements({ nodes: [{ id }] })} className="p-1 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Node Content */}
      <div className="p-4 space-y-4">{children}</div>

      {/* Source Handle */}
      {showOutHandle && <Handle type="source" id="src" position={Position.Right} className={cn("w-3! h-3! border-2! border-white! dark:border-dark-gray! shadow-sm z-50", handleColor)} />}
    </div>
  );
}
