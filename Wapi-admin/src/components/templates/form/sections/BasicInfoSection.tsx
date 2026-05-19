"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { BookOpen, Gift, Image as ImageIcon, Layout, MessageSquare, Phone, Shield, ShoppingBag, Tag, Ticket } from "lucide-react";
import React from "react";
import { SECTOR_LABELS, SECTOR_TEMPLATE_CATEGORIES, SECTORS, SectorKey } from "@/src/data/sectorTemplateCategory";
import { BasicInfoSectionProps, MarketingTypeOption } from "@/src/types/template";
import CharacterCountWrapper from "@/src/shared/CharacterCountWrapper";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { label: "English (US)", value: "en_US" },
  { label: "English (UK)", value: "en_GB" },
  { label: "Hindi", value: "hi" },
  { label: "Gujarati", value: "gu" },
];

export const BasicInfoSection = ({ language, setLanguage, category, setCategory, templateName, setTemplateName, marketingType, setMarketingType, offerText, setOfferText, sector, setSector, templateCategory, setTemplateCategory }: BasicInfoSectionProps) => {
  const { t } = useTranslation();

  const MARKETING_TYPES: MarketingTypeOption[] = [
    { label: t("templates_library_marketing_type_standard"), value: "none", icon: <Tag size={16} />, description: t("templates_library_marketing_desc_standard") },
    { label: t("templates_library_marketing_type_limited_time_offer"), value: "limited_time_offer", icon: <Gift size={16} />, description: t("templates_library_marketing_desc_limited_time_offer") },
    { label: t("templates_library_marketing_type_coupon_code"), value: "coupon_code", icon: <Ticket size={16} />, description: t("templates_library_marketing_desc_coupon_code") },
    { label: t("templates_library_marketing_type_catalog"), value: "catalog", icon: <BookOpen size={16} />, description: t("templates_library_marketing_desc_catalog") },
    { label: t("templates_library_marketing_type_call_permission"), value: "call_permission", icon: <Phone size={16} />, description: t("templates_library_marketing_desc_call_permission") },
    { label: t("templates_library_marketing_type_carousel_product"), value: "carousel_product", icon: <ShoppingBag size={16} />, description: t("templates_library_marketing_desc_carousel_product") },
    { label: t("templates_library_marketing_type_carousel_media"), value: "carousel_media", icon: <ImageIcon size={16} />, description: t("templates_library_marketing_desc_carousel_media") },
  ];

  const CATEGORIES = [
    { label: t("templates_library_category_utility"), value: "UTILITY", icon: <MessageSquare size={18} /> },
    { label: t("templates_library_category_marketing"), value: "MARKETING", icon: <Layout size={18} /> },
    { label: t("templates_library_category_authentication"), value: "AUTHENTICATION", icon: <Shield size={18} /> },
  ];
  const sectorCategories = sector ? SECTOR_TEMPLATE_CATEGORIES[sector as SectorKey] ?? [] : [];

  const handleSectorChange = (val: string) => {
    if (val === sector) return;
    setSector(val);
    setTemplateCategory("");
  };

  return (
    <div className="bg-white dark:bg-(--card-color) p-4 sm:p-6 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        <div className="space-y-3 flex flex-col">
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {t("templates_library_basic_info_template_name")} <span className="text-red-500">*</span>
          </Label>
          <Input placeholder={t("templates_library_basic_info_template_name_placeholder")} value={templateName || ""} onChange={(e) => setTemplateName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} className="h-12 border-(--input-border-color) p-3 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-page-body focus:bg-white dark:focus:bg-page-body transition-all" />
          <p className="text-[11px] text-slate-500 dark:text-gray-500">{t("templates_library_basic_info_template_name_hint")}</p>
        </div>

        <div className="space-y-3 flex flex-col">
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {t("templates_library_basic_info_template_language")} <span className="text-red-500">*</span>
          </Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="h-12 py-5.5 border-slate-200 dark:border-none rounded-lg bg-(--input-color) dark:bg-page-body transition-all">
              <SelectValue placeholder={t("templates_library_basic_info_select_language")} />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-(--input-border-color) dark:border-(--card-border-color) dark:bg-page-body">
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[11px] text-slate-400">{t("templates_library_basic_info_language_hint")}</p>
        </div>
      </div>

      {/* Sector + Template Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        <div className="space-y-3 flex flex-col">
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {t("templates_library_basic_info_sector")} <span className="text-red-500">*</span>
          </Label>
          <Select value={sector || ""} onValueChange={handleSectorChange}>
            <SelectTrigger className="h-12 py-5.5 border-slate-200 dark:border-none rounded-lg bg-(--input-color) dark:bg-page-body transition-all">
              <SelectValue placeholder={t("templates_library_basic_info_select_sector")} />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-slate-200 dark:border-(--card-border-color) dark:bg-page-body">
              {SECTORS.map((s) => (
                <SelectItem key={s} value={s}>
                  {SECTOR_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[11px] text-slate-400">{t("templates_library_basic_info_sector_hint")}</p>
        </div>

        <div className="space-y-3 flex flex-col">
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {t("templates_library_basic_info_template_category")} <span className="text-red-500">*</span>
          </Label>
          <Select key={sector} value={templateCategory || ""} onValueChange={setTemplateCategory} disabled={!sector}>
            <SelectTrigger className="h-12 py-5.5 border-(--input-border-color) dark:border-none rounded-lg bg-(--input-color) dark:bg-page-body transition-all">
              <SelectValue placeholder={sector ? t("templates_library_basic_info_select_category") : t("templates_library_basic_info_select_sector_first")} />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-(--input-border-color) dark:border-(--card-border-color) dark:bg-page-body">
              {sectorCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[11px] text-slate-400">{t("templates_library_basic_info_category_hint")}</p>
        </div>
      </div>

      {/* WhatsApp Template Category */}
      <div className="space-y-4 flex flex-col">
        <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("templates_library_basic_info_whatsapp_category")}</Label>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 [@media(min-width:767px)_and_(max-width:1355px)]:grid-cols-2 [@media(min-width:1200px)_and_(max-width:1130px)]:grid-cols-2
"
        >
          {CATEGORIES.map((cat) => (
            <button key={cat.value} type="button" onClick={() => setCategory(cat.value)} className={`flex items-center gap-3 p-4 rounded-lg border transition-all group ${category === cat.value ? "border-primary bg-emerald-50/50 text-primary dark:bg-emerald-500/10" : "border-slate-100 bg-slate-50/30 dark:bg-(--table-hover) dark:border-(--table-hover) text-slate-500 hover:border-primary dark:hover:border-(--card-border-color)"}`}>
              <div className={`p-2 rounded-lg transition-colors ${category === cat.value ? "bg-emerald-100 dark:bg-(--dark-sidebar)" : "bg-white dark:bg-(--dark-body) dark:text-amber-50 group-hover:bg-emerald-50 dark:group-hover:bg-(--card-color)"}`}>{cat.icon}</div>
              <div className="flex flex-col items-start -translate-y-px">
                <span className="font-bold text-sm tracking-tight dark:text-gray-300">{cat.label}</span>
                <span className="text-[10px] opacity-70 font-medium uppercase tracking-wider dark:text-gray-400">{t("templates_library_select_category")}</span>
              </div>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-slate-400">{t("templates_library_basic_info_whatsapp_category_hint")}</p>
      </div>

      {/* Marketing Type (only for MARKETING) */}
      {category === "MARKETING" && (
        <div className="pt-6 border-t border-slate-100 dark:border-(--card-border-color) space-y-5">
          <div>
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("templates_library_basic_info_marketing_template_type")}</Label>
            <p className="text-[11px] text-slate-400 mt-1">{t("templates_library_basic_info_marketing_type_hint")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3">
            {MARKETING_TYPES.map((type) => {
              const isActive = marketingType === type.value;
              return (
                <button key={type.value} type="button" onClick={() => setMarketingType(type.value)} className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left group ${isActive ? "border-primary bg-emerald-50/60 dark:bg-emerald-500/10" : "border-slate-100 dark:border-(--card-border-color) bg-slate-50/30 dark:bg-(--table-hover) hover:border-primary/30 dark:hover:border-(--card-border-color)"}`}>
                  <div className={`p-2 rounded-lg shrink-0 transition-colors ${isActive ? "bg-emerald-100 dark:bg-emerald-500/20 text-primary" : "bg-white dark:bg-(--dark-body) text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-(--card-color)"}`}>{type.icon}</div>
                  <div className="flex flex-col min-w-0">
                    <span className={`font-bold text-[13px] tracking-tight leading-tight ${isActive ? "text-primary" : "text-slate-700 dark:text-gray-300"}`}>{type.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-gray-500 leading-tight truncate">{type.description}</span>
                  </div>
                  {isActive && (
                    <div className="ml-auto shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {marketingType === "limited_time_offer" && (
            <div className="space-y-3 flex flex-col animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("templates_library_offer_text")}</Label>
              <CharacterCountWrapper current={offerText?.length || 0} max={60}>
                <Input placeholder={t("templates_library_basic_info_offer_text_placeholder")} value={offerText || ""} onChange={(e) => setOfferText(e.target.value.slice(0, 60))} className="h-11 border-(--input-border-color) p-3 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-page-body focus:bg-white dark:focus:bg-page-body transition-all" />
              </CharacterCountWrapper>
              <p className="text-[11px] text-slate-400">{t("templates_library_basic_info_offer_text_hint")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
