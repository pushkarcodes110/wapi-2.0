/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { SuggestReplyMessage } from "./components/chat";
import { AIModel } from "./settings";

export interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  section?: string;
  isActive?: boolean;
  order: number;
  permission?: string;
  roles?: string[];
}

export interface SidebarProps {
  onMenuClick?: (label: string) => void;
  activeMenu?: string;
}

export interface SearchResult {
  label: string;
  path: string;
  icon: ReactNode;
  section?: string;
}

export interface ManageWabaColumn {
  id: string;
  registred_phone_number: string;
  phone_number_id: string;
  name: string;
  whatsapp_business_account_id: string;
  app_id: string;
  is_active: boolean;
  verified_name: string | null;
  quality_rating: string | null;
  created_at: string;
  updated_at: string;
  business_app?: string;
  throughput?: string;
  phone_numbers?: {
    id: string;
    phone_number_id: string;
    display_phone_number: string;
    is_active: boolean;
  }[];
  phone_numbers_count: number;
}

export interface Tag {
  _id: string;
  label: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  _id: string;
  name: string;
  email: string;
  password?: string;
  note?: string;
  country_code: string;
  phone: string;
  status: boolean;
  is_phoneno_hide?: boolean;
  role: string;
  team_id?: string | Team;
  created_at: string;
  updated_at: string;
}

export interface Team {
  _id: string;
  name: string;
  description?: string;
  status: "active" | "inactive";
  permissions?: string[];
  created_at: string;
  updated_at: string;
}

export interface TeamPermission {
  name: string;
  slug: string;
  description?: string;
}

export interface TeamPermissionGroup {
  _id: string;
  module: string;
  description?: string;
  submodules: TeamPermission[];
}

