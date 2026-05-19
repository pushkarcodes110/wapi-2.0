"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { useOverrideSubscriptionLimitsMutation } from "@/src/redux/api/subscriptionApi";
import { User } from "@/src/types/store";
import { Loader2, ShieldAlert, Info } from "lucide-react";
import { toast } from "sonner";
import { booleanFeatures, numericFeatures } from "@/src/data/Plans";

interface OverrideLimitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const OverrideLimitsModal = ({ isOpen, onClose, user }: OverrideLimitsModalProps) => {
  const { t } = useTranslation();
  const [features, setFeatures] = useState<Record<string, string | boolean>>({});
  const [overrideLimits, { isLoading }] = useOverrideSubscriptionLimitsMutation();

  const currentFeatures = (user?.current_subscription?.is_custom
    ? user?.current_subscription?.features
    : user?.current_plan?.features) as Record<string, unknown> | undefined;

  useEffect(() => {
    if (isOpen && currentFeatures) {
      const initial: Record<string, string | boolean> = {};
      numericFeatures.forEach(({ id }) => {
        const val = currentFeatures[id];
        initial[id] = val !== undefined ? String(val) : "";
      });
      booleanFeatures.forEach(({ id }) => {
        const val = currentFeatures[id];
        initial[id] = val !== undefined ? Boolean(val) : false;
      });
      setFeatures(initial);
    } else if (isOpen) {
      setFeatures({});
    }
  }, [isOpen, user, currentFeatures]);

  const handleNumericChange = (id: string, value: string) => {
    setFeatures((prev) => ({ ...prev, [id]: value }));
  };

  const handleBooleanChange = (id: string, val: boolean) => {
    setFeatures((prev) => ({ ...prev, [id]: val }));
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const parsed: Record<string, unknown> = {};
      numericFeatures.forEach(({ id }) => {
        const val = features[id];
        if (val !== "" && val !== undefined) {
          parsed[id] = parseInt(String(val), 10);
        }
      });
      booleanFeatures.forEach(({ id }) => {
        parsed[id] = Boolean(features[id]);
      });

      const result = await overrideLimits({ userId: user._id, features: parsed }).unwrap();
      if (result.success) {
        toast.success(result.message || t("subscription_override_success"));
        onClose();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || t("common_error"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! gap-0 bg-white dark:bg-(--card-color) border-none rounded-lg p-0! overflow-hidden shadow-2xl">
        <DialogHeader className="sm:p-6 p-4 pb-4 border-b border-slate-100 dark:border-(--card-border-color)">
          <DialogTitle className="font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-xl font-semibold">{t("subscription_override_limits_title")}</h4>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 font-normal">
                {t("subscription_override_limits_subtitle", { name: user?.name })}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="sm:p-6 p-4 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-6">
          {/* Info banner */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              {t("subscription_override_info", { defaultValue: "These values will override the user's plan limits." })}
            </p>
          </div>

          {/* Numeric limits */}
          <div>
            <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t("common_numeric_limits", { defaultValue: "Numeric Limits" })}</h5>
            <div className="grid sm:grid-cols-2 gap-3">
              {numericFeatures.map(({ id, label }) => (
                <div key={id} className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t(`plan_features_${id}`, { defaultValue: label })}</label>
                  <Input
                    type="number"
                    min={0}
                    placeholder={t("common_unchanged", { defaultValue: "Unchanged" })}
                    value={features[id] !== undefined ? String(features[id]) : ""}
                    onChange={(e) => handleNumericChange(id, e.target.value)}
                    className="h-9 bg-slate-50 dark:bg-page-body border-slate-200 dark:border-(--card-border-color) rounded-lg text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Boolean features */}
          <div>
            <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t("common_feature_toggles", { defaultValue: "Feature Toggles" })}</h5>
            <div className="grid sm:grid-cols-2 gap-3">
              {booleanFeatures.map(({ id, label }) => (
                <label
                  key={id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${features[id] ? "border-(--text-green-primary) bg-emerald-50/50 dark:bg-emerald-900/10" : "border-slate-100 dark:border-(--card-border-color)"}`}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-(--text-green-primary)"
                    checked={Boolean(features[id])}
                    onChange={(e) => handleBooleanChange(id, e.target.checked)}
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t(`plan_features_${id}`, { defaultValue: label })}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="sm:p-6 p-4 pt-0 flex gap-3 border-t border-slate-100 dark:border-(--card-border-color)">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-11 rounded-lg text-slate-600 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 dark:bg-page-body dark:hover:bg-(--table-hover) transition-all">
            {t("common_cancel")}
          </Button>
          <Button
            type="button"
            disabled={isLoading || !user?.current_plan}
            onClick={handleSave}
            className="flex-1 h-11 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("common_saving")}
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                {t("common_apply_override", { defaultValue: "Apply Override" })}
              </>
            )}
          </Button>
        </DialogFooter>
        {!user?.current_plan && (
          <p className="text-center text-xs text-red-500 pb-4">{t("common_no_active_subscription")}</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OverrideLimitsModal;
