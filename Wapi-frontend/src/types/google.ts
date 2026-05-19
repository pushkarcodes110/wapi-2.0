export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface GoogleAccount {
  _id: string;
  email: string;
  status: "active" | "inactive";
  created_at: string;
}

export interface GoogleCalendar {
  _id: string;
  google_account_id: string;
  calendar_id: string;
  name: string;
  is_linked: boolean;
  created_at: string;
}

export interface GoogleEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  status?: string;
}

export interface GoogleConnectResponse {
  success: boolean;
  url: string;
}

export interface GoogleAccountsResponse {
  success: boolean;
  accounts: GoogleAccount[];
  pagination: Pagination;
}

export interface GoogleCalendarsResponse {
  success: boolean;
  calendars: GoogleCalendar[];
  pagination: Pagination;
}

export interface GoogleCalendarResponse {
  success: boolean;
  calendar: GoogleCalendar;
}

export interface GoogleEventsResponse {
  success: boolean;
  events: GoogleEvent[];
  pagination?: Pagination;
}

export interface GoogleEventResponse {
  success: boolean;
  event: GoogleEvent;
}

export interface GoogleGenericResponse {
  success: boolean;
  message: string;
}

export interface GoogleQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface GoogleSheet {
  _id: string;
  google_account_id: string;
  sheet_id: string;
  name: string;
  is_linked?: boolean;
  created_at: string;
}

export interface GoogleSheetsResponse {
  success: boolean;
  sheets: GoogleSheet[];
  pagination?: Pagination;
}

export interface GoogleSheetDataResponse {
  success: boolean;
  values: string[][];
}
