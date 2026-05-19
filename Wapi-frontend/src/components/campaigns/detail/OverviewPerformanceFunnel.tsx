import { CampaignStats } from "@/src/types/components";
import { Send, CheckCircle2, Eye, AlertCircle } from "lucide-react";

export const OverviewPerformanceFunnel = ({ stats }: { stats: CampaignStats }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
        Performance Funnel
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Dynamic Cards with smooth gradients */}
        <div className="group relative bg-white dark:bg-(--page-body-bg) p-4 rounded-lg border border-slate-200/60 dark:border-(--card-border-color) hover:shadow-lg transition-all overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Sent
              </p>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                <Send size={16} />
              </div>
            </div>
            <h4 className="text-2xl font-black text-blue-600 dark:text-blue-400 leading-none">
              {stats.sent_count}
            </h4>
          </div>
        </div>

        <div className="group relative bg-white dark:bg-(--page-body-bg) p-4 rounded-lg border border-slate-200/60 dark:border-(--card-border-color) hover:shadow-lg transition-all overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Delivered
              </p>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-lg group-hover:scale-110 transition-transform">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
              {stats.delivered_count}
            </h4>
          </div>
        </div>

        <div className="group relative bg-white dark:bg-(--page-body-bg) p-4 rounded-lg border border-slate-200/60 dark:border-(--card-border-color) hover:shadow-lg transition-all overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Read
              </p>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                <Eye size={16} />
              </div>
            </div>
            <h4 className="text-2xl font-black text-purple-600 dark:text-purple-400 leading-none">
              {stats.read_count}
            </h4>
          </div>
        </div>

        <div className="group relative bg-white dark:bg-(--page-body-bg) p-4 rounded-lg border border-slate-200/60 dark:border-(--card-border-color) hover:shadow-lg transition-all overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Failed
              </p>
              <div className="p-2 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-lg group-hover:scale-110 transition-transform">
                <AlertCircle size={16} />
              </div>
            </div>
            <h4 className="text-2xl font-black text-red-600 dark:text-red-400 leading-none">
              {stats.failed_count}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};
