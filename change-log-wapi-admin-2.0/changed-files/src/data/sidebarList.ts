import { Award, ShieldCheck, CreditCard, Currency, Diamond, DiamondPlus, FileText, Form, Globe, HandCoins, HelpCircle, Home, Languages, LayoutDashboard, LayoutTemplate, Link, MailWarning, Receipt, Settings, ShoppingCart, Sparkles, ThumbsUp, Users, MessageSquare } from "lucide-react";
import { ROUTES } from "../constants";

export interface MenuItem {
  icon: string;
  label: string;
  path?: string;
  hasSubmenu?: boolean;
  submenu?: SubMenuItem[];
  permission?: string;
}

export interface SubMenuItem {
  label: string;
  path: string;
  permission?: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const sidebarMenuData: MenuSection[] = [
  {
    title: "nav_primary_navigation",
    items: [
      {
        icon: "LayoutDashboard",
        label: "nav_overview_panel",
        path: ROUTES.Dashboard,
        permission: "view.admin_dashboard",
      },
      {
        icon: "Award",
        label: "nav_membership_plans",
        path: ROUTES.ManagePlans,
        hasSubmenu: true,
        permission: "view.plans",
        submenu: [
          {
            label: "nav_plan_manager",
            path: ROUTES.ManagePlans,
            permission: "view.plans",
          },
          {
            label: "nav_active_subscriptions",
            path: ROUTES.SubscriberPlans,
            permission: "view.subscriptions",
          },
          {
            label: "nav_create_new_plan",
            path: ROUTES.ManagePlansAdd,
            permission: "create.plans",
          },
        ],
      },
      {
        icon: "Receipt",
        label: "nav_billing_history",
        path: ROUTES.BillingHistory,
        permission: "view.subscriptions",
      },
      {
        icon: "Users",
        label: "nav_user_administration",
        path: ROUTES.ManageUsers,
        hasSubmenu: true,
        permission: "view.users",
        submenu: [
          {
            label: "nav_complete_user_list",
            path: ROUTES.ManageUsers,
            permission: "view.users",
          },
          {
            label: "nav_onboard_new_user",
            path: ROUTES.ManageUsersAdd,
            permission: "create.users",
          },
        ],
      },
      {
        icon: "Link",
        label: "nav_quick_link_tools",
        path: ROUTES.UsersShortLinks,
        permission: "view.short_links",
      },
      {
        icon: "MessageSquare",
        label: "nav_quick_reply",
        path: ROUTES.QuickReply,
        permission: "view.quick_replies",
      },
    ],
  },
  {
    title: "nav_resource_hub",
    items: [
      {
        icon: "HelpCircle",
        label: "nav_help_center",
        path: ROUTES.ManageFaqs,
        permission: "view.faqs",
      },
      {
        icon: "ThumbsUp",
        label: "nav_client_reviews",
        path: ROUTES.ManageTestimonials,
        permission: "view.testimonials",
      },
      {
        icon: "FileText",
        label: "nav_web_pages",
        path: ROUTES.ManagePages,
        permission: "view.pages",
      },
      {
        icon: "ShieldCheck",
        label: "nav_security_access",
        path: ROUTES.Roles,
        permission: "view.roles",
      },
      {
        icon: "Globe",
        label: "nav_homepage_builder",
        path: ROUTES.ManageLanding,
        permission: "update.landing_page",
      },
      {
        icon: "LayoutTemplate",
        label: "nav_message_presets",
        path: ROUTES.TemplatesLibrary,
        permission: "view.admin-template",
      },
    ],
  },
  {
    title: "nav_global_settings",
    items: [
      {
        icon: "HandCoins",
        label: "nav_payout_integrations",
        path: ROUTES.PaymentGateways,
        permission: "view.payment_gateways",
      },
      {
        icon: "Settings",
        label: "nav_application_config",
        path: ROUTES.Settings,
        permission: "view.settings",
      },
      {
        icon: "Sparkles",
        label: "nav_smart_engines",
        path: ROUTES.AIModels,
        permission: "view.ai_models",
      },
      {
        icon: "Languages",
        label: "nav_linguistic_options",
        path: ROUTES.Languages,
        permission: "view.languages",
      },
      {
        icon: "Currency",
        label: "nav_monetary_config",
        path: ROUTES.Currencies,
        permission: "view.currencies",
      },
      {
        icon: "DiamondPlus",
        label: "nav_fiscal_rates",
        path: ROUTES.Taxes,
        permission: "view.taxes",
      },
      {
        icon: "MailWarning",
        label: "nav_user_messages",
        path: ROUTES.ContactInquiries,
        permission: "view.contact_inquiries",
      },
    ],
  },
];

// Icon mapping helper
export const iconMap = {
  Home,
  LayoutDashboard,
  CreditCard,
  Users,
  ShoppingCart,
  Diamond,
  HelpCircle,
  FileText,
  ThumbsUp,
  Settings,
  Receipt,
  Globe,
  Sparkles,
  HandCoins,
  MailWarning,
  LayoutTemplate,
  Award,
  Link,
  Languages,
  Currency,
  Form,
  DiamondPlus,
  ShieldCheck,
  MessageSquare,
};
