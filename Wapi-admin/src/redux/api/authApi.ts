import { baseApi } from "./baseApi";
import { 
  LoginRequest, 
  LoginResponse, 
  ForgotPasswordRequest, 
  VerifyOtpRequest, 
  ResetPasswordRequest, 
  GenericResponse,
  PublicRole,
  PermissionGroup,
  ProfileResponse,
  UpdateProfilePayload,
  ChangePasswordPayload
} from "@/src/types/auth";

export const authApi = baseApi.enhanceEndpoints({ addTagTypes: ["User"] }).injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    forgotPassword: builder.mutation<GenericResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    verifyOtp: builder.mutation<GenericResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<GenericResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    getIsDemoMode: builder.query<{ 
      success: boolean; 
      is_demo_mode: boolean;
      logo_light_url?: string;
      logo_dark_url?: string;
      favicon_url?: string;
      demo_user_email?: string;
      demo_user_password?: string;
      demo_agent_email?: string;
      demo_agent_password?: string;
    }, void>({
      query: () => "/is-demo-mode",
    }),
    getPublicRoles: builder.query<{ success: boolean; data: PublicRole[] }, void>({
      query: () => "/auth/roles",
    }),
    getMyPermissions: builder.query<{ success: boolean; data: PermissionGroup[] }, string | undefined>({
      query: () => "/auth/my-permissions",
    }),
    getProfile: builder.query<ProfileResponse, string | undefined>({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<ProfileResponse, UpdateProfilePayload>({
      query: (data) => ({
        url: "/auth/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation<GenericResponse, ChangePasswordPayload>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useLogoutMutation, 
  useForgotPasswordMutation, 
  useVerifyOtpMutation, 
  useResetPasswordMutation,
  useGetIsDemoModeQuery,
  useGetPublicRolesQuery,
  useGetMyPermissionsQuery,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation
} = authApi;
