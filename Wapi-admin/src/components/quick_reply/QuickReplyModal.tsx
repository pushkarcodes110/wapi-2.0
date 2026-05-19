"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/elements/ui/alert-dialog";
import { Button } from "@/src/elements/ui/button";
import { Textarea } from "@/src/elements/ui/textarea";
import { Label } from "@/src/elements/ui/label";
import { Loader2, X } from "lucide-react";
import { Checkbox } from "@/src/elements/ui/checkbox";

interface QuickReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { content: string; is_admin_reply: boolean }) => void;
  editData?: { _id: string; content: string; is_admin_reply: boolean } | null;
  isLoading: boolean;
}

const QuickReplyModal = ({
  isOpen,
  onClose,
  onSave,
  editData,
  isLoading,
}: QuickReplyModalProps) => {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [isAdminReply, setIsAdminReply] = useState(true);

  useEffect(() => {
    if (editData) {
      setContent(editData.content);
      setIsAdminReply(editData.is_admin_reply);
    } else {
      setContent("");
      setIsAdminReply(true);
    }
  }, [editData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSave({ content: content.trim(), is_admin_reply: isAdminReply });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-lg! max-w-[calc(100%-2rem)]! sm:p-6 p-4 rounded-lg">
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1 text-left rtl:text-right">
            <AlertDialogTitle>
              {editData ? t("quick_reply_edit_reply") : t("quick_reply_add_reply")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("quick_reply_description")}
            </AlertDialogDescription>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="hover:bg-slate-100 dark:hover:bg-(--table-hover)"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="content">{t("quick_reply_content_label")}</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("quick_reply_content_placeholder")}
              rows={5}
              className="resize-none dark:bg-(--page-body-bg)"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_admin_reply"
              checked={isAdminReply}
              onCheckedChange={(checked) => setIsAdminReply(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="is_admin_reply"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("quick_reply_admin_reply")}
              </label>
              <p className="text-sm text-muted-foreground">
                {t("quick_reply_admin_reply_description")}
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="h-11 px-4.5 dark:hover:bg-(--table-hover) py-5 dark:bg-(--page-body-bg)"
            >
              {t("common_cancel")}
            </Button>
            <Button type="submit" className="h-11 px-4.5 py-5 text-white" disabled={isLoading || !content.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editData ? t("common_update") : t("common_add")}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QuickReplyModal;
