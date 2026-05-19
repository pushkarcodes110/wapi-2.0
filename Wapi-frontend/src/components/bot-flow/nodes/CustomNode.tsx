/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ApiNode } from "./ApiNode";
import { ButtonMessageNode } from "./ButtonMessageNode";
import { ConditionNode } from "./ConditionNode";
import { DelayNode } from "./DelayNode";
import { GenericNode } from "./GenericNode";
import { ListMessageNode } from "./ListMessageNode";
import { LocationNode } from "./LocationNode";
import { MediaMessageNode } from "./MediaMessageNode";
import { ResponseSaverNode } from "./ResponseSaverNode";
import { TextMessageNode } from "./TextMessageNode";
import { TriggerNode } from "./TriggerNode";
import { WaitForReplyNode } from "./WaitForReplyNode";
import { SendTemplateNode } from "./SendTemplateNode";
import { CtaButtonNode } from "./CtaButtonNode";
import { AssignChatbotNode } from "./AssignChatbotNode";
import { GoogleSheetNode } from "./GoogleSheetNode";
import { CalendarEventNode } from "./CalendarEventNode";
import { AddTagNode } from "./AddTagNode";

export function CustomNode(props: any) {
  switch (props.data.nodeType) {
    case "condition":
      return <ConditionNode {...props} />;
    case "delay":
      return <DelayNode {...props} />;
    case "trigger":
      return <TriggerNode {...props} />;
    case "text_message":
    case "send-message":
      return <TextMessageNode {...props} />;
    case "button_message":
      return <ButtonMessageNode {...props} />;
    case "list-message":
    case "list_message":
      return <ListMessageNode {...props} />;
    case "media_message":
      return <MediaMessageNode {...props} />;
    case "location":
      return <LocationNode {...props} />;
    case "wait_for_reply":
      return <WaitForReplyNode {...props} />;
    case "api":
    case "api_request":
      return <ApiNode {...props} />;
    case "response_saver":
      return <ResponseSaverNode {...props} />;
    case "send_template":
      return <SendTemplateNode {...props} />;
    case "cta_button":
      return <CtaButtonNode {...props} />;
    case "assign_chatbot":
      return <AssignChatbotNode {...props} />;
    case "save_to_google_sheet":
      return <GoogleSheetNode {...props} />;
    case "create_calendar_event":
      return <CalendarEventNode {...props} />;
    case "add_tag":
      return <AddTagNode {...props} />;
    default:
      return <GenericNode {...props} />;
  }
}
