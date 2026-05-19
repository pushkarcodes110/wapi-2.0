/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PAYMENTMETHODLIST } from "@/src/data";
import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Label } from "@/src/elements/ui/label";
import { cn } from "@/src/lib/utils";
import { useChangePlanSubscriptionMutation, useCreateManualSubscriptionMutation, useCreatePayPalSubscriptionMutation, useCreateRazorpaySubscriptionMutation, useCreateStripeSubscriptionMutation } from "@/src/redux/api/subscriptionApi";
import CurrencyValue from "@/src/shared/CurrencyValue";
import { SubscriptionModalProps } from "@/src/types/subscription";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ManualPaymentModal from "./ManualPaymentModal";

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, selectedPlan, mode = "none", currentSubscriptionId, currentPaymentGateway }) => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<string>("stripe");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && (mode === "upgrade" || mode === "downgrade") && currentPaymentGateway) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPaymentMethod(currentPaymentGateway === "manual" ? "pending" : currentPaymentGateway);
    }
  }, [isOpen]);

  const [createStripe, { isLoading: isStripeLoading }] = useCreateStripeSubscriptionMutation();
  const [createRazorpay, { isLoading: isRazorpayLoading }] = useCreateRazorpaySubscriptionMutation();
  const [createPayPal, { isLoading: isPayPalLoading }] = useCreatePayPalSubscriptionMutation();
  const [, { isLoading: isManualLoading }] = useCreateManualSubscriptionMutation();
  const [changePlan, { isLoading: isChangeLoading }] = useChangePlanSubscriptionMutation();

  const isUpgradeOrDowngrade = mode === "upgrade" || mode === "downgrade";

  const handleManualPaymentSubmit = () => {
    setIsManualModalOpen(false);
    onClose();
  };

  const handlePay = async () => {
    if (!selectedPlan) return;

    try {
      if (isUpgradeOrDowngrade && currentSubscriptionId) {
        const response = await changePlan({ id: currentSubscriptionId, new_plan_id: selectedPlan._id }).unwrap();
        if (response.success) {
          const redirectUrl = response.data.payment_link || (response.data as any).subscription_link;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            toast.success(response.message || t("plan_changed_success"));
            onClose();
          }
        }
        return;
      }

      if (paymentMethod === "stripe") {
        const response = await createStripe({ plan_id: selectedPlan._id }).unwrap();
        if (response.success && response.data.payment_link) {
          window.location.href = response.data.payment_link;
        } else {
          toast.error(t("stripe_link_not_found"));
        }
      } else if (paymentMethod === "razorpay") {
        const response = await createRazorpay({ plan_id: selectedPlan._id }).unwrap();
        if (response.success) {
          const redirectUrl = response.data.payment_link || (response.data as any).subscription_link;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            toast.error(t("razorpay_link_not_found"));
          }
        }
      } else if (paymentMethod === "paypal") {
        const response = await createPayPal({ plan_id: selectedPlan._id }).unwrap();
        if (response.success) {
          const redirectUrl = response.data.payment_link || (response.data as any).approval_url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            toast.error(t("paypal_link_not_found"));
          }
        }
      } else if (paymentMethod === "pending") {
        setIsManualModalOpen(true);
      } else {
        toast.info(t("unknown_payment_method"));
      }
    } catch (error: any) {
      toast.error(error?.data?.message || t("initiate_payment_failed"));
    }
  };

  const isLoading = isStripeLoading || isRazorpayLoading || isPayPalLoading || isManualLoading || isChangeLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:max-w-3xl! max-w-[calc(100%-2rem)]! border-none shadow-2xl overflow-hidden p-0! bg-white dark:bg-(--card-color) rounded-lg">
        <div className="bg-slate-50 dark:bg-(--card-color) px-5 py-6 border-b border-slate-100 dark:border-(--card-border-color)">
          <DialogHeader>
            <DialogTitle className="text-2xl text-left font-black text-slate-900 dark:text-white tracking-tight">{t("checkout_title")}</DialogTitle>
          </DialogHeader>
        </div>

        <div className="sm:p-5 p-4 overflow-y-auto custom-scrollbar max-h-106.25">
          <div className="mb-5 p-6 pt-2 bg-emerald-50/30 dark:bg-(--page-body-bg) rounded-lg border border-emerald-100 dark:border-none shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="h-20 w-20 text-primary" />
            </div>
            <div className="relative z-10 flex justify-between flex-wrap gap-2 sm:gap-0 items-start mb-6 border-b border-emerald-100/50 dark:border-(--card-border-color)">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">{t("selected_plan_label")}</p>
                <h4 className="text-xl font-black text-slate-900 dark:text-white capitalize">{selectedPlan?.name}</h4>
              </div>
              <div className="text-right [@media(max-width:497px)]:ml-auto">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">{t("total_amount_label")}</p>
                <div className="text-3xl font-black text-primary flex items-center justify-end">
                  <CurrencyValue amount={selectedPlan?.price || 0} fromCode={selectedPlan?.currency?.code || "USD"} fallbackSymbol={selectedPlan?.currency.symbol} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-gray-500">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-primary">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
                <span className="dark:text-gray-400">{t("unlimited_messages_desc")}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-gray-500">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
                <span className="dark:text-gray-400">{t("infra_priority_desc")}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">{t("payment_method_title")}</Label>
            <div className="grid grid-cols-1 [@media(min-width:525px)_and_(max-width:639px)]:grid-cols-2 sm:grid-cols-4 gap-4">
              {PAYMENTMETHODLIST.map((method) => (
                <button key={method.id} onClick={() => setPaymentMethod(method.id as string)} className={cn("flex flex-col items-center text-center p-6 border rounded-lg transition-all duration-300 group relative", paymentMethod === method.id ? "border-primary bg-emerald-500/5" : "border-slate-100 dark:border-(--card-border-color) bg-white dark:bg-(--table-hover) dark:hover:border-(--card-border-color) hover:border-slate-200")}>
                  <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300", paymentMethod === method.id ? "bg-primary text-white shadow-lg shadow-emerald-500/20 scale-110" : "bg-slate-50 dark:bg-(--dark-body) text-slate-400 group-hover:bg-(--card-color)")}>
                    <method.icon className="h-6 w-6" />
                  </div>
                  <span className={cn("text-sm font-black mb-1", paymentMethod === method.id ? "text-slate-900 dark:text-white" : "text-slate-500")}>{method.name}</span>
                  <p className="text-[10px] font-bold text-slate-400 leading-tight">{method.description}</p>

                  {paymentMethod === method.id && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-emerald-600 text-white p-1 rounded-full animate-in zoom-in-50">
                        <CheckCircle2 className="h-3 w-3" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 flex-wrap flex gap-4">
          <Button variant="ghost" className="flex-1 h-12 font-semibold bg-slate-100 dark:bg-(--page-body-bg) text-xs tracking-widest text-slate-500 px-4.5 py-5 hover:bg-slate-200/50 rounded-lg" onClick={onClose} disabled={isLoading}>
            {t("go_back_btn")}
          </Button>
          <Button className="flex-1 h-12 bg-primary text-white font-semibold text-xs tracking-widest rounded-lg active:scale-[0.98] transition-all px-4.5 py-5" onClick={handlePay} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : t("complete_purchase_btn")}
          </Button>
        </div>
      </DialogContent>

      <ManualPaymentModal isOpen={isManualModalOpen} onClose={handleManualPaymentSubmit} selectedPlan={selectedPlan} />
    </Dialog>
  );
};

export default SubscriptionModal;
