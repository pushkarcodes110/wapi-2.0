import { baseApi } from "./baseApi";

export const quickReplyApi = baseApi.enhanceEndpoints({ addTagTypes: ["QuickReply"] }).injectEndpoints({
  endpoints: (builder) => ({
    getQuickReplies: builder.query({
      query: (params) => ({
        url: "/quick-replies/admin",
        params,
      }),
      providesTags: ["QuickReply"],
    }),
    createQuickReply: builder.mutation({
      query: (body) => ({
        url: "/quick-replies",
        method: "POST",
        body,
      }),
      invalidatesTags: ["QuickReply"],
    }),
    updateQuickReply: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/quick-replies/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["QuickReply"],
    }),
    deleteQuickReply: builder.mutation({
      query: (ids) => ({
        url: "/quick-replies/delete",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["QuickReply"],
    }),
    toggleFavoriteQuickReply: builder.mutation({
      query: (id) => ({
        url: `/quick-replies/${id}/favorite`,
        method: "POST",
      }),
      invalidatesTags: ["QuickReply"],
    }),
  }),
});

export const {
  useGetQuickRepliesQuery,
  useCreateQuickReplyMutation,
  useUpdateQuickReplyMutation,
  useDeleteQuickReplyMutation,
  useToggleFavoriteQuickReplyMutation,
} = quickReplyApi;
