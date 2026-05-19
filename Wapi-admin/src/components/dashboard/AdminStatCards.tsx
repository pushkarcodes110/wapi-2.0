"use client";

import { Card, CardContent } from "@/src/elements/ui/card";
import { useAppSelector } from "@/src/redux/hooks";
import { Users, CreditCard, Layout, DollarSign, Cpu, MessageSquare, TrendingUp, TrendingDown, Minus } from "lucide-react";
import CountUp from "react-countup";

interface AdminStatCardsProps {
  counts: {
    totalUsers: number;
    activeSubscriptions: number;
    totalPlans: number;
    revenue: {
      today: number;
      month: number;
      total: number;
    };
    activeAIModels: number;
    totalContactInquiries: number;
  };
  showPlans?: boolean;
  showSubscriptions?: boolean;
}

const AdminStatCards = ({ counts, showPlans = true, showSubscriptions = true }: AdminStatCardsProps) => {
  console.log("🚀 ~ AdminStatCards ~ counts:", counts)
  const settings = useAppSelector((state) => state.settings.data);
  const defaultSymbol = settings?.default_currency?.symbol || "$";

  const stats = [
    {
      label: "Users Count",
      value: counts.totalUsers,
      icon: Users,
      color: "blue",
      description: "Registered users",
      trend: "+12%",
      trendIcon: TrendingUp,
      trendColor: "text-emerald-500 bg-emerald-500/10",
    },
    {
      label: "Active Subscriptions",
      value: counts.activeSubscriptions,
      icon: CreditCard,
      color: "indigo",
      description: "Active paying users",
      trend: "+5%",
      trendIcon: TrendingUp,
      trendColor: "text-emerald-500 bg-emerald-500/10",
    },
    {
      label: "Available Plans",
      value: counts.totalPlans,
      icon: Layout,
      color: "purple",
      description: "Available Pricing Plans",
      trend: "Stable",
      trendIcon: Minus,
      trendColor: "text-slate-400 bg-slate-400/10",
    },
    {
      label: "Revenue This Month",
      value: counts.revenue.month,
      prefix: defaultSymbol,
      icon: DollarSign,
      color: "emerald",
      description: "This month’s revenue",
      trend: defaultSymbol + counts.revenue.today.toFixed(2) + " today",
      trendIcon: TrendingUp,
      trendColor: "text-emerald-500 bg-emerald-500/10",
    },
    {
      label: "AI Settings",
      value: counts.activeAIModels,
      icon: Cpu,
      color: "orange",
      description: "AI configurations",
      trend: "Online",
      trendIcon: TrendingUp,
      trendColor: "text-emerald-500 bg-emerald-500/10",
    },
    {
      label: "Customer inquiries",
      value: counts.totalContactInquiries,
      icon: MessageSquare,
      color: "pink",
      description: "Pending Support Requests",
      trend: "Action needed",
      trendIcon: TrendingDown,
      trendColor: "text-amber-500 bg-amber-500/10",
    },
  ].filter((stat) => {
    if (stat.label === "Available Plans" && !showPlans) return false;
    if ((stat.label === "Active Subscriptions" || stat.label === "Revenue This Month") && !showSubscriptions) return false;
    return true;
  });

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue": return { text: "text-blue-600", bg: "bg-blue-600/10", border: "border-blue-600/5", gradient: "from-blue-600/20 to-transparent" };
      case "indigo": return { text: "text-indigo-600", bg: "bg-indigo-600/10", border: "border-indigo-600/5", gradient: "from-indigo-600/20 to-transparent" };
      case "purple": return { text: "text-purple-600", bg: "bg-purple-600/10", border: "border-purple-600/5", gradient: "from-purple-600/20 to-transparent" };
      case "emerald": return { text: "text-emerald-600", bg: "bg-emerald-600/10", border: "border-emerald-600/5", gradient: "from-emerald-600/20 to-transparent" };
      case "orange": return { text: "text-orange-600", bg: "bg-orange-600/10", border: "border-orange-600/5", gradient: "from-orange-600/20 to-transparent" };
      case "pink": return { text: "text-pink-600", bg: "bg-pink-600/10", border: "border-pink-600/5", gradient: "from-pink-600/20 to-transparent" };
      default: return { text: "text-slate-600", bg: "bg-slate-600/10", border: "border-slate-600/5", gradient: "from-slate-600/20 to-transparent" };
    }
  };

  return (
    <div className="grid gap-6 grid-cols-1 [@media(min-width:475px)_and_(max-width:767px)]:grid-cols-2 [@media(min-width:768px)_and_(max-width:1727px)]:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat, index) => {
        const styles = getColorClasses(stat.color);

        return (
          <Card key={index} className="group relative overflow-hidden border-none! bg-white dark:bg-(--card-color) shadow-sm hover:shadow-xl transition-all duration-500 rounded-lg cursor-default border border-white/10">
            {/* Background Gradient Layer (Top Right corner style as per image) */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-bl ${styles.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-700 blur-2xl -mr-10 -mt-10`} />

            {/* Subtle base gradient layer */}
            <div className={`absolute inset-0 bg-linear-to-br ${styles.gradient} opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500`} />

            <CardContent className="sm:p-6 p-4 relative z-10 transition-colors duration-500">
              <div className="flex flex-col gap-4">
                {/* Header: Icon and Trend */}
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-lg ${styles.bg} ${styles.text} flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm border ${styles.border}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className={`flex items-center gap-1 text-[11px] font-bold rounded-full px-2 py-0.5 ${stat.trendColor} border border-white/10`}>
                    <stat.trendIcon size={10} />
                    <span>{stat.trend}</span>
                  </div>
                </div>

                {/* Main Content: Value and Label */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    {stat.prefix && (
                      <span className="text-lg font-bold text-slate-400 dark:text-slate-500 transition-colors duration-500">
                        {stat.prefix}
                      </span>
                    )}
                    <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-500 font-mono!">
                      <CountUp end={stat.value} duration={2} separator="," />
                    </span>
                  </div>
                  <h3 className="text-[14px] font-medium text-slate-500 dark:text-slate-400 transition-colors duration-500">
                    {stat.label}
                  </h3>
                </div>

                {/* Footer: Description */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/5 transition-all duration-500">
                  <p className="text-[12px] font-medium text-slate-400 dark:text-slate-500 line-clamp-1 transition-colors duration-500">
                    {stat.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStatCards;
