/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "@/src/types/shared";
import { baseApi } from "./baseApi";

export const facebookApi = baseApi.enhanceEndpoints({ addTagTypes: ["FacebookPage", "FacebookAdAccount", "FacebookAdCampaign", "FacebookAdSet", "FacebookAd"] }).injectEndpoints({
  endpoints: (builder) => ({
    getFacebookPages: builder.query<ApiResponse, { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: string } | void>({
      query: (params) => ({
        url: "/facebook/pages",
        params: params || {},
      }),
      providesTags: ["FacebookPage"],
    }),
    syncFacebookPages: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: "/facebook/sync",
        method: "POST",
      }),
      invalidatesTags: ["FacebookPage"],
    }),
    getFacebookAdAccounts: builder.query<ApiResponse, { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: string } | void>({
      query: (params) => ({
        url: "/facebook-ads/ad-accounts",
        params: params || {},
      }),
      providesTags: ["FacebookAdAccount"],
    }),
    syncFacebookAdAccounts: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: "/facebook-ads/ad-accounts/sync",
        method: "POST",
      }),
      invalidatesTags: ["FacebookAdAccount"],
    }),
    updateFacebookDefaults: builder.mutation<ApiResponse, { default_page_id: string | null }>({
      query: (body) => ({
        url: "/facebook/defaults",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FacebookPage"],
    }),
    syncLinkedSocialAccounts: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: "/facebook/linked-accounts/sync",
        method: "POST",
      }),
      invalidatesTags: ["FacebookPage"],
    }),

    // Campaigns
    getFbAdCampaigns: builder.query<ApiResponse, any>({
      query: (params) => ({
        url: "/facebook-ads/campaigns",
        params,
      }),
      providesTags: ["FacebookAdCampaign"],
    }),
    getFbAdCampaignById: builder.query<ApiResponse, string>({
      query: (id) => `/facebook-ads/campaigns/${id}`,
      providesTags: (result, error, id) => [{ type: "FacebookAdCampaign", id }],
    }),
    createFbAdCampaign: builder.mutation<ApiResponse, any>({
      query: (body) => ({
        url: "/facebook-ads/campaigns",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FacebookAdCampaign"],
    }),
    updateFbAdCampaign: builder.mutation<ApiResponse, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/facebook-ads/campaigns/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["FacebookAdCampaign"],
    }),
    deleteFbAdCampaign: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/facebook-ads/campaigns/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FacebookAdCampaign"],
    }),
    syncFbAdCampaigns: builder.mutation<ApiResponse, { ad_account_id: string }>({
      query: (body) => ({
        url: "/facebook-ads/sync-external",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FacebookAdCampaign"],
    }),
    updateFbAdCampaignStatus: builder.mutation<ApiResponse, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/facebook-ads/campaigns/${id}/status`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: ["FacebookAdCampaign"],
    }),

    // Ad Sets
    getAdSetsByCampaign: builder.query<ApiResponse, { campaignId: string; params: any }>({
      query: ({ campaignId, params }) => ({
        url: `/facebook-ads/adsets/${campaignId}`,
        params,
      }),
      providesTags: ["FacebookAdSet"],
    }),
    getFbAdSetById: builder.query<ApiResponse, string>({
      query: (id) => `/facebook-ads/ad-sets/${id}`,
      providesTags: (result, error, id) => [{ type: "FacebookAdSet", id }],
    }),
    createFbAdSet: builder.mutation<ApiResponse, any>({
      query: (body) => ({
        url: "/facebook-ads/adsets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FacebookAdSet"],
    }),
    updateFbAdSet: builder.mutation<ApiResponse, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/facebook-ads/adsets/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["FacebookAdSet"],
    }),
    deleteFbAdSet: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/facebook-ads/adsets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FacebookAdSet"],
    }),

    // Ads
    getFbAdById: builder.query<ApiResponse, string>({
      query: (id) => `/facebook-ads/ads/detail/${id}`,
      providesTags: (result, error, id) => [{ type: "FacebookAd", id }],
    }),
    getAdsByAdSet: builder.query<ApiResponse, { adsetId: string; params: any }>({
      query: ({ adsetId, params }) => ({
        url: `/facebook-ads/ads/${adsetId}`,
        params,
      }),
      providesTags: ["FacebookAd"],
    }),
    createFbAd: builder.mutation<ApiResponse, any>({
      query: (body) => ({
        url: "/facebook-ads/ads",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FacebookAd"],
    }),
    updateFbAd: builder.mutation<ApiResponse, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/facebook-ads/ads/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["FacebookAd"],
    }),
    deleteFbAd: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/facebook-ads/ads/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FacebookAd"],
    }),
    
    getFbAdInsights: builder.query<ApiResponse, { level: string; id: string }>({
      query: ({ level, id }) => `/facebook-ads/insights/${level}/${id}`,
    }),

    connectFacebook: builder.mutation<ApiResponse, { access_token: string }>({
      query: (body) => ({
        url: "/facebook/connect",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FacebookPage", "FacebookAdAccount"],
    }),
  }),
});

export const {
  useGetFacebookPagesQuery,
  useSyncFacebookPagesMutation,
  useGetFacebookAdAccountsQuery,
  useSyncFacebookAdAccountsMutation,
  useSyncLinkedSocialAccountsMutation,
  useUpdateFacebookDefaultsMutation,
  useConnectFacebookMutation,
  
  // Campaigns
  useGetFbAdCampaignsQuery,
  useGetFbAdCampaignByIdQuery,
  useCreateFbAdCampaignMutation,
  useUpdateFbAdCampaignMutation,
  useDeleteFbAdCampaignMutation,
  useSyncFbAdCampaignsMutation,
  useUpdateFbAdCampaignStatusMutation,

  // Ad Sets
  useGetAdSetsByCampaignQuery,
  useGetFbAdSetByIdQuery,
  useCreateFbAdSetMutation,
  useUpdateFbAdSetMutation,
  useDeleteFbAdSetMutation,

  // Ads
  useGetAdsByAdSetQuery,
  useGetFbAdByIdQuery,
  useCreateFbAdMutation,
  useUpdateFbAdMutation,
  useDeleteFbAdMutation,

  // Insights
  useGetFbAdInsightsQuery,
} = facebookApi;
