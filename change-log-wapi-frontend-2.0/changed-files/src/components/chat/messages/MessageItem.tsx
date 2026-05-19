import { MessageItemProps } from "@/src/types/components/chat";
import React from "react";
import AudioMessage from "./AudioMessage";
import BaseMessage from "./BaseMessage";
import DocumentMessage from "./DocumentMessage";
import ImageMessage from "./ImageMessage";
import InteractiveMessage from "./InteractiveMessage";
import LocationMessage from "./LocationMessage";
import OrderMessage from "./OrderMessage";
import SystemMessage from "./SystemMessage";
import TemplateMessage from "./TemplateMessage";
import TextMessage from "./TextMessage";
import VideoMessage from "./VideoMessage";

const MessageItem: React.FC<MessageItemProps> = ({ message, onImageClick, isWindowExpired }) => {
  switch (message.messageType) {
    case "text":
      return <TextMessage message={message} isWindowExpired={isWindowExpired} />;
    case "image":
      return <ImageMessage message={message} onImageClick={onImageClick} isWindowExpired={isWindowExpired} />;
    case "video":
      return <VideoMessage message={message} isWindowExpired={isWindowExpired} />;
    case "audio":
      return <AudioMessage message={message} isWindowExpired={isWindowExpired} />;
    case "document":
      return <DocumentMessage message={message} isWindowExpired={isWindowExpired} />;
    case "template":
      return <TemplateMessage message={message} isWindowExpired={isWindowExpired} />;
    case "interactive":
      return <InteractiveMessage message={message} isWindowExpired={isWindowExpired} />;
    case "location":
      return <LocationMessage message={message} isWindowExpired={isWindowExpired} />;
    case "order":
      return <OrderMessage message={message} isWindowExpired={isWindowExpired} />;
    case "payment_link":
      return <TextMessage message={message} isWindowExpired={isWindowExpired} />;
    case "system_messages":
      return <SystemMessage message={message} />;
    default:
      if (message.content) {
        return <TextMessage message={message} isWindowExpired={isWindowExpired} />;
      }
      return (
        <BaseMessage message={message} isWindowExpired={isWindowExpired}>
          <p className="text-slate-400 italic text-[13px]">Unsupported message type: {message.messageType}</p>
        </BaseMessage>
      );
  }
};

export default MessageItem;
