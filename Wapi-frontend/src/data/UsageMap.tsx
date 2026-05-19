import { Bot, Calendar, Code2, Columns, Facebook, FileDigit, Form, GitBranch, HatGlasses, Headphones, MessageSquare, MessagesSquare, PhoneCall, Sparkles, Tags, Target, User, UserCheck, Users, Webhook } from "lucide-react";

export const USAGE_MAPPING = {
  contacts_used: { label: "contacts_label", icon: User, featureKey: "contacts" },
  template_bots_used: { label: "template_bots_label", icon: Bot, featureKey: "template_bots" },
  message_bots_used: { label: "message_bots_label", icon: MessageSquare, featureKey: "message_bots" },
  campaigns_used: { label: "campaigns_label", icon: Target, featureKey: "campaigns" },
  ai_prompts_used: { label: "ai_prompts_label", icon: Sparkles, featureKey: "ai_prompts" },
  teams_used: { label: "teams_label", icon: Users, featureKey: "teams" },
  staff_used: { label: "staff_label", icon: HatGlasses, featureKey: "staff" },
  conversations_used: { label: "conversations_label", icon: MessagesSquare, featureKey: "conversations" },
  bot_flow_used: { label: "bot_flows_label", icon: GitBranch, featureKey: "bot_flow" },
  forms_used: { label: "forms_label", icon: Form, featureKey: "forms" },
  tags_used: { label: "tags_label", icon: Tags, featureKey: "tags" },
  custom_fields_used: { label: "custom_fields_label", icon: FileDigit, featureKey: "custom_fields" },
  rest_api_used: { label: "rest_api_label", icon: Code2, featureKey: "rest_api" },
  whatsapp_webhook_used: { label: "webhooks_label", icon: Webhook, featureKey: "whatsapp_webhook" },
  priority_support_used: { label: "priority_support_label", icon: Headphones, featureKey: "priority_support" },
  appointment_bookings_used: { label: "appointment_bookings_label", icon: Calendar, featureKey: "appointment_bookings" },
  whatsapp_calling_used: { label: "whatsapp_calling_label", icon: PhoneCall, featureKey: "whatsapp_calling" },
  facebookAds_campaign_used: { label: "facebook_ads_label", icon: Facebook, featureKey: "facebookAds_campaign" },
  kanban_funnels_used: { label: "kanban_funnels_label", icon: Columns, featureKey: "kanban_funnels" },
  segments_used: { label: "segments_label", icon: UserCheck, featureKey: "segments" },
};
