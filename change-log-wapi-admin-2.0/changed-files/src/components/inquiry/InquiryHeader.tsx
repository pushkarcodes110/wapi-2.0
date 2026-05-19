"use client";

import { InquiryHeaderProps } from "@/src/types/components";
import { useTranslation } from "react-i18next";
import CommonHeader from "../../shared/CommonHeader";

const InquiryHeader = ({ onRefresh, onSearch, searchTerm, isLoading, columns, onColumnToggle, selectedCount, onBulkDelete }: InquiryHeaderProps) => {
  const { t } = useTranslation();

  return <CommonHeader title={t("inquiry_title")} description={t("inquiry_description")} onSearch={onSearch} searchTerm={searchTerm} searchPlaceholder={t("common_search_placeholder")} onRefresh={onRefresh} isLoading={isLoading} columns={columns} onColumnToggle={onColumnToggle} selectedCount={selectedCount} onBulkDelete={onBulkDelete} bulkDeletePermission="delete.contact_inquiries" />;
};

export default InquiryHeader;
