import { Button } from "@/src/elements/ui/button";
import { ChatMessageListProps } from "@/src/types/components/chat";
import { formatChatDate } from "@/src/utils";
import { ArrowDown } from "lucide-react";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ChatMessageSkeleton } from "../ChatSkeleton";
import MessageGroup from "./MessageGroup";

const ChatMessageList = forwardRef<{ scrollToTop: () => void; scrollToBottom: () => void }, ChatMessageListProps>(({ data, isLoading, onImageClick, isWindowExpired }, ref) => {
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (!listRef.current) return;

    const scroll = () => {
      if (!listRef.current) return;
      const { scrollHeight, clientHeight } = listRef.current;
      listRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior,
      });
    };

    requestAnimationFrame(() => {
      scroll();
      if (behavior === "auto") {
        setTimeout(scroll, 100);
      }
    });
  };

  const scrollToTop = () => {
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useImperativeHandle(ref, () => ({
    scrollToTop,
    scrollToBottom: () => scrollToBottom("smooth"),
  }));

  useEffect(() => {
    if (data?.messages) {
      const timeout = setTimeout(() => {
        scrollToBottom("smooth");
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [data]);

  useEffect(() => {
    if (!listRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (!listRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      if (isNearBottom) {
        scrollToBottom("auto");
      }
    });

    resizeObserver.observe(listRef.current);
    return () => resizeObserver.disconnect();
  }, [data]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 300);
  };

  if (isLoading) {
    return <ChatMessageSkeleton />;
  }

  if (!data?.messages || data.messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-2">
        <p className="text-slate-400 text-sm">No messages yet. Send a message to start the conversation.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 relative flex flex-col min-h-0 overflow-hidden">
      <div ref={listRef} onScroll={handleScroll} className="flex-1 overflow-y-auto py-6 pb-0 px-4 space-y-8 custom-scrollbar">
        {data.messages.map((dateGroup) => (
          <div key={dateGroup.dateKey} className="flex flex-col space-y-6">
            <div className="flex justify-center sticky top-1 z-10">
              <span className="px-3 py-1 rounded-full bg-slate-100/50 dark:bg-(--page-body-bg) backdrop-blur-sm text-[11px] font-bold text-slate-500 dark:text-gray-400 shadow-sm border border-slate-200/50 dark:border-(--card-border-color)">{formatChatDate(dateGroup.dateKey)}</span>
            </div>

            <div className="flex flex-col space-y-4">
              {dateGroup.messageGroups.map((group, index) => (
                <MessageGroup key={`${dateGroup.dateKey}-${group.senderId}-${index}`} group={group} onImageClick={onImageClick} isWindowExpired={isWindowExpired} />
              ))}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {showScrollBottom && (
        <Button size="icon" variant="secondary" className="absolute bottom-6 end-6 rounded-full shadow-lg bg-white dark:bg-(--page-body-bg) border border-slate-200 dark:border-(--card-border-color) animate-in fade-in zoom-in duration-200" onClick={() => scrollToBottom()}>
          <ArrowDown size={18} className="text-primary" />
        </Button>
      )}
    </div>
  );
});

ChatMessageList.displayName = "ChatMessageList";

export default ChatMessageList;
