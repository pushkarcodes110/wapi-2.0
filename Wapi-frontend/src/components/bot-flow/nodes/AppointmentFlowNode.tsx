/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { useReactFlow } from "@xyflow/react";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

export function AppointmentFlowNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.appointment_config_id) errors.push("Appointment Config ID is required.");
  }

  const updateNodeData = (field: string, value: any) => {
    if (!touched) setTouched(true);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, [field]: value } }
          : node,
      ),
    );
  };

  return (
    <BaseNode
      id={id}
      title="Booking Flow"
      icon={<Calendar size={18} />}
      iconBgColor="bg-amber-600"
      iconColor="text-white"
      borderColor="border-amber-200"
      handleColor="bg-amber-500!"
      errors={errors}
    >
      <div className="space-y-4">
        <NodeField
          label="Appointment Config ID"
          required
          error={(touched || data.forceValidation) && !data.appointment_config_id ? "Config ID is required." : ""}
        >
          <Input
            placeholder="Paste Appointment Config ID"
            value={data.appointment_config_id || ""}
            onFocus={() => setTouched(true)}
            onChange={(e) => updateNodeData("appointment_config_id", e.target.value)}
            className="text-sm bg-gray-50 border-gray-200 focus:bg-white dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
          />
        </NodeField>
        
        <p className="text-[10px] text-gray-500 dark:text-gray-400">
            This node will transition the user into the selected automated booking conversational flow.
        </p>
      </div>
    </BaseNode>
  );
}
