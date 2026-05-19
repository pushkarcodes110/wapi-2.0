"use client";

import { useAppSelector } from "@/src/redux/hooks";
import { QuickReply } from "@/src/redux/api/quickReplyApi";
import { format } from "date-fns";
import { Edit2, Star, Trash2, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/src/elements/ui/checkbox";
import Can from "../shared/Can";

interface QuickReplyCardProps {
  item: QuickReply;
  onEdit: (item: QuickReply) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  isLoading: boolean;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

const QuickReplyCard = ({
  item,
  onEdit,
  onDelete,
  onToggleFavorite,
  isLoading,
  isSelected,
  onSelect,
}: QuickReplyCardProps) => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state: any) => state.auth);

  const isOwner = item.user_id === user?.id;
  const canEdit = isOwner;
  const canDelete = isOwner;
  const canSelect = isOwner; // Only allow selecting own replies for bulk delete

  return (
    <div className={`group relative bg-white dark:bg-(--card-color) border ${isSelected ? "border-primary shadow-sm" : "border-slate-200 dark:border-(--card-border-color)"} rounded-lg p-4 hover:shadow-md dark:hover:shadow-none hover:border-primary/30 transition-all duration-200`}>
      {/* Selection Checkbox */}
      {canSelect && onSelect && (
        <div className="absolute top-3 left-3 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(item._id, checked === true)}
          />
        </div>
      )}

      {/* Favorite + admin badge */}
      <div className={`flex items-start justify-between gap-2 mb-3 ${canSelect ? "ml-6" : ""}`}>
        <div className="flex items-center gap-2 flex-wrap">
          {item.is_admin_reply && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
              <Shield size={10} />
              {t("quick_reply_admin_badge")}
            </span>
          )}
          {isOwner && !item.is_admin_reply && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
              {t("quick_reply_my_reply")}
            </span>
          )}
        </div>
        <Can permission="update.quick_replies">
          <button
            onClick={() => onToggleFavorite(item._id)}
            disabled={isLoading}
            className={`shrink-0 transition-colors disabled:opacity-50 ${item.is_favorite
              ? "text-amber-400 hover:text-amber-500"
              : "text-slate-300 hover:text-amber-400 dark:text-slate-600 dark:hover:text-amber-400"
            }`}
            title={item.is_favorite ? t("quick_reply_unfavorite") : t("quick_reply_favorite")}
          >
            <Star size={16} fill={item.is_favorite ? "currentColor" : "none"} />
          </button>
        </Can>
      </div>

      {/* Content */}
      <p
        className="text-sm text-slate-700 dark:text-slate-200 cursor-pointer hover:text-primary transition-colors leading-relaxed break-all whitespace-normal line-clamp-2"
        onClick={() => canEdit && onEdit(item)}
        title={item.content}
      >
        {item.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-(--card-border-color)">
        <span className="text-[11px] text-slate-400 dark:text-gray-500">
          {item.createdAt ? format(new Date(item.createdAt), "MMMM d, yyyy") : ""}
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {canEdit && (
            <Can permission="update.quick_replies">
              <button
                onClick={() => onEdit(item)}
                disabled={isLoading}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-all disabled:opacity-50"
                title={t("edit")}
                >
                <Edit2 size={14} />
              </button>
            </Can>
          )}
          {canDelete && (
            <Can permission="delete.quick_replies">
              <button
                onClick={() => onDelete(item._id)}
                disabled={isLoading}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                title={t("delete")}
              >
                <Trash2 size={14} />
              </button>
            </Can>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickReplyCard;
