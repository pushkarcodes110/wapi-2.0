import { Calendar, FileText, GitBranch, Image, LayoutTemplate, ListOrdered, ShoppingBag, Sparkles, Sticker, Type, Video } from "lucide-react";
import { MatchingMethod, ReplyTypeConfig } from "../types/keywordAction";

export const MATCHING_METHODS: {
  value: MatchingMethod;
  label: string;
  description: string;
}[] = [
  {
    value: "exact",
    label: "Exact Match",
    description: "Keyword must match exactly",
  },
  {
    value: "contains",
    label: "Contains",
    description: "Message must contain the keyword",
  },
  {
    value: "partial",
    label: "Partial Match",
    description: "Fuzzy match with a threshold %",
  },
  {
    value: "starts_with",
    label: "Starts With",
    description: "Message must start with keyword",
  },
  {
    value: "ends_with",
    label: "Ends With",
    description: "Message must end with keyword",
  },
];

export const REPLY_TYPES: ReplyTypeConfig[] = [
  {
    value: "text",
    label: "Text",
    icon: <Type size={18} />,
    color: "text-blue-500",
    source: "reply_material",
    materialType: "text",
  },
  {
    value: "media",
    label: "Image",
    icon: <Image size={18} />,
    color: "text-emerald-500",
    source: "reply_material",
    materialType: "image",
  },
  {
    value: "media",
    label: "Video",
    icon: <Video size={18} />,
    color: "text-purple-500",
    source: "reply_material",
    materialType: "video",
  },
  {
    value: "media",
    label: "Document",
    icon: <FileText size={18} />,
    color: "text-amber-500",
    source: "reply_material",
    materialType: "document",
  },
  {
    value: "media",
    label: "Sticker",
    icon: <Sticker size={18} />,
    color: "text-pink-500",
    source: "reply_material",
    materialType: "sticker",
  },
  {
    value: "template",
    label: "Template",
    icon: <LayoutTemplate size={18} />,
    color: "text-indigo-500",
    source: "template",
  },
  {
    value: "catalog",
    label: "Catalogue",
    icon: <ShoppingBag size={18} />,
    color: "text-orange-500",
    source: "catalog",
  },
  {
    value: "sequence",
    label: "Sequence",
    icon: <ListOrdered size={18} />,
    color: "text-teal-500",
    source: "sequence",
  },
  {
    value: "chatbot",
    label: "Chatbot",
    icon: <Sparkles size={18} />,
    color: "text-rose-500",
    source: "chatbot",
  },
  {
    value: "flow",
    label: "Form Flow",
    icon: <GitBranch size={18} />,
    color: "text-orange-500",
    source: "reply_material",
    materialType: "flow",
  },
  {
    value: "appointment_flow",
    label: "Appointment",
    icon: <Calendar size={18} />,
    color: "text-red-500",
    source: "appointment",
  },
];
