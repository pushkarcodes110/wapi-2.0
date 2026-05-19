/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { CheckSquare, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

export function ButtonMessageNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const updateNodeData = (field: string, value: any) => {
    if (!touched) setTouched(true);
    setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node)));
  };

  useEffect(() => {
    if (data.buttons && Array.isArray(data.buttons)) {
      const needsUpdate = data.buttons.some((btn: any, i: number) => btn.value !== `btn_${i + 1}`);
      if (needsUpdate) {
        const updatedButtons = data.buttons.map((btn: any, i: number) => ({
          ...btn,
          value: `btn_${i + 1}`,
        }));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        updateNodeData("buttons", updatedButtons);
      }
    }
  }, [data.buttons?.length]);

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.message || !data.message.trim()) errors.push("Message text is required");
    if (!data.buttons || data.buttons.length === 0) errors.push("At least one button is required");
    data.buttons?.forEach((btn: any, i: number) => {
      if (!btn.text) errors.push(`Button ${i + 1} text is required`);
    });
  }

  const addButton = () => {
    if (!touched) setTouched(true);
    const buttons = data.buttons || [];
    if (buttons.length < 3) {
      const newButtonIndex = buttons.length + 1;
      updateNodeData("buttons", [...buttons, { text: "", value: `btn_${newButtonIndex}` }]);
    }
  };

  const removeButton = (index: number) => {
    const buttons = data.buttons || [];
    const filteredButtons = buttons.filter((_: any, i: number) => i !== index);
    const updatedButtons = filteredButtons.map((btn: any, i: number) => ({
      ...btn,
      value: `btn_${i + 1}`,
    }));
    updateNodeData("buttons", updatedButtons);
  };

  const updateButton = (index: number, field: string, value: string) => {
    if (!touched) setTouched(true);
    if (field === "value") return;

    const buttons = data.buttons || [];
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    updateNodeData("buttons", newButtons);
  };

  return (
    <BaseNode id={id} title="Quick Reply" icon={<CheckSquare size={18} />} iconBgColor="bg-emerald-600" iconColor="text-white" borderColor="border-emerald-200" handleColor="bg-emerald-500!" errors={errors} showOutHandle={false}>
      <NodeField label="Message Text" required error={(touched || data.forceValidation) && !data.message?.trim() ? "Message text is required" : ""}>
        <Textarea placeholder="Enter the main message text..." value={data.message || ""} onFocus={() => setTouched(true)} onChange={(e) => updateNodeData("message", e.target.value)} className="min-h-20 resize-none text-sm bg-gray-50 border-gray-200 focus:bg-white dark:bg-(--page-body-bg) dark:border-(--card-border-color) dark:focus:bg-(--page-body-bg)" />
        <div className="mt-1 text-right text-[10px] text-gray-400">{data.message?.length || 0}/1024</div>
      </NodeField>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Choice Buttons</Label>
          <span className="text-[10px] font-medium text-gray-400">{data.buttons?.length || 0} / 3</span>
        </div>

        {(data.buttons || []).map((btn: any, index: number) => (
          <div key={index} className="relative group rounded-lg border border-gray-100 bg-gray-50/50 p-3 pt-6 dark:bg-(--card-color) dark:border-(--card-border-color)">
            <Handle type="source" id={`src-btn-${index}`} position={Position.Right} style={{ top: "50%" }} className="w-3! h-3! bg-emerald-500! border-2! border-white! dark:border-(--card-border-color)! shadow-sm z-50" />

            <button onClick={() => removeButton(index)} className="absolute -right-1.5 -top-2.25 p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              <X size={12} />
            </button>
            <div className="absolute left-3 top-2 text-[10px] font-bold text-gray-400 uppercase tracking-tight">Option {index + 1}</div>

            <div className="space-y-2">
              <div>
                <Input value={btn.text} onFocus={() => setTouched(true)} onChange={(e) => updateButton(index, "text", e.target.value)} placeholder="Button Label (Quick choice)" className="h-8 text-xs bg-white dark:bg-(--page-body-bg)" maxLength={20} />
              </div>
            </div>
          </div>
        ))}

        {(!data.buttons || data.buttons.length < 3) && (
          <Button onClick={addButton} variant="outline" className="w-full h-9 border-dashed border-gray-200 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:border-dark-accent dark:text-emerald-500 dark:hover:bg-emerald-900/10 text-[11px] font-semibold">
            <Plus className="mr-1.5 h-3 w-3" /> Add Quick Option
          </Button>
        )}
      </div>
    </BaseNode>
  );
}
