"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { AppSettings } from "@/src/redux/api/settingApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { updateSettingField } from "@/src/redux/reducers/settingsSlice";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import SettingCard from "../shared/SettingCard";
import SettingToggle from "../shared/SettingToggle";

const AWSSettings = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings.data);
  const [showSecret, setShowSecret] = useState(false);

  const onChange = (key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => {
    dispatch(updateSettingField({ key, value }));
  };

  return (
    <div className="space-y-5">
      <SettingCard
        title={t("settings_aws_info")}
        description={t("settings_aws_info_desc")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 flex flex-col md:col-span-2">
            <SettingToggle
              label={t("settings_is_aws_s3_enabled")}
              description={t("settings_is_aws_s3_enabled_desc")}
              checked={!!settings.is_aws_s3_enabled}
              onCheckedChange={(checked) => onChange("is_aws_s3_enabled", checked)}
            />
          </div>

          <div className="space-y-1.5 flex flex-col md:col-span-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("settings_aws_access_key_id")}</Label>
            <Input
              type={"text"}
              value={settings.aws_access_key_id ?? ""}
              onChange={(e) => onChange("aws_access_key_id", e.target.value)}
              placeholder="Your AWS Access Key ID"
              className={`h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3`}
            />
          </div>

          <div className="space-y-1.5 flex flex-col md:col-span-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("settings_aws_secret_access_key")}</Label>
            <div className="relative">
              <Input
                type={showSecret ? "text" : "password"}
                value={settings.aws_secret_access_key ?? ""}
                onChange={(e) => onChange("aws_secret_access_key", e.target.value)}
                placeholder={settings.aws_secret_access_key_set ? "••••••••••••••••" : "Your AWS Secret Access Key"}
                className={`h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
             {settings.aws_secret_access_key_set && (
              <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                Note: A secret key is already set. Leave empty to keep existing.
              </p>
            )}
          </div>

          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("settings_aws_region")}</Label>
            <Input
              type={"text"}
              value={settings.aws_region ?? ""}
              onChange={(e) => onChange("aws_region", e.target.value)}
              placeholder="e.g. us-east-1"
              className={`h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3`}
            />
          </div>

          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("settings_aws_s3_bucket")}</Label>
            <Input
              type={"text"}
              value={settings.aws_s3_bucket ?? ""}
              onChange={(e) => onChange("aws_s3_bucket", e.target.value)}
              placeholder="Your S3 Bucket Name"
              className={`h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3`}
            />
          </div>
        </div>
      </SettingCard>
    </div>
  );
};

export default AWSSettings;
