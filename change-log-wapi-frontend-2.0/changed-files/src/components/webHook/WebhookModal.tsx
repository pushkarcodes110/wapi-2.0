"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { Webhook, WebhookModalProps } from "@/src/types/webhook";
import { cn } from "@/src/utils";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const WebhookModal = ({ isOpen, onClose, onSubmit, webhook, isLoading }: WebhookModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<Webhook>>({
    webhook_name: "",
    config: {
      is_active: true,
      require_auth: false,
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [prevWebhook, setPrevWebhook] = useState<Webhook | undefined>(webhook);

  if (webhook !== prevWebhook) {
    setPrevWebhook(webhook);
    setFormData(
      webhook
        ? {
            webhook_name: webhook.webhook_name || "",
            config: {
              is_active: webhook.config?.is_active ?? true,
              require_auth: webhook.config?.require_auth ?? false,
            },
          }
        : {
            webhook_name: "",
            config: {
              is_active: true,
              require_auth: false,
            },
          }
    );
  }

  const handleValidation = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.webhook_name?.trim()) {
      newErrors.webhook_name = t("webhook_name_required");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleValidation()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25 dark:bg-(--card-color)">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{webhook ? t("edit_webhook") : t("create_webhook")}</DialogTitle>
            <DialogDescription>{webhook ? t("webhook_modal_edit_desc") : t("webhook_modal_create_desc")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className={cn(errors.webhook_name && "text-red-500")}>
                {t("webhook_name_label")}
              </Label>
              <Input
                id="name"
                placeholder={t("webhook_name_placeholder")}
                value={formData.webhook_name || ""}
                onChange={(e) => {
                  setFormData({ ...formData, webhook_name: e.target.value });
                  if (errors.webhook_name) setErrors({ ...errors, webhook_name: "" });
                }}
                className={cn(errors.webhook_name && "border-red-500 focus:ring-red-500")}
              />
              {errors.webhook_name && <p className="text-[10px] text-red-500 font-medium ml-1">{errors.webhook_name}</p>}
            </div>
            <div className={cn("flex items-center justify-between rounded-lg border p-4 dark:bg-(--dark-body) dark:border-none", isLoading ? "cursor-not-allowed" : "cursor-pointer")}>
              <div className="space-y-0.5">
                <Label className="text-base">{t("require_auth")}</Label>
                <div className="text-sm text-slate-500 dark:text-gray-400">{t("require_auth_desc")}</div>
              </div>
              <Switch
                checked={formData.config?.require_auth || false}
                disabled={isLoading}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    config: {
                      is_active: formData.config?.is_active ?? true,
                      require_auth: checked,
                    },
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button className="dark:bg-(--page-body-bg) dark:border-none" type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {t("cancel")}
            </Button>
            <Button className="dark:text-white" type="submit" disabled={isLoading}>
              {isLoading ? t("saving") : webhook ? t("update_webhook") : t("create_webhook")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WebhookModal;
