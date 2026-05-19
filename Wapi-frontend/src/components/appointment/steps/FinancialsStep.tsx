/* eslint-disable @typescript-eslint/no-explicit-any */
import { COUNTRIES } from "@/src/data/Countries";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Switch } from "@/src/elements/ui/switch";
import { cn } from "@/src/lib/utils";
import { DollarSign, Loader, Plus } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import AppointmentTemplateMapper from "../AppointmentTemplateMapper";

interface FinancialsStepProps {
  formData: any;
  errors: Record<string, string>;
  gatewaysData: any;
  isLoadingGateways: boolean;
  templatesData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  handleMappingChange: (templateType: string, variable: string, value: string) => void;
  handleCouponChange: (templateType: string, value: string) => void;
  handleExpirationChange: (templateType: string, value: string) => void;
  mappingOptions: any[];
}

const FinancialsStep: React.FC<FinancialsStepProps> = ({ formData, errors, gatewaysData, isLoadingGateways, templatesData, handleInputChange, handleSelectChange, handleSwitchChange, handleMappingChange, handleCouponChange, handleExpirationChange, mappingOptions }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="text-primary" size={20} />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t("step_financials")}</h2>
        </div>
        <p className="text-sm text-slate-500">{t("financials_info_desc", { defaultValue: "Configure booking fees and payment gateway settings." })}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">{t("appointment_fees")}</Label>
          <div className="relative">
            <DollarSign className={cn("absolute left-3 top-1/2 -translate-y-1/2 text-slate-400", errors.appointment_fees && "text-red-500")} size={16} />
            <Input
              name="appointment_fees"
              type="number"
              value={formData.appointment_fees}
              onChange={handleInputChange}
              className={cn("pl-9 h-11", errors.appointment_fees && "border-red-400 ring-2 ring-red-500/10")}
            />
          </div>
          {errors.appointment_fees && <p className="text-[10px] text-red-500 font-medium ml-1">{errors.appointment_fees}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">{t("tax_percentage")} (%)</Label>
          <div className="relative">
            <Plus className={cn("absolute left-3 top-1/2 -translate-y-1/2 text-slate-400", errors.tax_percentage && "text-red-500")} size={16} />
            <Input
              name="tax_percentage"
              type="number"
              value={formData.tax_percentage}
              onChange={handleInputChange}
              className={cn("pl-9 h-11", errors.tax_percentage && "border-red-400 ring-2 ring-red-500/10")}
              placeholder="18"
            />
          </div>
          {errors.tax_percentage && <p className="text-[10px] text-red-500 font-medium ml-1">{errors.tax_percentage}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">{t("total_fees")}</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={16} />
            <Input value={formData.total_appointment_fees} readOnly className="pl-9 h-11 bg-slate-50 dark:bg-(--page-body-bg) border-primary/20 font-bold text-primary" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">{t("currency")}</Label>
          <Select value={formData.currency} onValueChange={(val) => handleSelectChange("currency", val)}>
            <SelectTrigger className="h-11!">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color)">
              {Array.from(new Set(COUNTRIES.map((c) => c.currency)))
                .sort()
                .map((curr) => (
                  <SelectItem className="dark:hover:bg-(--table-hover)" key={curr} value={curr}>
                    {curr}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">{t("payment_gateway")}</Label>
            <button
              type="button"
              onClick={() => window.open("/payment_gateway", "_blank")}
              className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
            >
              <Plus size={10} /> Add Gateway
            </button>
          </div>
          <Select value={formData.payment_gateway_id} onValueChange={(val) => handleSelectChange("payment_gateway_id", val)}>
            <SelectTrigger className={cn("h-11!", errors.payment_gateway_id && "border-red-400 ring-2 ring-red-500/10")}>
              <div className="flex items-center gap-2">
                {isLoadingGateways ? (
                  <>
                    <Loader className="animate-spin text-slate-400" size={16} />
                    <span className="text-slate-500 text-sm">{t("loading_gateways")}</span>
                  </>
                ) : (
                  <SelectValue placeholder={t("select_gateway")} />
                )}
              </div>
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color)">
              {gatewaysData?.configs?.map((gw: any) => (
                <SelectItem className="dark:hover:bg-(--table-hover)" key={gw._id} value={gw._id}>
                  {gw.display_name} ({gw.gateway})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.payment_gateway_id && <p className="text-[10px] text-red-500 font-medium ml-1 mt-1">{errors.payment_gateway_id}</p>}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between sm:p-5 p-4 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-200 dark:border-(--card-border-color) transition-all hover:border-primary/30">
          <div className="space-y-1">
            <Label className="text-base font-bold">{t("partial_payment")}</Label>
            <p className="text-sm text-slate-500">{t("partial_payment_desc", { defaultValue: "Allow customers to pay a deposit upfront." })}</p>
          </div>
          <Switch checked={formData.accept_partial_payment} onCheckedChange={(checked) => handleSwitchChange("accept_partial_payment", checked)} />
        </div>

        {formData.accept_partial_payment && (
          <div className="space-y-3 sm:p-6 p-4 bg-emerald-50/50 dark:bg-(--page-body-bg) rounded-lg border border-emerald-100 dark:border-(--card-border-color) animate-in zoom-in-95 duration-300">
            <Label className="text-sm font-bold text-emerald-900 dark:text-emerald-300">{t("partial_amount")}</Label>
            <div className="relative">
              <DollarSign className={cn("absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500", errors.partial_payment_amount && "text-red-500")} size={16} />
              <Input
                name="partial_payment_amount"
                type="number"
                value={formData.partial_payment_amount}
                onChange={handleInputChange}
                className={cn("pl-9 h-11! bg-white dark:bg-(--card-color)", errors.partial_payment_amount ? "border-red-400 ring-2 ring-red-500/10" : "border-emerald-200")}
              />
            </div>
            {errors.partial_payment_amount && <p className="text-[10px] text-red-500 font-medium ml-1">{errors.partial_payment_amount}</p>}
            <p className="text-xs text-emerald-600 dark:text-emerald-400">{t("partial_payment_help_text", { defaultValue: "Customers will pay this amount during booking, and the remainder later." })}</p>
          </div>
        )}

        <div className="sm:p-5 p-4 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-200 dark:border-(--card-border-color) space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-bold">{t("send_payment_link_automatically")}</Label>
              <p className="text-sm text-slate-500">{t("send_payment_link_automatically_desc", { defaultValue: "Send a payment link as soon as the appointment is booked." })}</p>
            </div>
            <Switch checked={formData.send_payment_link_automatically} onCheckedChange={(checked) => handleSwitchChange("send_payment_link_automatically", checked)} />
          </div>

          {formData.send_payment_link_automatically && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-(--card-border-color) animate-in slide-in-from-top-2">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">{t("payment_link_template")}</Label>
                <Select value={formData.payment_link_template_id} onValueChange={(val) => handleSelectChange("payment_link_template_id", val)}>
                  <SelectTrigger className={cn("h-11!", errors.payment_link_template_id && "border-red-400 ring-2 ring-red-500/10")}>
                    <SelectValue placeholder={t("select_template")} />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-(--card-color)">
                    {templatesData?.data
                      ?.filter((tpl: any) => tpl.status === "approved")
                      .map((tpl: any) => (
                        <SelectItem className="dark:hover:bg-(--table-hover)" key={tpl._id} value={tpl._id}>
                          {tpl.template_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.payment_link_template_id && <p className="text-[10px] text-red-500 font-medium ml-1 mt-1">{errors.payment_link_template_id}</p>}
              </div>

              {formData.payment_link_template_id && <AppointmentTemplateMapper template={templatesData?.data?.find((t: any) => t._id === formData.payment_link_template_id)} variablesMapping={formData.payment_link_variable_mappings || {}} onVariableChange={(variable, value) => handleMappingChange("payment_link", variable, value)} mappingOptions={mappingOptions} couponCode={formData.payment_link_variable_mappings?.coupon_code} onCouponCodeChange={(val) => handleCouponChange("payment_link", val)} expirationMinutes={formData.payment_link_variable_mappings?.coupon_expiration} onExpirationChange={(val) => handleExpirationChange("payment_link", val)} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialsStep;
