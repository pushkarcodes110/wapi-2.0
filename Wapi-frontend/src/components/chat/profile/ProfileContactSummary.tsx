/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { useAppSelector } from "@/src/redux/hooks";
import { ProfileContactSummaryProps } from "@/src/types/components/chat";
import { getInitials } from "@/src/utils";
import { maskSensitiveData } from "@/src/utils/masking";
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useChatTheme } from "@/src/hooks/useChatTheme";
import ProfileChatLabel from "./ProfileChatLabel";

const getGymforceStatus = (status?: string) => {
  if (status === "found") {
    return {
      label: "Synced to Gymforce",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
      icon: CheckCircle2,
    };
  }

  if (status === "not_found") {
    return {
      label: "Not found in Gymforce",
      className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
      icon: Search,
    };
  }

  if (status === "multiple") {
    return {
      label: "Multiple Gymforce leads",
      className: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300",
      icon: Search,
    };
  }

  return {
    label: "Gymforce unavailable",
    className: "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-300",
    icon: AlertCircle,
  };
};

const ProfileContactSummary = ({ profileData, gymforceLookup, isLoadingGymforceLookup, onDelete, onOpenTagModal, onRemoveLabel }: ProfileContactSummaryProps) => {
  const { isCustom } = useChatTheme();
  const { user } = useAppSelector((state) => state.auth);
  const { app_name, is_demo_mode, userSetting } = useAppSelector((state) => state.setting);
  const userSettingData = userSetting?.data;

  const isAgent = user?.role === "agent";
  const contactName = profileData?.contact?.name?.trim();
  const phoneNumber = maskSensitiveData(profileData?.contact?.phone_number, "phone", is_demo_mode);
  const displayName = isAgent && user?.is_phoneno_hide ? "Customer" : contactName || phoneNumber;
  const shouldShowPhone = !isAgent || !user?.is_phoneno_hide;
  const shouldShowGymforce = Boolean(gymforceLookup?.enabled);
  const gymforceStatus = getGymforceStatus(gymforceLookup?.status);
  const GymforceIcon = gymforceStatus.icon;

  return (
    <div className="relative border-b dark:bg-(--table-hover)! dark:border-none border-gray-100 dark:border-(--card-border-color) p-5 mb-0 flex items-center justify-center flex-col" style={isCustom ? { backgroundColor: "color-mix(in srgb, var(--chat-theme-color), transparent 95%)" } : {}}>
      <div className="h-12 w-12 shrink-0 mb-4 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden" style={isCustom ? { backgroundColor: userSettingData?.bg_color == "null" ? "var(--primary)" : "var(--chat-theme-color)" } : { backgroundColor: userSettingData?.bg_color == "null" ? "var(--primary)" : "var(--primary)" }}>
        {profileData?.contact?.avatar ? <Image src={profileData?.contact?.avatar} alt={displayName || app_name || "W"} width={64} height={64} className="object-cover" unoptimized /> : getInitials(displayName || app_name || "W")}
      </div>
      <h3 className="max-w-full font-bold text-slate-900 dark:text-white truncate">{displayName}</h3>
      {contactName && shouldShowPhone && <p className="max-w-full text-sm text-slate-500 dark:text-gray-500 truncate">{phoneNumber}</p>}
      <p className="text-sm text-slate-500 dark:text-gray-500 truncate">{profileData?.contact?.status}</p>
      {shouldShowGymforce && (
        <div className="mt-4 flex w-full max-w-[260px] flex-col gap-2">
          <div className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold ${gymforceStatus.className}`}>
            {isLoadingGymforceLookup ? <Loader2 size={14} className="animate-spin" /> : <GymforceIcon size={14} />}
            <span className="truncate">{isLoadingGymforceLookup ? "Checking Gymforce" : gymforceStatus.label}</span>
          </div>
          {gymforceLookup?.open_url && (
            <Button asChild variant="outline" size="sm" className="h-8 w-full rounded-md text-xs">
              <a href={gymforceLookup.open_url} target="_blank" rel="noreferrer">
                <ExternalLink size={14} />
                Open in Gymforce
              </a>
            </Button>
          )}
        </div>
      )}
      {!isAgent && (
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-50 dark:bg-rose-400/30 dark:hover:bg-rose-500/10 rounded-lg" onClick={onDelete}>
          <Trash2 size={20} />
        </Button>
      )}
      <ProfileChatLabel labels={profileData?.tags?.map((t: any) => ({ id: t._id, name: t.label, color: t.color })) || []} onOpenModal={onOpenTagModal} onRemoveLabel={onRemoveLabel} />
    </div>
  );
};

export default ProfileContactSummary;
