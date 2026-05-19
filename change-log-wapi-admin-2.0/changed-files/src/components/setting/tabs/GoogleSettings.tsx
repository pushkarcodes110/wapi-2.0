"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { AppSettings } from "@/src/redux/api/settingApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { updateSettingField } from "@/src/redux/reducers/settingsSlice";
import { useTranslation } from "react-i18next";
import SettingCard from "../shared/SettingCard";

const GoogleSettings = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings.data);

  const onChange = (key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => {
    dispatch(updateSettingField({ key, value }));
  };

  return (
    <div className="space-y-5">
      <SettingCard
        title={t("settings_google_info")}
        description={t("settings_google_info_desc")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 flex flex-col md:col-span-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("settings_google_client_id")}</Label>
            <Input
              type={"text"}
              value={settings.google_client_id ?? ""}
              onChange={(e) => onChange("google_client_id", e.target.value)}
              placeholder="Your Google Client ID"
              className={`h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3`}
            />
          </div>
          <div className="space-y-1.5 flex flex-col md:col-span-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("settings_google_client_secret")}</Label>
            <Input
              type={"text"}
              value={settings.google_client_secret ?? ""}
              onChange={(e) => onChange("google_client_secret", e.target.value)}
              placeholder="Your Google Client Secret"
              className={`h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3`}
            />
          </div>
          <div className="space-y-1.5 flex flex-col md:col-span-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("settings_google_redirect_uri")}</Label>
            <Input
              type={"text"}
              value={settings.google_redirect_uri ?? ""}
              onChange={(e) => onChange("google_redirect_uri", e.target.value)}
              placeholder="https://yourdomain.com/api/auth/google/callback"
              disabled
              className={`h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3`}
            />
          </div>
        </div>
      </SettingCard>
    </div>
  );
};

export default GoogleSettings;
