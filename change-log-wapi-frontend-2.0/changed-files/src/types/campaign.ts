import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export type CampaignCard = {
  header: { type: string; link: string; localFile?: File };
  body: { text: string };
  buttons: { type: string; text: string; url_value?: string; payload?: string }[];
};

export type TemplateCarouselCard = {
  components: {
    type: string;
    format?: string;
    buttons?: { type: string; text: string; example?: string[] }[];
    example?: { header_handle?: string[] };
  }[];
};

export type CarouselProduct = { product_retailer_id: string; catalog_id: string };

export interface CampaignStatsProps {
  totalCampaigns: number;
  totalSent: number;
  delivered: number;
  read: number;
}

export interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

export interface StatBoxProps {
  label: string;
  value: number | string;
  color?: string;
}

export interface RecipientTypeCardProps {
  type: string;
  label: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

export interface AllContactsAlertProps {
  count: number;
}

export interface RecipientOption {
  label: string;
  value: string;
}

export interface RecipientSelectionFieldProps {
  options: RecipientOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
}

export interface AllContactsAlertProps {
  count: number;
}

export interface Option {
  label: string;
  value: string;
}

export interface RecipientSelectionFieldData {
  label: string;
  placeholder: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export interface RecipientTypeCardData {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

export interface CampaignStatsData {
  stats: {
    totalCampaignsCreated: number;
    totalSent: number;
    messagesDelivered: number;
    messagesRead: number;
  };
  isLoading: boolean;
}
