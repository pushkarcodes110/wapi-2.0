"use client";

import { Input } from "@/src/elements/ui/input";
import { FooterSectionProps } from "@/src/types/template";
import CharacterCountWrapper from "@/src/shared/CharacterCountWrapper";
import { useTranslation } from "react-i18next";

export const FooterSection = ({ footerText, setFooterText }: FooterSectionProps) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-(--card-color) p-4 sm:p-6 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">{t("templates_library_footer_title")}</h3>
        <p className="text-xs text-slate-500 font-medium dark:text-gray-400">{t("templates_library_footer_subtitle")}</p>
      </div>
      <div className="space-y-4">
        <CharacterCountWrapper current={footerText?.length || 0} max={60}>
          <Input placeholder={t("templates_library_footer_placeholder")} value={footerText || ""} onChange={(e) => setFooterText(e.target.value.slice(0, 60))} className="h-11 p-3 border-(--input-border-color) dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-page-body focus:bg-white dark:focus:bg-page-body focus:border-primary transition-all font-medium" />
        </CharacterCountWrapper>
        <p className="text-[12px] text-slate-400 dark:text-gray-400">{t("templates_library_footer_max_chars")}</p>
      </div>
    </div>
  );
};
