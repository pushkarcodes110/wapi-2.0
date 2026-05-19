export const ROUTES = {
  // Auth Routes
  Login: "/auth/login",
  ForgotPassword: "/auth/forgot-password",
  ResetPassword: "/auth/reset-password",
  VerifyOTP: "/auth/verify-otp",

  // Main Body Routes
  Dashboard: "/dashboard",

  // Membership & Billing
  ManagePlans: "/plan_management",
  ManagePlansAdd: "/plan_management/add",
  ManagePlansEdit: "/plan_management/edit", // Use as /manage_plans/edit/${id}
  SubscriberPlans: "/customer_plans",
  BillingHistory: "/payment_history",
  PaymentTransactions: "/payment_history",
  PaymentGateways: "/gateway_setup",

  // User Management
  ManageUsers: "/staff_and_members",
  ManageUsersAdd: "/staff_and_members/add",
  UsersShortLinks: "/short_links_users",
  Roles: "/permissions_control",
  QuickReply: "/quick_reply",

  // Resource Hub
  ManageFaqs: "/faq_management",
  ManageFaqsAdd: "/faq_management/add",
  ManageFaqsEdit: "/faq_management/edit",
  ManageTestimonials: "/testimonial_management",
  ManageTestimonialsAdd: "/testimonial_management/add",
  ManageTestimonialsEdit: "/testimonial_management/edit",
  ManagePages: "/page_management",
  ManagePagesAdd: "/page_management/add",
  ManagePagesEdit: "/page_management/edit",
  ManageLanding: "/landing_page_setup",
  TemplatesLibrary: "/template_management",
  TemplatesLibraryAdd: "/template_management/add",
  TemplatesLibraryEdit: "/template_management/edit",

  // Settings & Config
  Settings: "/system_preferences",
  AIModels: "/ai_intelligence",
  Languages: "/language_library",
  Currencies: "/currency_options",
  Taxes: "/tax_configuration",
  ContactInquiries: "/customer_inquiries",
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const ImagePath: string = "/assets/images";
export const ImageBaseUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
