"use client";

import { FaqHeaderProps } from "@/src/types/components";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../constants";
import CommonHeader from "../../shared/CommonHeader";

const FaqHeader = ({ onSearch, searchTerm, onFilter, isLoading, columns, onColumnToggle, selectedCount, onBulkDelete }: FaqHeaderProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleAddClick = () => {
    router.push(ROUTES.ManageFaqsAdd);
  };

  return <CommonHeader title={t("faq_management_title")} description={t("faq_management_description")} onSearch={onSearch} searchTerm={searchTerm} searchPlaceholder={t("faq_search_placeholder")} onFilter={onFilter} onAddClick={handleAddClick} addLabel={t("faq_add_title")} addPermission="create.faqs" bulkDeletePermission="delete.faqs" isLoading={isLoading} columns={columns} onColumnToggle={onColumnToggle} selectedCount={selectedCount} onBulkDelete={onBulkDelete} />;
};

export default FaqHeader;
