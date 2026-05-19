"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/elements/ui/dropdown-menu";
import { useDeleteChatMutation, useLazyGetMessagesQuery } from "@/src/redux/api/chatApi";
import { useAppSelector } from "@/src/redux/hooks";
import { RootState } from "@/src/redux/store";
import { exportToCSV } from "@/src/utils/exportUtils";
import { ChevronDown, Download, Loader2, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import ConfirmModal from "@/src/shared/ConfirmModal";

interface ChatListItemDropdownProps {
  contactId: string;
  contactName: string;
  contactNumber: string;
  phoneNumberId: string;
}

const ChatListItemDropdown: React.FC<ChatListItemDropdownProps> = ({ contactId, contactNumber, phoneNumberId }) => {
  const [getMessages, { isLoading }] = useLazyGetMessagesQuery();
  const [deleteChat, { isLoading: isDeleting }] = useDeleteChatMutation();
  const { selectedWorkspace } = useAppSelector((state: RootState) => state.workspace);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteSingleChat = async () => {
    if (!selectedWorkspace?._id) return;

    try {
      const response = await deleteChat({
        workspace_id: selectedWorkspace._id,
        contact_ids: [contactId],
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Chat deleted successfully");
        setIsDeleteModalOpen(false);
        setIsOpen(false);
      } else {
        toast.error(response.message || "Failed to delete chat");
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
      toast.error("An error occurred while deleting chat");
    }
  };

  const handleExport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await getMessages({
        contact_id: contactId,
        whatsapp_phone_number_id: phoneNumberId,
      }).unwrap();

      if (!response.success || !response.messages || response.messages.length === 0) {
        toast.error("No messages found to export");
        return;
      }

      const headers = ["Date", "Sender", "Recipient", "Type", "Content"];
      const rowData: string[][] = [];

      response.messages.forEach((dateGroup) => {
        dateGroup.messageGroups.forEach((group) => {
          group.messages.forEach((msg) => {
            let content = msg.content || "";
            if (msg.messageType === "image") content = `[Image] ${msg.fileUrl || ""}`;
            else if (msg.messageType === "video") content = `[Video] ${msg.fileUrl || ""}`;
            else if (msg.messageType === "audio") content = `[Audio] ${msg.fileUrl || ""}`;
            else if (msg.messageType === "document") content = `[Document] ${msg.fileUrl || ""}`;
            else if (msg.messageType === "location") content = `[Location] ${msg.content || ""}`;
            else if (msg.messageType === "template") content = `[Template] ${msg.template?.template_name || ""} -> ${msg.template?.message_body || ""}`;
            else if (msg.messageType === "system_messages") content = `[System] ${msg.content || ""}`;

            rowData.push([new Date(msg.createdAt).toLocaleString(), msg.sender.name || msg.sender.id, msg.recipient.name || msg.recipient.id, msg.messageType, content || "-"]);
          });
        });
      });

      exportToCSV(headers, rowData, `chat_history_${contactNumber}`);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to export messages:", error);
      toast.error("Failed to export chat messages");
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-(--table-hover) text-slate-400 hover:text-slate-600 transition-all">{isLoading ? <Loader2 size={14} className="animate-spin text-primary" /> : <ChevronDown size={18} />}</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 dark:bg-(--card-color) dark:border-(--card-border-color)">
          <DropdownMenuItem onClick={handleExport} disabled={isLoading} className="gap-2 cursor-pointer font-normal text-xs dark:text-amber-50 dark:hover:bg-(--table-hover)">
            <Download size={14} className="text-slate-500" />
            <span>Export Messages</span>
          </DropdownMenuItem>
         {false && <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteModalOpen(true);
            }}
            disabled={isLoading || isDeleting}
            className="gap-2 cursor-pointer font-normal text-xs dark:hover:bg-red-500/10"
          >
            <Trash2 size={14} className="text-red-600 dark:text-red-500 dark:hover:bg-red-500/10" />
            <span className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:bg-red-500/10">Delete Chat</span>
          </DropdownMenuItem>}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteSingleChat} isLoading={isDeleting} title="Delete Chat?" subtitle="Are you sure you want to delete this conversation? This action cannot be undone." confirmText="Delete" variant="danger" />
    </div>
  );
};

export default ChatListItemDropdown;
