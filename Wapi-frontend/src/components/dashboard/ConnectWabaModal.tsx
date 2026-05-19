/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { cn } from "@/src/lib/utils";
import { useConnectionMutation } from "@/src/redux/api/whatsappApi";
import { useAppSelector } from "@/src/redux/hooks";
import { ConnectWabaModalProps } from "@/src/types/dashboard";
import { useEmbeddedSignup } from "@/src/utils/hooks/useEmbeddedSignup";
import { MessageCircle, QrCode, Settings2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const ConnectWabaModal = ({ isOpen, onClose }: ConnectWabaModalProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connection] = useConnectionMutation();
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);

  const handleFinish = useCallback(
    async (code: string, signupData: any) => {
      try {
        setIsConnecting(true);
        await connection({ code, signupData, workspace_id: selectedWorkspace?._id }).unwrap();
        toast.success(t("connect_success"));
        onClose();
      } catch (error: any) {
        toast.error(error?.data?.message || t("failed_to_connect_waba"));
      } finally {
        setIsConnecting(false);
      }
    },
    [connection, selectedWorkspace?._id, onClose, t]
  );

  const { startSignup, fbReady } = useEmbeddedSignup(handleFinish);

  const options = [
    {
      id: "embedded",
      title: t("embedded_signup"),
      description: t("embedded_signup_desc"),
      icon: <ShieldCheck className="text-primary" size={24} />,
      onClick: startSignup,
      disabled: !fbReady || isConnecting,
      badge: t("official"),
    },
    {
      id: "qrcode",
      title: t("qr_code_baileys"),
      description: t("qr_code_baileys_desc"),
      icon: <QrCode className="text-amber-500" size={24} />,
      onClick: () => {
        router.push(`${ROUTES.WABAConnection}?tab=qrcode`);
        onClose();
      },
      badge: t("quick"),
    },
    {
      id: "manual",
      title: t("manual_cloud_api"),
      description: t("manual_cloud_api_desc"),
      icon: <Settings2 className="text-blue-500" size={24} />,
      onClick: () => {
        router.push(`${ROUTES.WABAConnection}?tab=manual`);
        onClose();
      },
      badge: t("advanced"),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-125 p-0! overflow-hidden border-none bg-white dark:bg-(--card-color) rounded-2xl">
        <DialogHeader className="sm:p-6 p-4 pb-0!">
          <DialogTitle className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <MessageCircle className="text-primary" size={24} />
            {t("choose_connection_method")}
          </DialogTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("select_connection_desc")}</p>
        </DialogHeader>

        <div className="sm:p-6 p-4 space-y-4">
          {options.map((option) => (
            <button key={option.id} onClick={option.onClick} disabled={option.disabled} className={cn("w-full flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--dark-sidebar)/50 text-left transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:scale-[1.01] group active:scale-[0.99]", option.disabled && "opacity-50 cursor-not-allowed hover:scale-100 hover:bg-transparent")}>
              <div className="mt-1 p-2.5 rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-100 dark:border-(--card-border-color) group-hover:bg-primary/10 transition-colors">{option.icon}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 dark:text-gray-200">{option.title}</h4>
                  <span className={cn("text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border", option.id === "embedded" ? "bg-primary/10 text-primary border-primary/20" : option.id === "qrcode" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20")}>{option.badge}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{option.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-slate-50 dark:bg-(--dark-sidebar) p-4 flex justify-end gap-3 border-t border-slate-100 dark:border-(--card-border-color)">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            {t("cancel")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWabaModal;
