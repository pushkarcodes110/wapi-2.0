"use client";

import { useChatTheme } from "@/src/hooks/useChatTheme";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { openPreview } from "@/src/redux/reducers/previewSlice";
import Images from "@/src/shared/Image";
import { MediaType, ProfileMediaAssetsProps } from "@/src/types/components/chat";
import { ChevronDown, ChevronUp, FileText, ImageIcon, MapPin, Maximize2, Mic, PlayCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ProfileMediaAssets = ({ media }: ProfileMediaAssetsProps) => {
  const {t} = useTranslation();
  const { isCustom } = useChatTheme();
  const dispatch = useAppDispatch();
  const [openAccordion, setOpenAccordion] = useState<MediaType | null>("images");
  const { userSetting } = useAppSelector((state) => state.setting);
  const userSettingData = userSetting?.data;

  const handleImageClick = (imageUrl: string) => {
    const allImages = Object.values(media || {})
      .flatMap((week) => week.images || [])
      .map((item) => item.fileUrl);

    const index = allImages.indexOf(imageUrl);
    dispatch(openPreview({ images: allImages, index: index >= 0 ? index : 0 }));
  };

  const tabs = [
    { id: "images", icon: <ImageIcon size={18} />, label: "Images" },
    { id: "documents", icon: <FileText size={18} />, label: "Files" },
    { id: "locations", icon: <MapPin size={18} />, label: "Location" },
    { id: "audios", icon: <Mic size={18} />, label: "Audio" },
    { id: "videos", icon: <PlayCircle size={18} />, label: "Videos" },
  ];

  const mediaWeeks = Object.values(media || {});

  const getMediaForType = (type: MediaType) => {
    return mediaWeeks
      .map((weekGroup) => ({
        week: weekGroup.week,
        items: weekGroup[type] || [],
      }))
      .filter((group) => group.items.length > 0);
  };

  const getCountForType = (type: MediaType) => {
    return mediaWeeks.reduce((acc, weekGroup) => {
      return acc + (weekGroup[type]?.length || 0);
    }, 0);
  };

  return (
    <div className="dark:border-none dark:bg-(--table-hover)! p-5 space-y-4" style={isCustom ? { backgroundColor: "color-mix(in srgb, var(--chat-theme-color), transparent 95%)" } : {}}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
          <ImageIcon size={18} style={isCustom ? { color: userSettingData?.theme_color == "null" ? "var(--primary)" : "var(--chat-theme-color)" } : {}} />
          <span>{t("media_profile")}</span>
        </div>
      </div>

      <div className="space-y-2">
        {tabs.map((tab) => {
          const type = tab.id as MediaType;
          const isOpen = openAccordion === type;
          const items = getMediaForType(type);
          const count = getCountForType(type);

          return (
            <div key={type} className="border border-slate-100 dark:border-neutral-800 rounded-xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => setOpenAccordion(isOpen ? null : type)}
                className={`w-full flex items-center justify-between p-3 transition-colors ${isOpen ? "bg-slate-50 dark:bg-neutral-800/50" : "hover:bg-slate-50 dark:hover:bg-neutral-800/30"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${isOpen ? "bg-white dark:bg-neutral-800 shadow-sm" : "bg-slate-100 dark:bg-neutral-900"}`}
                    style={isOpen && isCustom ? { color: userSettingData?.theme_color == "null" ? "var(--primary)" : "var(--chat-theme-color)" } : {}}
                  >
                    {tab.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{tab.label}</p>
                    <p className="text-xs text-slate-400 font-medium">{count} items</p>
                  </div>
                </div>
                {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
              </button>

              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100 p-3" : "max-h-0 opacity-0"}`}>
                {items.length > 0 ? (
                  <div className="space-y-4">
                    {items.map((group, idx) => (
                      <div key={idx} className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">{group.week}</p>
                        <div className="grid grid-cols-3 gap-2">
                          {group.items.map((item) => (
                            <div key={item.id} className="aspect-square rounded-lg bg-slate-100 dark:bg-neutral-800 overflow-hidden cursor-pointer relative group" onClick={() => type === "images" && handleImageClick(item.fileUrl)}>
                              {type === "images" ? (
                                <>
                                  <Images src={item.fileUrl} alt="Media" fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Maximize2 size={24} className="text-white scale-75 group-hover:scale-100 transition-transform duration-300" />
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">{tab.icon}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center gap-3 bg-slate-50/30 dark:bg-neutral-900/30 rounded-lg border border-dashed border-slate-200 dark:border-neutral-800">
                    <p className="text-sm font-medium text-slate-400 italic">No {tab.label.toLowerCase()} found</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileMediaAssets;
