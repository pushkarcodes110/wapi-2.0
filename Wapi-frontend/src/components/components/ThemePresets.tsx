"use client";

import React from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { FormValues, ThemePreset } from "@/src/types/chatTheme";

const DEFAULT_THEMES: ThemePreset[] = [
  { id: 1, type: "light", name: "Classic WA", bg_color: "#E5DDD5", user_bubble: "#DCF8C6", contact_bubble: "var(--background)", theme_color: "#128C7E" },
  { id: 2, type: "light", name: "Soft Rose", bg_color: "#FFF5F7", user_bubble: "#FFE4E8", contact_bubble: "var(--background)", theme_color: "#E91E63" },
  { id: 3, type: "light", name: "Sky Blue", bg_color: "#F0F9FF", user_bubble: "#E0F2FE", contact_bubble: "var(--background)", theme_color: "#0EA5E9" },
  { id: 4, type: "light", name: "Mint Green", bg_color: "var(--feature-card-border)", user_bubble: "#DCFCE7", contact_bubble: "var(--background)", theme_color: "#22C55E" },
  { id: 5, type: "light", name: "Creamy Yellow", bg_color: "#FFFBEB", user_bubble: "#FEF3C7", contact_bubble: "var(--background)", theme_color: "#F59E0B" },
  { id: 6, type: "light", name: "Lavender Mist", bg_color: "#F5F3FF", user_bubble: "#EDE9FE", contact_bubble: "var(--background)", theme_color: "#8B5CF6" },
  { id: 7, type: "light", name: "Peach Sorbet", bg_color: "#FFF7ED", user_bubble: "#FFEDD5", contact_bubble: "var(--background)", theme_color: "#F97316" },
  { id: 8, type: "light", name: "Cool Grey", bg_color: "#F8FAFC", user_bubble: "var(--light-background)", contact_bubble: "var(--background)", theme_color: "#64748B" },
  { id: 9, type: "light", name: "Sage Garden", bg_color: "#F7FEE7", user_bubble: "#ECFCCB", contact_bubble: "var(--background)", theme_color: "#84CC16" },
  { id: 10, type: "light", name: "Vanilla Blush", bg_color: "#FEF2F2", user_bubble: "#FEE2E2", contact_bubble: "var(--background)", theme_color: "#EF4444" },
  { id: 11, type: "dark", name: "Dark WA", bg_color: "#0B141A", user_bubble: "#005C4B", contact_bubble: "#202C33", theme_color: "#00A884" },
  { id: 12, type: "dark", name: "Midnight Pitch", bg_color: "#020617", user_bubble: "#1E293B", contact_bubble: "#0F172A", theme_color: "#38BDF8" },
  { id: 13, type: "dark", name: "Deep Forest", bg_color: "#052E16", user_bubble: "#14532D", contact_bubble: "#064E3B", theme_color: "#10B981" },
  { id: 14, type: "dark", name: "Dark Garnet", bg_color: "#2D0A0A", user_bubble: "#450A0A", contact_bubble: "#1A0505", theme_color: "#F43F5E" },
  { id: 15, type: "dark", name: "Night Violet", bg_color: "#1E1B4B", user_bubble: "#312E81", contact_bubble: "#171717", theme_color: "#818CF8" },
  { id: 16, type: "dark", name: "Slate Carbon", bg_color: "#0F172A", user_bubble: "#334155", contact_bubble: "#1E293B", theme_color: "#94A3B8" },
  { id: 17, type: "dark", name: "Obsidian", bg_color: "#000000", user_bubble: "#18181B", contact_bubble: "#27272A", theme_color: "#FAFAFA" },
  { id: 18, type: "dark", name: "Coffee Husk", bg_color: "#1C1917", user_bubble: "#44403C", contact_bubble: "#292524", theme_color: "#D6D3D1" },
  { id: 19, type: "dark", name: "Deep Teal", bg_color: "#042F2E", user_bubble: "#134E4A", contact_bubble: "#0F172A", theme_color: "#2DD4BF" },
  { id: 20, type: "dark", name: "Royal Dark", bg_color: "#2E1065", user_bubble: "#4C1D95", contact_bubble: "#171717", theme_color: "#A855F7" },
];

interface ThemePresetsProps {
  t: (key: string) => string;
  presetType: "light" | "dark";
  setPresetType: (type: "light" | "dark") => void;
  formValues: FormValues;
  bgType: "color" | "image";
  handleThemeSelect: (theme: ThemePreset) => void;
  onResetDefault: () => void;
}

const ThemePresets: React.FC<ThemePresetsProps> = ({ t, presetType, setPresetType, formValues, bgType, handleThemeSelect, onResetDefault }) => {
  return (
    <section className="bg-white dark:bg-(--card-color) sm:p-5 p-4 rounded-lg border border-slate-100 dark:border-(--card-border-color) shadow-sm">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-xl font-medium text-slate-800 dark:text-white ">{t("default_presets") || "Default Presets"}</h2>
        <div className="flex items-center gap-3">
          <button onClick={onResetDefault} className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors bg-slate-100 dark:bg-white/5 py-1.5 px-3 rounded-lg border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30">
            Reset to Default
          </button>
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg">
            <button onClick={() => setPresetType("light")} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${presetType === "light" ? "bg-primary text-white shadow-sm" : "text-slate-500"}`}>
              Light
            </button>
            {/* <button 
            onClick={() => setPresetType("dark")}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${presetType === "dark" ? "bg-primary text-white shadow-sm" : "text-slate-500"}`}
          >
            Dark
          </button> */}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {DEFAULT_THEMES.filter((t) => t.type === presetType).map((theme) => (
          <motion.div key={theme.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleThemeSelect(theme)} className={`relative cursor-pointer rounded-lg overflow-hidden aspect-square border-2 transition-all ${formValues.theme_color === theme.theme_color && formValues.bg_color === theme.bg_color && bgType === "color" ? "shadow-lg" : "border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"}`} style={formValues.theme_color === theme.theme_color && formValues.bg_color === theme.bg_color && bgType === "color" ? { borderColor: theme.theme_color, boxShadow: `0 10px 15px -3px color-mix(in srgb, ${theme.theme_color}, transparent 80%)` } : {}} title={theme.name}>
            <div className="w-full h-full flex flex-col" style={{ backgroundColor: theme.bg_color }}>
              <div className="flex-1 flex flex-col p-2 gap-1.5">
                <div className="w-4/5 h-2.5 rounded-full self-start opacity-90 shadow-sm" style={{ backgroundColor: theme.contact_bubble }}></div>
                <div className="w-4/5 h-2.5 rounded-full self-end opacity-90 shadow-sm" style={{ backgroundColor: theme.user_bubble }}></div>
              </div>
              <div className="h-3 w-full" style={{ backgroundColor: theme.theme_color }}></div>
              <p className="px-2 py-1 text-[12px] text-slate-600 bg-white border border-slate-200">{theme.name}</p>
            </div>
            {formValues.theme_color === theme.theme_color && formValues.bg_color === theme.bg_color && bgType === "color" && (
              <div className="absolute inset-0 backdrop-blur-[0.5px] flex items-center justify-center" style={{ backgroundColor: `color-mix(in srgb, ${theme.theme_color}, transparent 90%)` }}>
                <div className="bg-white rounded-full p-2 shadow-xl border-2" style={{ borderColor: `color-mix(in srgb, ${theme.theme_color}, transparent 50%)`, backgroundColor: theme.theme_color }}>
                  <Check size={20} className="text-white" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ThemePresets;
