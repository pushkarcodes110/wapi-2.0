"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { PlanHeaderProps } from "@/src/types/components";
import { Gift } from "lucide-react";
import { Button } from "@/src/elements/ui/button";
import { ROUTES } from "../../constants";
import CommonHeader from "../../shared/CommonHeader";
import Can from "../shared/Can";

const PlanHeader = ({ isLoading, onFreeTrialClick }: PlanHeaderProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleAddClick = () => {
    router.push(ROUTES.ManagePlansAdd);
  };

  return (
    <CommonHeader
      title={t("plan_title")}
      description={t("plan_description")}
      onAddClick={handleAddClick}
      addLabel={t("add_plan")}
      addPermission="create.plans"
      isLoading={isLoading || false}
      extraActions={
        <Can permission="update.plans">
          <Button variant="outline" onClick={onFreeTrialClick} className="flex items-center gap-2 px-4.5 py-5 rounded-lg border-(--input-color) text-slate-800 hover:bg-input-color font-medium transition-all dark:bg-page-body dark:border-none dark:text-amber-50 dark:hover:bg-(--dark-sidebar)" disabled={isLoading}>
            <Gift className="w-5 h-5" />
            Trial Period
          </Button>
        </Can>
      }
    />
  );
};

export default PlanHeader;
