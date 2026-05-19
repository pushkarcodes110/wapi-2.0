import { stripHtml } from "@/lib/utils";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import DataTable from "@/src/shared/DataTable";
import { FaqListProps } from "@/src/types/components";
import { ColumnDef } from "@/src/types/shared";
import { Faq } from "@/src/types/store";
import { format } from "date-fns";
import { Edit, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../constants";
import Can from "../shared/Can";

const FaqList = ({ faqs, page, totalPages, total, onPageChange, onDelete, onBulkDelete, isLoading, columns: visibilityColumns, limit = 10, onLimitChange = () => { }, onSelectionChange, selectedIds, onSortChange, searchTerm, isFilterActive }: FaqListProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleEdit = (faq: Faq) => {
    router.push(`${ROUTES.ManageFaqsEdit}/${faq._id}`);
  };

  const columns: ColumnDef<Faq>[] = [
    {
      header: t("faq_question_label"),
      className: "[@media(max-width:1830px)]:min-w-[331px]",
      sortable: true,
      sortKey: "title",
      copyable: true,
      copyField: "title",
      accessor: (faq) => (
        <span className="font-semibold text-gray-900 dark:text-gray-100 break-all cursor-pointer [@media(max-width:1580px)]:line-clamp-2" onClick={() => handleEdit(faq)} title={faq.title}>
          {faq.title}
        </span>
      ),
    },
    {
      header: t("faq_answer_label"),
      className: "[@media(max-width:1830px)]:min-w-[240px]",
      copyable: true,
      copyField: "description",
      accessor: (faq) => (
        <span className="text-gray-500 dark:text-gray-400 break-all line-clamp-2" title={stripHtml(faq.description)}>
          {stripHtml(faq.description)}
        </span>
      ),
    },
    {
      header: t("common_status"),
      className: "[@media(max-width:1830px)]:min-w-[140px]",
      sortable: true,
      sortKey: "status",
      accessor: (faq) => <Badge className={`${faq.status ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"} border-none relative`}>{faq.status ? t("common_published") : t("common_draft")}</Badge>,
    },
    {
      id: "created_at",
      header: t("common_created_at"),
      className: "[@media(max-width:1830px)]:min-w-[165px]",
      sortable: true,
      sortKey: "created_at",
      accessor: (faq) => <span className="text-gray-500 dark:text-gray-400 text-sm">{faq.created_at ? format(new Date(faq.created_at), "MMMM d, yyyy") : "N/A"}</span>,
    },
  ];

  const filteredColumns = columns.filter((col) => {
    if (!visibilityColumns) return true;
    const visibility = visibilityColumns.find((v) => v.id === (col.id || col.sortKey || col.header));
    return visibility ? visibility.isVisible : true;
  });

  const renderActions = (faq: Faq) => (
    <div className="flex items-center gap-2">
      <Can permission="update.faqs">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(faq)} className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs dark:bg-(--page-body-bg)" title={t("common_edit")} disabled={isLoading}>
          <Edit2 className="w-4 h-4" />
        </Button>
      </Can>
    </div>
  );

  return <DataTable data={faqs} columns={filteredColumns} page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} onLimitChange={onLimitChange} limit={limit} isLoading={isLoading} onDelete={(item: Faq) => onDelete(item._id)} deletePermission="delete.faqs" actionPermissions={["update.faqs"]} onBulkDelete={onBulkDelete} onSelectionChange={onSelectionChange} selectedIds={selectedIds} emptyMessage={t("faq_no_faqs")} itemLabel="FAQs" renderActions={renderActions} onSortChange={onSortChange} searchTerm={searchTerm} isFilterActive={isFilterActive} />;
};

export default FaqList;
