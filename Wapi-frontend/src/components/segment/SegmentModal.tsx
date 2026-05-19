"use client";

import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/elements/ui/alert-dialog";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MultiSelect, Option } from "@/src/elements/ui/multi-select";
import { useGetContactQuery } from "@/src/redux/api/contactApi";
import { useGetSegmentContactsQuery } from "@/src/redux/api/segmentApi";

interface SegmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description?: string; contactIds?: string[] }) => void;
  segment?: any;
  isLoading?: boolean;
}

const SegmentModal = ({ isOpen, onClose, onSave, segment, isLoading }: SegmentModalProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contactIds, setContactIds] = useState<string[]>([]);

  const { data: contactsResult } = useGetContactQuery({ page: 1, limit: 1000 });
  const contacts = contactsResult?.data?.contacts || [];
  const contactOptions: Option[] = contacts.map((c: any) => ({ label: `${c.name} (${c.phone_number})`, value: c._id }));

  const { data: segmentContactsResult, isFetching: isFetchingSegmentContacts } = useGetSegmentContactsQuery(
    { segmentId: segment?._id, limit: 1000 },
    { skip: !segment?._id || !isOpen }
  );

  useEffect(() => {
    if (segment) {
      setName(segment.name || "");
      setDescription(segment.description || "");
      if (segmentContactsResult?.data?.contacts) {
        setContactIds(segmentContactsResult.data.contacts.map((c: any) => c._id));
      }
    } else {
      setName("");
      setDescription("");
      setContactIds([]);
    }
  }, [segment, isOpen, segmentContactsResult]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description, contactIds });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <AlertDialogTitle className="text-xl font-bold">
            {segment ? t("update_segment") : t("create_segment")}
          </AlertDialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <X size={18} />
          </Button>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("segment_name")}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. High Value Customers"
              required
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this segment..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>{t("contacts")}</Label>
            <MultiSelect
              options={contactOptions}
              selected={contactIds}
              onChange={setContactIds}
              placeholder="Select contacts for this segment..."
            />
            {isFetchingSegmentContacts && <p className="text-xs text-muted-foreground animate-pulse">Loading current contacts...</p>}
          </div>

          <AlertDialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="h-11 px-6">
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isLoading} className="h-11 px-8">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t("saving")}</span>
                </div>
              ) : (
                t("save")
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SegmentModal;
