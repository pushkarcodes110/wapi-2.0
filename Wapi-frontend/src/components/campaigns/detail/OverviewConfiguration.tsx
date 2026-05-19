import { Badge } from "@/src/elements/ui/badge";
import { Campaign } from "@/src/types/components";
import { cn, formatDate } from "@/src/utils";
import { Calendar, Clock, FileText, Globe, Hash, Phone } from "lucide-react";

export const OverviewConfiguration = ({ campaign, wabaId }: { campaign: Campaign; wabaId: string | number | undefined }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4 w-full">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 pl-1">
          Configuration
        </h3>
        <div className="bg-white dark:bg-(--page-body-bg) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) p-2 grid grid-cols-2 md:grid-cols-4 gap-2 shadow-sm">
          <div className="p-3 flex flex-col justify-center dark:bg-(--dark-body) border border-slate-100 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-colors rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-slate-500">
                <Hash size={12} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Name
              </span>
            </div>
            <span
              className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate"
              title={campaign.name}
            >
              {campaign.name}
            </span>
          </div>

          <div className="p-3 flex flex-col justify-center border border-slate-100 dark:border-(--card-border-color) dark:bg-(--dark-body) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-colors rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-slate-500">
                <Clock size={12} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Lang
              </span>
            </div>
            <span className="text-xs mt-0.5 font-bold w-fit bg-slate-100 dark:bg-(--page-body-bg) px-2 py-0.5 rounded text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-800">
              {campaign.language_code || "en_US"}
            </span>
          </div>

          <div className="p-3 flex flex-col justify-center border border-slate-100 dark:border-(--card-border-color) dark:bg-(--dark-body) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-colors rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-slate-500">
                <Phone size={12} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                WABA ID
              </span>
            </div>
            <span
              className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate"
              title={String(wabaId)}
            >
              {wabaId || "N/A"}
            </span>
          </div>

          <div className="p-3 flex flex-col justify-center border border-slate-100 dark:border-(--card-border-color) dark:bg-(--dark-body) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-colors rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-slate-500">
                <Calendar size={12} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Date
              </span>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {formatDate(campaign.created_at)}
            </span>
          </div>

          <div className="col-span-2 md:col-span-2 p-3 flex flex-col justify-center border border-slate-100 dark:border-(--card-border-color) dark:bg-(--dark-body) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-colors rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-slate-500">
                <FileText size={12} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Template
              </span>
            </div>
            <span
              className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate"
              title={campaign.template_name}
            >
              {campaign.template_name}
            </span>
          </div>

          <div className="col-span-2 md:col-span-2 p-3 flex flex-col justify-center border border-slate-100 dark:border-(--card-border-color) dark:bg-(--dark-body) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-colors rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-slate-500">
                <Globe size={12} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Status
              </span>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "uppercase font-black text-[9px] px-2 py-0.5 mt-0.5 rounded-md border w-fit",
                campaign.status === "completed"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/50"
                  : "bg-blue-50 text-blue-600 border-blue-200 dark:bg-(--page-body-bg) dark:border-blue-900/50",
              )}
            >
              {campaign.status}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
