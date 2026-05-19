/* eslint-disable @typescript-eslint/no-explicit-any */
export type AppointmentDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface AppointmentInterval {
  from: string;
  to: string;
}

export interface AppointmentSlot {
  day: AppointmentDay;
  is_enabled: boolean;
  intervals: AppointmentInterval[];
}

export interface AppointmentQuestion {
  id: string;
  label: string;
  type: "text" | "number" | "email" | "phone" | "select" | "multiselect" | "date" | "time" | "datetime";
  required: boolean;
  options?: string[];
}

export interface AppointmentConfig {
  _id: string;
  user_id: string;
  name: string;
  description: string;
  location: string;
  timezone: string;
  duration_minutes: number;
  max_daily_appointments: number;
  break_between_appointments_minutes: number;
  max_advance_booking_days: number;
  reminder_hours: number;
  allow_overlap: boolean;
  send_confirmation_message: boolean;
  status: "active" | "inactive";
  waba_id: string;
  
  success_template_id: string;
  confirm_template_id: string;
  cancel_template_id: string;
  reminder_template_id: string;
  reschedule_template_id: string;
  
  variable_mappings: {
    [key: string]: {
      [key: string]: string;
    };
  };
  
  appointment_fees: number;
  pre_paid_fees: number;
  tax_percentage: number;
  total_appointment_fees: number;
  currency: string;
  payment_gateway_id: string;
  accept_partial_payment: boolean;
  partial_payment_amount: number;
  send_payment_link_automatically: boolean;
  payment_link_template_id: string;
  payment_link_variable_mappings: {
    [key: string]: string;
  };
  
  create_google_meet: boolean;
  google_account_id: string;
  calendar_id: string;
  sheet_id: string;
  sheet_name: string;
  
  slots: AppointmentSlot[];
  intro_message: string;
  series_of_questions: AppointmentQuestion[];
  
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface AppointmentConfigsResponse {
  success: boolean;
  data: {
    configs: AppointmentConfig[];
    pagination?: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface AppointmentConfigResponse {
  success: boolean;
  config: AppointmentConfig;
}

export interface AppointmentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  waba_id?: string;
}
export interface AppointmentBooking {
  _id: string;
  config_id: string | AppointmentConfig;
  contact_id: any;
  user_id: string;
  start_time: string;
  end_time: string;
  answers: { [key: string]: string };
  google_event_id?: string;
  google_meet_link?: string;
  sheet_row?: number;
  status: "pending" | "confirmed" | "canceled" | "rescheduled" | "booked";
  cancel_reason?: string;
  reminder_sent: boolean;
  payment_status: "unpaid" | "paid" | "partially_paid";
  payment_link?: string;
  payment_transaction_id?: string;
  amount_due: number;
  amount_paid: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AppointmentBookingsResponse {
  success: boolean;
  bookings: AppointmentBooking[];
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface AppointmentBookingResponse {
  success: boolean;
  booking: AppointmentBooking;
}
