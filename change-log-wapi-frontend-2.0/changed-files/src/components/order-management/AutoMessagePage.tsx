"use client";

import CommonHeader from "@/src/shared/CommonHeader";
import { useGetStatusTemplatesQuery, StatusTemplate } from "@/src/redux/api/orderTemplateApi";
import StatusTemplateCard from "./StatusTemplateCard";
import {
  MessageCircle,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  PackageCheck,
} from "lucide-react";

const STATUS_CONFIG = [
  {
    key: "first_message",
    label: "Welcome Message",
    description:
      "Triggered when a customer makes their initial order on WhatsApp",
    icon: <MessageCircle size={18} className="text-primary" />,
    color: "bg-primary/10",
  },
  {
    key: "pending",
    label: "Awaiting Confirmation",
    description: "Order has been received and is pending confirmation",
    icon: <Clock size={18} className="text-amber-500" />,
    color: "bg-amber-500/10",
  },
  {
    key: "confirmed",
    label: "Order Confirmed",
    description: "Order is verified and currently under processing",
    icon: <CheckCircle2 size={18} className="text-emerald-500" />,
    color: "bg-emerald-500/10",
  },
  {
    key: "ready_to_ship",
    label: "Prepared for Shipping",
    description: "Order has been packed and is prepared for dispatch or pickup",
    icon: <Package size={18} className="text-violet-500" />,
    color: "bg-violet-500/10",
  },
  {
    key: "on_the_way",
    label: "Out for Delivery",
    description:
      "Order is currently out for delivery and on its way to the customer",
    icon: <Truck size={18} className="text-orange-500" />,
    color: "bg-orange-500/10",
  },
  {
    key: "shipped",
    label: "Successfully Delivered",
    description: "Order has been delivered successfully to the customer",
    icon: <PackageCheck size={18} className="text-primary" />,
    color: "bg-primary/10",
  },
];

const AutoMessagePage = () => {
  const { data, isLoading } = useGetStatusTemplatesQuery();

  const getTemplateForStatus = (statusKey: string): StatusTemplate | undefined =>
    data?.data?.find((t) => t.status === statusKey);

  return (
    <div className="p-4 sm:p-8 bg-(--page-body-bg) dark:bg-(--dark-body) pt-0!">
      <CommonHeader
        backBtn={true}
        title="Message Automation Templates"
        description="Triggered when a customer makes their initial order on WhatsApp"
        isLoading={isLoading}
      />

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-lg bg-slate-100 dark:bg-(--card-color) animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {STATUS_CONFIG.map((config, index) => (
            <StatusTemplateCard
              key={config.key}
              index={index}
              statusKey={config.key}
              label={config.label}
              description={config.description}
              icon={config.icon}
              color={config.color}
              existing={getTemplateForStatus(config.key)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoMessagePage;
