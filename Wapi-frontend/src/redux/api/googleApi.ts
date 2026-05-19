import { baseApi } from "./baseApi";
import { 
  GoogleAccountsResponse, 
  GoogleConnectResponse, 
  GoogleGenericResponse, 
  GoogleCalendarsResponse, 
  GoogleCalendarResponse,
  GoogleQueryParams,
  GoogleEventsResponse,
  GoogleEventResponse,
  GoogleSheetsResponse,
  GoogleSheetDataResponse,
  GoogleSheet
} from "../../types/google";

export const googleApi = baseApi.enhanceEndpoints({ addTagTypes: ["GoogleAccounts", "GoogleCalendars", "GoogleEvents", "GoogleSheets", "GoogleSheetsData"] }).injectEndpoints({
  endpoints: (builder) => ({
    connectGoogle: builder.query<GoogleConnectResponse, void>({
      query: () => "/google/connect",
    }),
    listGoogleAccounts: builder.query<GoogleAccountsResponse, GoogleQueryParams | void>({
      query: (params) => ({
        url: "/google/accounts",
        params: params || {},
      }),
      providesTags: ["GoogleAccounts"],
    }),
    disconnectGoogleAccount: builder.mutation<GoogleGenericResponse, string>({
      query: (id) => ({
        url: `/google/accounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GoogleAccounts"],
    }),
    fetchCalendars: builder.query<GoogleCalendarsResponse, { accountId: string } & GoogleQueryParams>({
      query: ({ accountId, ...params }) => ({
        url: `/google/accounts/${accountId}/calendars`,
        params,
      }),
      providesTags: ["GoogleCalendars"],
    }),
    createCalendar: builder.mutation<GoogleCalendarResponse, { accountId: string; summary: string }>({
      query: ({ accountId, summary }) => ({
        url: `/google/accounts/${accountId}/calendars`,
        method: "POST",
        body: { summary },
      }),
      invalidatesTags: ["GoogleCalendars"],
    }),
    linkCalendar: builder.mutation<GoogleCalendarResponse, { id: string; is_linked: boolean }>({
      query: ({ id, is_linked }) => ({
        url: `/google/calendars/${id}/link`,
        method: "PUT",
        body: { is_linked },
      }),
      invalidatesTags: ["GoogleCalendars"],
    }),
    deleteCalendar: builder.mutation<GoogleGenericResponse, string>({
      query: (id) => ({
        url: `/google/calendars/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GoogleCalendars"],
    }),
    // Event endpoints
    listEvents: builder.query<GoogleEventsResponse, { calendarId: string } & GoogleQueryParams>({
      query: ({ calendarId, ...params }) => ({
        url: `/google/calendars/${calendarId}/events`,
        params,
      }),
      providesTags: ["GoogleEvents"],
    }),
    createEvent: builder.mutation<GoogleEventResponse, { calendarId: string; summary: string; description?: string; start: string; end: string }>({
      query: ({ calendarId, ...body }) => ({
        url: `/google/calendars/${calendarId}/events`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["GoogleEvents"],
    }),
    updateEvent: builder.mutation<GoogleEventResponse, { calendarId: string; eventId: string; summary: string; description?: string; start: string; end: string }>({
      query: ({ calendarId, eventId, ...body }) => ({
        url: `/google/calendars/${calendarId}/events/${eventId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["GoogleEvents"],
    }),
    deleteEvent: builder.mutation<GoogleGenericResponse, { calendarId: string; eventId: string }>({
      query: ({ calendarId, eventId }) => ({
        url: `/google/calendars/${calendarId}/events/${eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GoogleEvents"],
    }),
    // Sheets endpoints
    listSheets: builder.query<GoogleSheetsResponse, { accountId: string } & GoogleQueryParams>({
      query: ({ accountId, ...params }) => ({
        url: `/google/accounts/${accountId}/sheets`,
        params,
      }),
      providesTags: ["GoogleSheets"],
    }),
    createSheet: builder.mutation<{ success: boolean; sheet: GoogleSheet }, { accountId: string; title: string }>({
      query: ({ accountId, title }) => ({
        url: `/google/accounts/${accountId}/sheets`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: ["GoogleSheets"],
    }),
    readSheet: builder.query<GoogleSheetDataResponse, { sheetId: string; range?: string }>({
      query: ({ sheetId, range }) => ({
        url: `/google/sheets/${sheetId}`,
        params: { range },
      }),
      providesTags: (result, error, arg) => [{ type: "GoogleSheetsData", id: arg.sheetId }],
    }),
    writeSheet: builder.mutation<GoogleGenericResponse, { sheetId: string; range?: string; values: string[][] }>({
      query: ({ sheetId, ...body }) => ({
        url: `/google/sheets/${sheetId}/values`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "GoogleSheetsData", id: arg.sheetId }],
    }),
  }),
});

export const {
  useLazyConnectGoogleQuery,
  useListGoogleAccountsQuery,
  useDisconnectGoogleAccountMutation,
  useFetchCalendarsQuery,
  useCreateCalendarMutation,
  useLinkCalendarMutation,
  useDeleteCalendarMutation,
  useListEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useListSheetsQuery,
  useCreateSheetMutation,
  useReadSheetQuery,
  useWriteSheetMutation,
} = googleApi;
