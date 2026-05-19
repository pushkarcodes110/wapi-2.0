import { useGetSegmentContactsQuery } from "@/src/redux/api/segmentApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Users } from "lucide-react";
import { Button } from "@/src/elements/ui/button";

const SegmentContactsModal = ({
  isOpen,
  onClose,
  segment,
}: {
  isOpen: boolean;
  onClose: () => void;
  segment: any;
}) => {
  const { data: contactsResult, isLoading } = useGetSegmentContactsQuery(
    { segmentId: segment?._id, limit: 100 },
    { skip: !segment?._id || !isOpen },
  );
  const contacts = contactsResult?.data?.contacts || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users size={18} />
            Contacts in "{segment?.name}"
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 mt-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : contacts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No contacts found in this segment.
            </p>
          ) : (
            <div className="space-y-2">
              {contacts.map((contact: any) => (
                <div
                  key={contact._id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--dark-body)"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {contact.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {contact.phone_number}
                    </span>
                  </div>
                  {contact.tags && contact.tags.length > 0 && (
                    <div className="flex -space-x-1">
                      {contact.tags.slice(0, 2).map((tag: any) => (
                        <div
                          key={tag._id}
                          className="w-2 h-2 rounded-full border border-white"
                          style={{ backgroundColor: tag.color }}
                          title={tag.label}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Loader2 = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};


export default SegmentContactsModal;