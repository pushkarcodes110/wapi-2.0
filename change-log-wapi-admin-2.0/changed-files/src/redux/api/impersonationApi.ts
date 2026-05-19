import { baseApi } from "./baseApi";

interface StartImpersonationResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

const impersonationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startImpersonation: builder.mutation<StartImpersonationResponse, { targetUserId: string }>({
      query: (body) => ({
        url: "/impersonation/start",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useStartImpersonationMutation } = impersonationApi;
