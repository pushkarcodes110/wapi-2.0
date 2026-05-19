export type PaymentGatewayType = "razorpay" | "stripe" | "paypal";

export interface RazorpayCredentials {
  key_id: string;
  key_secret: string;
}

export interface StripeCredentials {
  publishable_key: string;
  secret_key: string;
}

export interface PaypalCredentials {
  client_id: string;
  client_secret: string;
  mode: "sandbox" | "live";
}

export type PaymentGatewayCredentials = RazorpayCredentials | StripeCredentials | PaypalCredentials;

export interface PaymentGateway {
  _id: string;
  user_id: string;
  gateway: PaymentGatewayType;
  display_name: string;
  credentials: PaymentGatewayCredentials;
  is_active: boolean;
  webhook_id?: string;
  webhook_secret?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreatePaymentGatewayRequest {
  gateway: PaymentGatewayType;
  display_name: string;
  credentials: PaymentGatewayCredentials;
  is_active?: boolean;
}

export interface UpdatePaymentGatewayRequest {
  display_name?: string;
  credentials?: Partial<PaymentGatewayCredentials>;
  is_active?: boolean;
}

export interface PaymentGatewaysResponse {
  success: boolean;
    configs: PaymentGateway[];
    pagination?: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
}

export interface PaymentGatewayQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface PaymentTransaction {
  _id: string;
  user_id: string;
  context: "appointment" | "catalog" | "custom";
  context_id: string;
  gateway_config_id: {
    _id: string;
    display_name: string;
    gateway: PaymentGatewayType;
  } | string;
  gateway: PaymentGatewayType;
  gateway_order_id?: string;
  gateway_payment_id?: string;
  payment_link?: string;
  payment_type: "full" | "partial";
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransactionsResponse {
  success: boolean;
  data: {
    transactions: PaymentTransaction[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    };
  };
}

export interface PaymentGatewayResponse {
  success: boolean;
  config: PaymentGateway;
  webhook_registered?: boolean;
}
