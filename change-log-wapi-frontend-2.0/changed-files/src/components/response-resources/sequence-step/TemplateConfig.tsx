/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { TemplateConfigProps } from "@/src/types/replyMaterial";
import { ImageIcon, ShoppingBag, Sparkles, Tag, Ticket, Timer } from "lucide-react";
import React from "react";
import { CarouselMediaEditor } from "../../campaigns/wizard/CarouselMediaEditor";
import { CarouselProductEditor } from "../../campaigns/wizard/CarouselProductEditor";
import { CatalogProductPicker } from "../../campaigns/wizard/CatalogProductPicker";
import { TemplateCarouselCard } from "../../campaigns/wizard/types";
import { VariableRow } from "../../campaigns/wizard/VariableMappingComponents";
import { formatExpirationTime, getTemplateVariables, hasMediaTemplateHeader, isMarketingTemplate } from "@/src/utils/template";

const TemplateConfig: React.FC<TemplateConfigProps> = ({ template, wabaId, variablesMapping, onVariableChange, mediaUrl, onMediaUrlChange, hasMediaHeader, couponCode, onCouponCodeChange, offerExpirationMinutes, onOfferExpirationMinutesChange, thumbnailProductRetailerId, onThumbnailProductRetailerIdChange, carouselCardsData, onCarouselCardsDataChange, carouselProducts, onCarouselProductsChange, mappingOptions }) => {
  const variableKeys = getTemplateVariables(template);
  const templateCarouselCards: TemplateCarouselCard[] = (template as any)?.carousel_cards || [];

  const isCouponType = isMarketingTemplate(template) && ((template as any)?.template_type === "coupon");
  const isLimitedOffer = isMarketingTemplate(template) && ((template as any)?.template_type === "limited_time_offer");
  const isCatalog = (template as any)?.template_type === "catalog";
  const isCarouselProduct = (template as any)?.template_type === "carousel_product" || ((template as any)?.template_type === "carousel" && ((template as any)?.carousel_cards?.[0]?.components?.[0]?.format === "product" || (template as any)?.carousel_cards?.[0]?.components?.find((c: any) => c.type === "header")?.format === "product"));
  const isCarouselMedia = (template as any)?.template_type === "carousel_media" || ((template as any)?.template_type === "carousel" && !isCarouselProduct);

  const showMediaHeader = hasMediaTemplateHeader(template) && hasMediaHeader;

  return (
    <div className="space-y-6">
      {variableKeys.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="text-primary" size={16} />
            <p className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Body Variables Mapping</p>
          </div>
          <div className="space-y-3">
            {variableKeys.map((key) => {
              const bodyVariables = (template as any)?.body_variables || [];
              const variableDef = bodyVariables.find((v: any) => v.key === key);
              const example = variableDef?.example || "N/A";

              return <VariableRow key={key} varKey={key} example={example} value={variablesMapping[key]} onChange={(val) => onVariableChange(key, val)} mappingOptions={mappingOptions} />;
            })}
          </div>
          <p className="text-[10px] text-slate-400 italic mt-2 px-1">Tip: Choose a contact field for dynamic values or enter static text.</p>
        </div>
      )}

      {showMediaHeader && !isCarouselMedia && (
        <div className="space-y-1.5 p-4 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-100 dark:border-slate-800">
          <Label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1">
            <ImageIcon size={14} className="text-primary" /> Media Header URL
          </Label>
          <Input value={mediaUrl} onChange={(e) => onMediaUrlChange(e.target.value)} placeholder="https://example.com/image.png" className="h-10 rounded-xl bg-white dark:bg-(--dark-body) border-slate-200 dark:border-slate-700" />
          <p className="text-[10px] text-slate-400 mt-1">Direct link to the media (image/video) used in the header.</p>
        </div>
      )}

      {(isCouponType || isLimitedOffer) && (
        <div className="space-y-4 p-4 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-100 dark:border-(--card-border-color)">
          <div className="flex items-center gap-2 mb-1">
            <Ticket className="text-primary" size={16} />
            <p className="text-sm font-bold text-slate-800 dark:text-white">Coupon Configuration</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 flex flex-col">
              <Label className="text-sm font-bold text-slate-500 flex items-center gap-1.5">
                <Tag size={12} /> Coupon Code
              </Label>
              <Input value={couponCode} onChange={(e) => onCouponCodeChange(e.target.value)} placeholder="e.g. SAVE20" className="h-10 rounded-lg bg-white dark:bg-(--dark-body) border-slate-200 dark:border-none" />
            </div>
            {isLimitedOffer && (
              <div className="space-y-1.5 flex flex-col">
                <Label className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                  <Timer size={12} /> Expiration (mins)
                </Label>
                <Input type="number" value={offerExpirationMinutes || ""} onChange={(e) => onOfferExpirationMinutesChange(e.target.value === "" ? "" : (parseInt(e.target.value) || 0))} placeholder="e.g. 60" className="h-10 rounded-lg bg-white dark:bg-(--dark-body) border-slate-200 dark:border-none" />
                {offerExpirationMinutes && (
                  <p className="text-[10px] text-primary font-medium ml-1 animate-in fade-in slide-in-from-top-1">
                    {formatExpirationTime(offerExpirationMinutes)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {isCatalog && (
        <div className="space-y-1.5 p-4 bg-slate-50 dark:bg-slate-800/20 rounded-lg border border-slate-100 dark:border-slate-800">
          <Label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-2">
            <ShoppingBag size={14} className="text-primary" /> Catalog Thumbnail Product
          </Label>
          <CatalogProductPicker wabaId={wabaId} value={thumbnailProductRetailerId} onChange={onThumbnailProductRetailerIdChange} />
        </div>
      )}

      {isCarouselMedia && (
        <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/20 rounded-lg border border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-800 dark:text-white mb-2 uppercase tracking-wider">Carousel Cards configuration</p>
          <CarouselMediaEditor cards={carouselCardsData} templateCards={templateCarouselCards} onChange={onCarouselCardsDataChange} />
        </div>
      )}

      {isCarouselProduct && (
        <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/20 rounded-lg border border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-800 dark:text-white mb-2 uppercase tracking-wider">Product Carousel configuration</p>
          <CarouselProductEditor products={carouselProducts} templateCards={templateCarouselCards} wabaId={wabaId} onChange={onCarouselProductsChange} />
        </div>
      )}
    </div>
  );
};

export default TemplateConfig;
