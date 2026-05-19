"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Button } from "@/src/elements/ui/button";
import { useGetAllPlansQuery } from "@/src/redux/api/planApi";
import { useAssignPlanToUserMutation } from "@/src/redux/api/subscriptionApi";
import { User, Plan } from "@/src/types/store";
import { Loader2, Check, Package, CreditCard, Search, Clock } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Input } from "@/src/elements/ui/input";

interface AssignPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const AssignPlanModal = ({ isOpen, onClose, user }: AssignPlanModalProps) => {
  const { t } = useTranslation();
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [duration, setDuration] = useState<string>("1");
  const [durationError, setDurationError] = useState("");
  const { data: plansData, isLoading: plansLoading } = useGetAllPlansQuery({ is_active: true });
  const [assignPlan, { isLoading: isAssigning }] = useAssignPlanToUserMutation();

  useEffect(() => {
    if (isOpen) {
      if (user?.current_subscription?.duration !== undefined) {
        setDuration(String(user.current_subscription.duration));
      } else {
        setDuration("1");
      }
      
      if (user?.current_plan?._id) {
        setSelectedPlanId(user.current_plan._id);
      }
    }
  }, [isOpen, user]);

  const handleAssign = async () => {
    if (!user || !selectedPlanId) return;

    const d = parseInt(duration);
    if (isNaN(d) || d < 1 || d > 24) {
      toast.error(t("subscription_duration_invalid", { defaultValue: "Please enter a valid duration between 1 and 24" }));
      return;
    }

    try {
      const result = await assignPlan({
        user_id: user._id,
        plan_id: selectedPlanId,
        duration: d,
      }).unwrap();

      if (result.success) {
        toast.success(result.message || t("common_success"));
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.6 },
          zIndex: 9999,
          colors: ["var(--chart-indigo)", "var(--chart-purple)", "var(--chart-pink)", "var(--chart-warning)", "var(--text-green-primary)"],
        });
        onClose();
        setSelectedPlanId("");
        setDuration("1");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.data?.message || error.message || t("plan_error_assign"));
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedPlanId("");
    setDuration("1");
    setDurationError("");
    setSearchQuery("");
  };

  const activePlans = plansData?.data?.plans || [];
  const filteredPlans = activePlans.filter((plan: Plan) => plan.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const hasPlan = !!user?.current_plan;
  const selectedPlan = activePlans.find((p: Plan) => p._id === selectedPlanId);
  const isLifetime = selectedPlan?.billing_cycle === "lifetime";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg! max-w-[calc(100%-2rem)]! gap-0 bg-white dark:bg-(--card-color) border-none rounded-lg p-0! overflow-hidden shadow-2xl">
        <DialogHeader className="sm:p-6 p-4 pb-0">
          <DialogTitle className="font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
              <Package className="w-6 h-6 text-(--text-green-primary)" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-xl font-semibold">{hasPlan ? t("subscription_change_plan_title", { defaultValue: "Change User Plan" }) : t("subscription_assign_plan_title", { defaultValue: "Assign Plan to User" })}</h4>
              <p className="text-[13px] text-slate-500 dark:text-slate-400">
                {t("subscription_select_plan_for", { defaultValue: "Select a plan to assign to", name: user?.name })} <span className="font-semibold text-slate-900 dark:text-white">{user?.name}</span>
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="sm:px-6 px-4 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder={t("common_search_plans", { defaultValue: "Search plans by name..." })} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-10 bg-slate-50 dark:bg-page-body border-slate-100 dark:border-(--card-border-color) rounded-lg focus:ring-emerald-500/20 focus:border-(--text-green-primary) transition-all" />
          </div>
        </div>

        <div className="sm:p-6 p-4 pt-0 space-y-4 max-h-100 overflow-y-auto custom-scrollbar">
          {plansLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-(--text-green-primary)" />
              <p className="text-sm text-slate-500">{t("common_loading_plans", { defaultValue: "Loading plans..." })}</p>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500">{searchQuery ? t("common_no_plans_match", { defaultValue: "No plans match your search." }) : t("common_no_active_plans", { defaultValue: "No active plans available." })}</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredPlans.map((plan: Plan) => (
                <div key={plan._id} onClick={() => setSelectedPlanId(plan._id)} className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPlanId === plan._id ? "border-(--text-green-primary) bg-emerald-50/50 dark:bg-emerald-900/10" : "border-slate-100 dark:border-(--card-border-color) hover:border-emerald-200 dark:hover:border-emerald-800"}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{plan.name}</h4>
                      {user?.current_plan?._id === plan._id && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 font-medium">{t("common_current", { defaultValue: "Current" })}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold text-(--text-green-primary)">
                        {plan.currency?.symbol || "$"}
                        {plan.price}
                      </span>
                      <span className="text-xs text-slate-400 capitalize">/ {plan.billing_cycle}</span>
                    </div>
                  </div>
                  {selectedPlanId === plan._id && (
                    <div className="w-6 h-6 rounded-full bg-(--text-green-primary) flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Duration field – shown only when a non-lifetime plan is selected */}
        {selectedPlanId && !isLifetime && (
          <div className="sm:px-6 px-4 pb-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-page-body border border-slate-100 dark:border-(--card-border-color)">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg shrink-0">
                <Clock className="w-4 h-4 text-(--text-green-primary)" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("subscription_duration_label")}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">{t("subscription_duration_hint")}</p>
                <Input
                  type="number"
                  min={1}
                  max={24}
                  value={duration}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDuration(val);
                    if (val && parseInt(val) > 24) {
                      setDurationError(t("subscription_duration_max_error", { defaultValue: "Value exceeds 24" }));
                    } else if (val && parseInt(val) < 1) {
                      setDurationError(t("subscription_duration_min_error", { defaultValue: "Value must be at least 1" }));
                    } else {
                      setDurationError("");
                    }
                  }}
                  className={`h-9 w-32 bg-white dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) rounded-lg text-sm focus:ring-emerald-500/20 focus:border-(--text-green-primary) ${durationError ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                />
                {durationError && (
                  <p className="text-[10px] text-red-500 mt-1 font-medium">{durationError}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                {selectedPlan && (
                  <p className="text-sm font-semibold text-(--text-green-primary)">
                    {selectedPlan.currency?.symbol || "$"}{(selectedPlan.price * (parseInt(duration) || 0)).toFixed(2)}
                  </p>
                )}
                <p className="text-xs text-slate-400">{t("subscription_duration_total")}</p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="sm:p-6 p-4 pt-0 flex gap-3">
          <Button type="button" variant="ghost" onClick={handleClose} className="flex-1 h-11 rounded-lg text-slate-600 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 dark:bg-page-body dark:hover:bg-(--table-hover) transition-all">
            {t("common_cancel")}
          </Button>
          <Button
            type="button"
            disabled={
              isAssigning ||
              !selectedPlanId ||
              !!durationError ||
              (user?.current_plan?._id === selectedPlanId && parseInt(duration) === user?.current_subscription?.duration)
            }
            onClick={handleAssign} className="flex-1 h-11 bg-(--text-green-primary) hover:bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50">
            {isAssigning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("common_processing", { defaultValue: "Processing..." })}
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                {hasPlan ? t("common_change_plan", { defaultValue: "Change Plan" }) : t("common_assign_plan", { defaultValue: "Assign Plan" })}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignPlanModal;
