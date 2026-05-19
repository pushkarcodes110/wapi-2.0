"use client";

import { TestimonialHeaderProps } from "@/src/types/components";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../constants";
import CommonHeader from "../../shared/CommonHeader";

const TestimonialHeader = ({
  onFilter,
  onExport,
  onSearch,
  searchTerm = "",
  isLoading,
  columns,
  onColumnToggle,
  selectedCount,
  onBulkDelete,
}: TestimonialHeaderProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleAddClick = () => {
    router.push(ROUTES.ManageTestimonialsAdd);
  };

  return (
    <CommonHeader
      title={t("testimonial_title")}
      description={t("testimonial_description")}
      onSearch={onSearch}
      searchTerm={searchTerm}
      searchPlaceholder={t("common_search_placeholder")}
      onFilter={onFilter}
      onExport={onExport}
      onAddClick={handleAddClick}
      addLabel={t("common_add_new")}
      addPermission="create.testimonials"
      bulkDeletePermission="delete.testimonials"
      isLoading={isLoading}
      columns={columns}
      onColumnToggle={onColumnToggle}
      selectedCount={selectedCount}
      onBulkDelete={onBulkDelete}
    />
  );
};

export default TestimonialHeader;
