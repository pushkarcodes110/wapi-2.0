import { AllContactsAlertProps } from "@/src/types/campaign";
import { Users } from "lucide-react";

export const AllContactsAlert = ({ count }: AllContactsAlertProps) => {
  return (
    <div className="sm:p-8 p-4 rounded-lg bg-primary/5 dark:bg-(--dark-sidebar) flex-col sm:flex-row border border-[var(--primary-opacity-30)] dark:border-none flex items-center gap-6">
      <div className="w-14 h-14 bg-(--light-primary) dark:bg-(--card-color) rounded-lg flex items-center justify-center text-primary">
        <Users size={24} />
      </div>
      <div>
        <p className="font-bold text-blue-900 dark:text-primary">Targeting all {count} active contacts.</p>
        <p className="text-xs text-blue-700/60 dark:text-gray-400 font-medium">Your message will be broadcasted to your entire contact list.</p>
      </div>
    </div>
  );
};
