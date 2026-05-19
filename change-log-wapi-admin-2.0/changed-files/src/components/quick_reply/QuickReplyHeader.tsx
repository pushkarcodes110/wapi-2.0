"use client";

import { useTranslation } from "react-i18next";
import CommonHeader from "../../shared/CommonHeader";

interface QuickReplyHeaderProps {
  onSearch: (value: string) => void;
  searchTerm: string;
  onRefresh: () => void;
  isLoading: boolean;
  selectedCount: number;
  onBulkDelete: () => void;
  onAddClick: () => void;
}

const QuickReplyHeader = ({
  onSearch,
  searchTerm,
  onRefresh,
  isLoading,
  selectedCount,
  onBulkDelete,
  onAddClick,
}: QuickReplyHeaderProps) => {
  const { t } = useTranslation();

  return (
    <CommonHeader
      title={t("quick_reply_title")}
      description={t("quick_reply_description")}
      onSearch={onSearch}
      searchTerm={searchTerm}
      searchPlaceholder={t("quick_reply_search_placeholder")}
      onAddClick={onAddClick}
      addLabel={t("quick_reply_add_reply")}
      addPermission="create.quick_replies"
      bulkDeletePermission="delete.quick_replies"
      isLoading={isLoading}
      selectedCount={selectedCount}
      onBulkDelete={onBulkDelete}
      onRefresh={onRefresh}
    />
  );
};

export default QuickReplyHeader;
