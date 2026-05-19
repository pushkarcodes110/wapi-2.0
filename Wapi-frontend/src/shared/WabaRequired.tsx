"use client";

import { Button } from "@/src/elements/ui/button";
import { ArrowLeft, Phone, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/redux/hooks";
import React from "react";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../constants";

interface WabaRequiredProps {
  title?: string;
  description?: string;
  className?: string;
}
 
const WabaRequired: React.FC<WabaRequiredProps> = ({ title, description, className = "" }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const isAgent = user?.role === "agent";
 
  const displayTitle = isAgent ? t("access_restricted") : title || t("waba_connection_required");
  const displayDescription = isAgent ? t("agent_waba_required_desc") : description || t("waba_required_desc");

  return (
    <div className={`space-y-8 h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center ${className}`}>
      <div className="max-w-md space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto border-2 border-amber-100 dark:border-amber-900/40 shadow-inner">
          <ShieldAlert size={40} className="text-amber-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{displayTitle}</h2>
          <p className="text-slate-500 dark:text-gray-400 font-medium leading-relaxed">{displayDescription}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isAgent && (
            <Button onClick={() => router.push(ROUTES.WABAConnection)} className="bg-primary text-white h-12 px-8 rounded-xl font-bold flex items-center gap-2 group shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <Phone size={18} className="group-hover:rotate-12 transition-transform" />
              {t("connect_waba_now")}
            </Button>
          )}
          <Button variant="outline" onClick={() => router.back()} className="h-12 px-6 rounded-xl font-bold flex items-center gap-2 border-slate-200 dark:border-white/10 dark:hover:bg-white/5 transition-all">
            <ArrowLeft size={18} />
            {t("go_back")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WabaRequired;
