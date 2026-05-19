"use client";

import {
  Bot,
  GitBranch,
  Instagram,
  Library,
  MessageSquare,
  PhoneCall,
  Send,
  Webhook as WebhookIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isComingSoon?: boolean;
  category: "FEATURES" | "INTEGRATIONS";
  href: string;
}

const features: Feature[] = [
  {
    id: "no-code-chatbot",
    title: "Automation Builder",
    description: "AI-powered, human like chatbots for every use case",
    icon: <GitBranch className="w-5 h-5" />,
    category: "FEATURES",
    href: "/product/automation_builder",
  },
  {
    id: "broadcast-bulk-messages",
    title: "Campaigns",
    description: "Send personalized campaigns with best delivery rates",
    icon: <Send className="w-5 h-5" />,
    category: "FEATURES",
    href: "/product/broadcast_bulk_messages",
  },
  {
    id: "ai-support-agent",
    title: "AI Support Agent",
    description: "Respond to and resolve queries instantly & custom support",
    icon: <Bot className="w-5 h-5" />,
    category: "FEATURES",
    href: "/product/ai_support_agent",
  },
  {
    id: "shared-team-inbox",
    title: "Team Inbox",
    description: "Win customers with all sales & service chats in one place",
    icon: <MessageSquare className="w-5 h-5" />,
    category: "FEATURES",
    href: "/product/shared_team_inbox",
  },
  {
    id: "instagram-and-facebook-messenger",
    title: "Instagram & Facebook messenger",
    description: "Stay connected with your customers 24*7",
    icon: <Instagram className="w-5 h-5" />,
    category: "FEATURES",
    href: "/product/instagram_and_facebook_messenger",
    isComingSoon: true,
  },
  {
    id: "whatsapp-business-calling",
    title: "WhatsApp Business Calling",
    description: "Turn WhatsApp into your full-fledged voice channel",
    icon: <PhoneCall className="w-5 h-5" />,
    category: "FEATURES",
    href: "/product/whatsapp_business_calling",
    isComingSoon: true,
  },
  {
    id: "webhooks",
    title: "Overview & Webhooks",
    description: "Detailed insights and real-time data sync",
    icon: <WebhookIcon className="w-5 h-5" />,
    category: "INTEGRATIONS",
    href: "#webhooks",
  },
  {
    id: "template-library",
    title: "Library",
    description: "Pre-built high-converting message templates",
    icon: <Library className="w-5 h-5" />,
    category: "INTEGRATIONS",
    href: "#library",
  },
];

const ProductDropdown = ({
  scrollToSection,
}: {
  scrollToSection: (id: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`flex items-center gap-1 text-[17px] font-medium transition-colors cursor-pointer py-2
        ${isOpen ? "text-primary" : "text-slate-300 hover:text-white"}`}
        onClick={() => scrollToSection("features")}
      >
        Product
        {/* <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} /> */}
      </button>

      <div
        className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 transition-all duration-300 
        ${false ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}
      >
        <div className="w-180 bg-white rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-gray-100 sm:p-5 p-4">
          <div className="mb-3">
            <h3 className="text-[12px] font-medium text-slate-500 px-4 mb-2 group/item flex items-start gap-4 p-2 pl-2 rounded-lg hover:bg-slate-50 transition-all duration-300">
              Features
            </h3>
            <div className="grid grid-cols-2 gap-x-1 gap-y-6">
              {features
                .filter((f) => f.category === "FEATURES")
                .map((feature) => (
                  <Link
                    key={feature.id}
                    href={feature.href}
                    className="group/item flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="shrink-0 rounded-lg mt-1 self-start text-slate-600 group-hover/item:text-primary transition-all duration-300">
                          {feature.icon}
                        </div>
                        <span className="text-[17px] font-semibold text-slate-900 group-hover/item:text-primary transition-colors">
                          {feature.title}
                        </span>
                      </div>
                      <p className="text-[14px] text-slate-500 leading-normal font-medium max-w-70 break-word">
                        {feature.description}
                      </p>
                      {feature.isComingSoon && (
                        <div className="text-[10px] w-fit bg-amber-50 text-amber-600 border border-amber-200 font-semibold px-2 py-0.5 rounded-full tracking-tighter">
                          Coming Soon
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h3 className="text-[12px] font-bold text-slate-500 mb-3 px-2 pl-2">
              Integrations
            </h3>
            <div className="grid grid-cols-2 gap-x-1">
              {features
                .filter((f) => f.category === "INTEGRATIONS")
                .map((feature) => (
                  <Link
                    key={feature.id}
                    href={feature.href}
                    className="group/item flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300"
                  >
                    <div className="shrink-0 text-slate-600 group-hover/item:text-primary transition-colors hover:scale-110">
                      {feature.icon}
                    </div>
                    <span className="text-[17px] font-semibold text-slate-800 group-hover/item:text-primary transition-colors">
                      {feature.title}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDropdown;