export interface Contact {
  _id: string;
  name: string;
  phone_number: string;
  source?: string;
  email?: string;
  assigned_to?: string;
  tags?: string[];
  status?: string;
  custom_fields?: Record<string, any>;
  segments?: string[] | any[];
  allow_duplicate?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomField {
  _id: string;
  label: string;
  name: string;
  type: string;
  is_active: boolean;
  required?: boolean;
  placeholder?: string;
  description?: string;
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  options?: string[];
  created_at: string;
  updated_at: string;
}

export interface CustomFieldType {
  label: string;
  value: string;
}

export interface CommonHeaderProps {
  backBtn?: boolean;
  title: string;
  description: string;
  onSearch?: (value: string) => void;
  searchTerm?: string;
  searchPlaceholder?: string;
  onFilter?: () => void;
  onRefresh?: () => void;
  onSync?: () => void;
  onSyncStatus?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  isExportDisabled?: boolean;
  isImportLoading?: boolean;
  onAddClick?: () => void;
  addLabel?: string;
  isLoading?: boolean;
  isSyncingStatus?: boolean;
  columns?: { id: string; label: string; isVisible: boolean }[];
  onColumnToggle?: (columnId: string) => void;
  onBulkDelete?: () => void;
  selectedCount?: number;
  addPermission?: string;
  deletePermission?: string;
  syncPermission?: string;
  syncStatusPermission?: string;
  exportPermission?: string;
  importPermission?: string;
  rightContent?: React.ReactNode;
  middleContent?: React.ReactNode;
  featureKey?: string;
  onToggleSidebar?: () => void;
  extraActions?: React.ReactNode;
  children?: React.ReactNode;
}

export interface Attachment {
  _id: string;
  original_name: string;
  encoding: string;
  mimeType: string;
  fileName: string;
  path: string;
  fileSize: number;
  fileUrl: string;
  createdAt: string;
  updated_at: string;
  title?: string;
  caption?: string;
  description?: string;
  uploaded_by?: string;
  localFile?: File;
}

export interface AttachmentResponse {
  data: {
    attachments: Attachment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
}

export interface TemplateHeader {
  format: "text" | "media";
  text?: string;
  media_type?: "image" | "video" | "document" | "location";
  media_url?: string;
  handle?: string;
}

export interface TemplateButton {
  type: "phone_call" | "website" | "quick_reply" | "copy_code" | "catalog";
  text: string;
  phone_number?: string;
  website_url?: string;
}

export interface TemplateVariable {
  key: string;
  example: string;
}

export interface Template {
  _id: string;
  user_id: string;
  waba_id: string;
  template_name: string;
  language: string;
  category: string;
  template_type?: string;
  status: string;
  header?: TemplateHeader;
  message_body: string;
  body_variables?: TemplateVariable[];
  variables_example?: TemplateVariable[];
  variables?: TemplateVariable[];
  footer_text?: string;
  buttons?: TemplateButton[];
  meta_template_id?: string;
  is_limited_time_offer?: boolean;
  offer_text?: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignStats {
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  read_count: number;
  failed_count: number;
  pending_count: number;
}

export interface Recipient {
  phone_number: string;
  status: "sent" | "delivered" | "read" | "failed" | "pending";
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  failure_reason?: string;
}

export interface Campaign {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  user_id: string;
  waba_id: string | ManageWabaColumn; // Update to allow populated object
  template_id: string;
  template_name: string;
  language_code: string;
  recipient_type: "specific_contacts" | "all_contacts" | "tags" | "segments";
  specific_contacts?: string[];
  tag_ids?: string[];
  segment_ids?: string[];
  variables_mapping?: Record<string, string>;
  media_url?: string;
  is_scheduled: boolean;
  scheduled_at?: string;
  sent_at: string;
  completed_at?: string;
  status: "draft" | "scheduled" | "sending" | "completed" | "failed" | "cancelled" | "completed_with_errors";
  stats: CampaignStats;
  recipients?: Recipient[];
  created_at: string;
  updated_at: string;
}

export interface CampaignFormValues {
  name: string;
  description: string;
  waba_id: string;
  template_id: string;
  variables_mapping: Record<string, string>;
  recipient_type: "all_contacts" | "specific_contacts" | "tags" | "segments";
  specific_contacts: string[];
  tag_ids: string[];
  segment_ids: string[];
  media_url: string;
  is_scheduled: boolean;
  scheduled_at: string;
  // Template-specific campaign fields
  coupon_code?: string;
  offer_expiration_minutes?: string;
  thumbnail_product_retailer_id?: string;
  carousel_cards_data?: {
    header: { type: string; link: string; localFile?: File };
    body: { text: string };
    buttons: { type: string; text: string; url_value?: string; payload?: string }[];
  }[];
  carousel_products?: {
    product_retailer_id: string;
    catalog_id: string;
  }[];
}

export interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<CustomField>) => Promise<void>;
  column?: CustomField | null;
  isLoading: boolean;
}

export interface ContactExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (type: "csv" | "excel" | "print") => void;
  selectedCount: number;
}

export interface ContactImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
  isLoading: boolean;
}

export interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Contact>) => Promise<void>;
  contact?: Contact | null;
  isLoading: boolean;
}

export interface AiTextTransformModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onSuccess: (transformedText: string) => void;
}

export interface SuggestReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastMessages: SuggestReplyMessage[] | null;
  onUseReply: (reply: string) => void;
}

export interface ApiKeyConfigProps {
  value: string;
  onChange: (value: string) => void;
}

export interface ConfigurationSummaryProps {
  currentModel?: AIModel;
  hasApiKey: boolean;
}

export interface ModelSelectionProps {
  models: AIModel[];
  selectedModel: string;
  onSelect: (id: string) => void;
}

export interface InternetConnectionWrapperProps {
  children: ReactNode;
}

export interface NoInternetPageProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

export interface MaintenancePageProps {
  title: string;
  message: string;
  imageUrl?: string;
}

export interface MaintenanceGuardProps {
  children: ReactNode;
}

export interface SocketProviderProps {
  children: ReactNode;
}

export interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, color: string) => Promise<any>;
  onAssign?: (tagIds: string[]) => Promise<any>;
  tag?: Tag | null;
  isLoading: boolean;
  fromProfile?: boolean;
}
