import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppSettings } from "../api/settingApi";

interface SettingsState {
  data: Partial<AppSettings>;
  errors: Record<string, string>;
  isDirty: boolean;
  pageTitle: string;
}

const initialState: SettingsState = {
  data: {},
  errors: {},
  isDirty: false,
  pageTitle: "",
};

const normalizeLegacySettings = (settings: Partial<AppSettings>) => {
  const normalized = { ...settings };

  if (normalized.app_name?.trim().toLowerCase() === "wapi") {
    normalized.app_name = "Synqzy";
  }

  if (normalized.app_description?.trim().toLowerCase() === "whatsapp marketing platform") {
    normalized.app_description = "Synqzy admin portal for WhatsApp automation, CRM, campaigns, and business messaging.";
  }

  if (normalized.favicon_url?.replace(/\\/g, "/").toLowerCase().endsWith("/uploads/attachments/favicon.png")) {
    normalized.favicon_url = "/assets/logos/app.png";
  }

  return normalized;
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      state.data = normalizeLegacySettings(action.payload);
      state.isDirty = false;
      state.errors = {};
    },
    updateSettingField: (state, action: PayloadAction<{ key: keyof AppSettings; value: AppSettings[keyof AppSettings] | string }>) => {
      state.data = { ...state.data, [action.payload.key]: action.payload.value };
      state.isDirty = true;
    },
    updateSettingError: (state, action: PayloadAction<{ key: string; error: string | null }>) => {
      if (action.payload.error) {
        state.errors[action.payload.key] = action.payload.error;
      } else {
        delete state.errors[action.payload.key];
      }
    },
    resetDirty: (state) => {
      state.isDirty = false;
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    },
  },
});

export const { setSettings, updateSettingField, updateSettingError, resetDirty, setPageTitle } = settingsSlice.actions;
export default settingsSlice.reducer;
