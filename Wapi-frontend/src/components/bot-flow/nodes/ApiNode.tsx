/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useReactFlow } from "@xyflow/react";
import { Zap } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

export function ApiNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.url || !data.url.trim()) {
      errors.push("API URL is required.");
    }
  }

  const updateNodeData = (field: string, value: string) => {
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
      title="External API"
      icon={<Zap size={18} />}
      iconBgColor="bg-blue-600"
      iconColor="text-white"
      borderColor="border-blue-200"
      handleColor="bg-blue-500!"
      errors={errors}
    >
      <div className="space-y-4">
        <NodeField 
          label="API URL" 
          required 
          error={(touched || data.forceValidation) && !data.url?.trim() ? "URL is required." : ""}
        >
          <Input
            placeholder="https://api.example.com/data"
            value={data.url || ""}
            onFocus={() => setTouched(true)}
            onChange={(e) => updateNodeData("url", e.target.value)}
            className="text-sm bg-gray-50 border-gray-200 focus:bg-white dark:bg-(--page-body-bg) dark:border-(--card-border-color) dark:focus:bg-(--page-body-bg)"
          />
        </NodeField>

        <NodeField label="HTTP Method">
          <Select
            value={data.method || "GET"}
            onValueChange={(value) => updateNodeData("method", value)}
          >
            <SelectTrigger className="w-full text-sm bg-gray-50 border-gray-200 focus:bg-white dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color)">
              <SelectItem className="dark:hover:bg-(--table-hover)" value="GET">GET</SelectItem>
              <SelectItem className="dark:hover:bg-(--table-hover)" value="POST">POST</SelectItem>
              <SelectItem className="dark:hover:bg-(--table-hover)" value="PUT">PUT</SelectItem>
              <SelectItem className="dark:hover:bg-(--table-hover)" value="PATCH">PATCH</SelectItem>
              <SelectItem className="dark:hover:bg-(--table-hover)" value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </NodeField>
      </div>
    </BaseNode>
  );
}
