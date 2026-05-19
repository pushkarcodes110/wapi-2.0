"use client";

import { Button } from "@/src/elements/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/elements/ui/popover";
import { ChatAttachmentMenuProps } from "@/src/types/components/chat";
import { Image as ImageIcon, MapPin, Paperclip, MessageSquare, List, Mic, CreditCard } from "lucide-react";
import React from "react";
import { useChatTheme } from "@/src/hooks/useChatTheme";
import { useAppSelector } from "@/src/redux/hooks";

const ChatAttachmentMenu = ({ onFileSelect, onMediaLibraryOpen, onLocationClick, onInteractiveClick, onAudioClick, onPaymentLinkClick, isBaileys }: ChatAttachmentMenuProps) => {
  const { isCustom } = useChatTheme();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { userSetting ,allow_media_send} = useAppSelector((state) => state.setting);
  const userSettingData = userSetting?.data;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover)! hover:bg-gray-100! dark:text-gray-400 bg-gray-100 rounded-lg transition-colors"
          style={isCustom ? { color: userSettingData?.theme_color == "null" ? "var(--primary)" : "var(--chat-theme-color)" } : {}}
          onMouseEnter={(e) => {
            if (isCustom) {
              e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--chat-theme-color), transparent 90%)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "";
          }}
        >
          <Paperclip size={24} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2 dark:bg-(--page-body-bg)" side="top" align="start">
        <div className="flex flex-col gap-1">
          {!isBaileys && (
            <>
              <button className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-(--table-hover) rounded-lg transition-colors text-sm text-slate-700 dark:text-slate-300" onClick={() => onInteractiveClick("button")}>
                <MessageSquare size={18} className="text-emerald-500" />
                <span>Button message</span>
              </button>

              <button className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-(--table-hover) rounded-lg transition-colors text-sm text-slate-700 dark:text-slate-300" onClick={() => onInteractiveClick("list")}>
                <List size={18} className="text-blue-500" />
                <span>List message</span>
              </button>

              <div className="h-px bg-slate-100 dark:bg-(--card-border-color) my-1" />
            </>
          )}

         {allow_media_send && <button
            className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-(--table-hover) rounded-lg transition-colors text-sm text-slate-700 dark:text-slate-300"
            onClick={() => {
              onMediaLibraryOpen();
            }}
          >
            <ImageIcon size={18} className="text-purple-500" />
            <span>Media Library</span>
          </button>}

          <button
            className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-(--table-hover) rounded-lg transition-colors text-sm text-slate-700 dark:text-slate-300"
            onClick={() => {
              onLocationClick();
            }}
          >
            <MapPin size={18} className="text-rose-500" />
            <span>Location</span>
          </button>
          {allow_media_send && <button
            className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-(--table-hover) rounded-lg transition-colors text-sm text-slate-700 dark:text-slate-300"
            onClick={() => {
              onAudioClick?.();
            }}
          >
            <Mic size={18} className="text-amber-500" />
            <span>Audio</span>
          </button>}
          {!isBaileys && (
            <button
              className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-(--table-hover) rounded-lg transition-colors text-sm text-slate-700 dark:text-slate-300"
              onClick={() => {
                onPaymentLinkClick();
              }}
            >
              <CreditCard size={18} className="text-emerald-500" />
              <span>Send payment link</span>
            </button>
          )}
        </div>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
      </PopoverContent>
    </Popover>
  );
};

export default ChatAttachmentMenu;
