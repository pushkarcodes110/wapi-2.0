/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { cn } from "@/src/lib/utils";
import { useCreateAttachmentMutation } from "@/src/redux/api/mediaApi";
import { useReactFlow } from "@xyflow/react";
import { FileImage, FileText, Film, Image as ImageIcon, Music, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

export function MediaMessageNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [createAttachment] = useCreateAttachmentMutation();
  const [touched, setTouched] = useState(false);

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.mediaUrl || !data.mediaUrl.trim()) errors.push("Media URL is required");
  }

  const updateNodeData = (field: string, value: any) => {
    if (!touched) setTouched(true);
    setNodes((nds: any[]) => nds.map((node: any) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node)));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    if (!touched) setTouched(true);
    updateNodeData("mediaUrl", localUrl);

    try {
      const formData = new FormData();
      formData.append("attachments", file);

      const result = await createAttachment(formData).unwrap();
      const serverUrl = result?.data?.[0]?.url || result?.[0]?.url;
      if (serverUrl) {
        updateNodeData("mediaUrl", serverUrl);
        toast.success("Media uploaded successfully");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload media to server");
    }
  };

  return (
    <BaseNode
      id={id}
      title="Attach Media"
      icon={<FileImage size={18} />}
      iconBgColor="bg-violet-600"
      iconColor="text-white"
      borderColor="border-violet-200"
      handleColor="bg-violet-500!"
      errors={errors}
      showOutHandle={false}
    >
      <NodeField label="Content Format" required>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {[
            { value: "image", label: "Image", icon: <ImageIcon className="h-4 w-4" /> },
            { value: "video", label: "Video", icon: <Film className="h-4 w-4" /> },
            { value: "document", label: "Document", icon: <FileText className="h-4 w-4" /> },
            { value: "audio", label: "Audio", icon: <Music className="h-4 w-4" /> },
          ].map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => updateNodeData("mediaType", type.value)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 border h-16 relative group overflow-hidden",
                (data.mediaType || "image") === type.value
                  ? "border-violet-500 bg-violet-50/50 dark:bg-(--page-body-bg) ring-1 ring-violet-500/20 shadow-sm"
                  : "border-gray-100 bg-gray-50/50 hover:border-gray-200 dark:hover:border-(--card-border-color) dark:border-(--card-border-color) dark:bg-(--card-color) dark:hover:bg-(--card-border-color)"
              )}
            >
              <div className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg transition-transform group-active:scale-90 shadow-sm",
                (data.mediaType || "image") === type.value ? "bg-violet-600 text-white" : "bg-white text-gray-400 dark:bg-white/5"
              )}>
                {type.icon}
              </div>
              <span className={cn(
                "text-[10px] font-bold mt-1.5 transition-colors",
                (data.mediaType || "image") === type.value ? "text-violet-600" : "text-gray-500 dark:text-gray-400"
              )}>
                {type.label}
              </span>
            </button>
          ))}
        </div>
      </NodeField>

      <NodeField label="Resource Location" required error={(touched || data.forceValidation) && !data.mediaUrl ? "URL or path is required" : ""}>
        <div className="flex gap-2">
          <Input
            value={data.mediaUrl || ""}
            onFocus={() => setTouched(true)}
            onChange={(e) => updateNodeData("mediaUrl", e.target.value)}
            placeholder="https://..."
            className="h-9 text-sm bg-gray-50 border-gray-200 dark:bg-(--page-body-bg) dark:border-(--card-border-color) flex-1"
          />
          <label className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 dark:bg-(--page-body-bg) dark:border-(--card-border-color) dark:hover:bg-(--table-hover) transition-colors shadow-sm">
            <Upload size={14} className="text-gray-500" />
            <input type="file" className="hidden" onChange={handleFileChange} accept={data.mediaType === "image" ? "image/*" : data.mediaType === "video" ? "video/*" : "*/*"} />
          </label>
        </div>
      </NodeField>

      <NodeField label="Add Caption">
        <Input
          value={data.caption || ""}
          onFocus={() => setTouched(true)}
          onChange={(e) => updateNodeData("caption", e.target.value)}
          placeholder="Optional text description..."
          className="h-9 text-sm bg-gray-50 border-gray-200 dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
        />
        <div className="mt-1 text-right text-[10px] text-gray-400 font-medium">{data.caption?.length || 0}/1024</div>
      </NodeField>

      <div className="pt-2">
        <div className="relative group rounded-lg overflow-hidden border border-gray-100 bg-gray-50 dark:bg-(--page-body-bg) dark:border-(--card-border-color) shadow-inner">
          {data.mediaUrl ? (
            <div className="flex flex-col">
              <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden">
                {(data.mediaType || "image") === "image" || data.mediaType === "video" ? (
                  <>
                    <img
                      src={data.mediaUrl}
                      alt="Preview"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Invalid+Asset";
                      }}
                    />
                    {data.mediaType === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
                          <div className="w-0 h-0 border-t-6 border-t-transparent border-l-10 border-l-white border-b-6 border-b-transparent ml-1" />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 p-6">
                    <div className={cn("p-4 rounded-2xl shadow-sm", data.mediaType === "audio" ? "bg-blue-500/10 text-blue-500" : "bg-orange-500/10 text-orange-500")}>
                      {data.mediaType === "audio" ? (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                        </svg>
                      ) : (
                        <FileText size={32} strokeWidth={2} />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Document Type</span>
                  </div>
                )}
              </div>
              {data.caption && (
                <div className="p-3 bg-white/50 backdrop-blur-sm border-t border-gray-100 dark:bg-transparent dark:border-dark-accent">
                  <p className="text-[11px] font-medium text-gray-600 dark:text-gray-400 leading-normal line-clamp-3 italic">{data.caption}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-300 dark:text-gray-600">
              <ImageIcon size={32} strokeWidth={1} />
              <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Display Preview</p>
            </div>
          )}
        </div>
      </div>
    </BaseNode>
  );
}
