"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { FormValues } from "@/src/types/chatTheme";

interface BackgroundSettingsProps {
  t: (key: string) => string;
  bgType: "color" | "image";
  setBgType: (type: "color" | "image") => void;
  formValues: FormValues;
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  handleColorChange: (key: keyof FormValues, value: string) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
}

const BackgroundSettings: React.FC<BackgroundSettingsProps> = ({ t, bgType, setBgType, formValues, imagePreview, setImagePreview, handleColorChange, handleImageChange, setFormValues }) => {
  return (
    <section className="bg-white dark:bg-(--card-color) sm:p-5 p-4 rounded-lg border border-slate-100 dark:border-(--card-border-color) shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-slate-800 dark:text-white ">{t("background") || "Background"}</h2>
        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg">
          <button onClick={() => setBgType("color")} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${bgType === "color" ? "bg-white dark:bg-primary text-primary dark:text-white shadow-sm" : "text-slate-500"}`}>
            Color
          </button>
          <button onClick={() => setBgType("image")} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${bgType === "image" ? "bg-white dark:bg-primary text-primary dark:text-white shadow-sm" : "text-slate-500"}`}>
            Image
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {bgType === "color" ? (
          <motion.div key="color" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
            <p className="text-sm font-bold text-slate-700 dark:text-white">{t("bg_color") || "Background Color"}</p>
            <input type="color" value={formValues.bg_color || "var(--background)"} onChange={(e) => handleColorChange("bg_color", e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
          </motion.div>
        ) : (
          <motion.div key="image" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
            <div className="relative group aspect-video rounded-xl overflow-hidden border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center bg-slate-50 dark:bg-white/2">
              {imagePreview ? (
                <>
                  <Image src={imagePreview} alt="Preview" width={100} height={100} className="w-full h-full object-cover" unoptimized />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="cursor-pointer bg-white text-black p-2 rounded-full hover:scale-110 transition-transform">
                      <Upload size={18} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setFormValues((p) => ({ ...p, bg_image: null }));
                      }}
                      className="bg-white text-rose-500 p-2 rounded-full hover:scale-110 transition-transform"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                  <ImageIcon size={32} className="text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-400">Click to upload image</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
            <p className="text-[10px] text-center text-slate-400">High quality images work best for backgrounds.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BackgroundSettings;
