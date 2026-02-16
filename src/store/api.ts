import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type {
  LoginRequest,
  LoginResponse,
  UserRequest,
  UserResponse,
  SubscriptionResponse,
  TestListResponse,
  TestDetailResponse,
  SectionDetailResponse,
  StartAttemptRequest,
  StartAttemptResponse,
  AttemptDetailResponse,
  UpsertResponseRequest,
  UpsertResponseResponse,
  SubmitSectionRequest,
  PagedAttemptListResponse,
  PagedResponse,
  PresignUploadRequest,
  PresignUploadResponse,
  CefrLevel,
  AssetType,
} from '../api/types'
import {API_BASE_URL, STORAGE_KEYS} from '../config/constants'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async headers => {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['User', 'Tests', 'Test', 'Attempts', 'Attempt'],
  endpoints: builder => ({
    // Auth
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // User
    getMe: builder.query<UserResponse, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),

    updateMe: builder.mutation<UserResponse, UserRequest>({
      query: data => ({
        url: '/users/me',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    getSubscription: builder.query<SubscriptionResponse, void>({
      query: () => '/users/me/subscription',
      providesTags: ['User'],
    }),

    // Tests
    getTests: builder.query<
      PagedResponse<TestListResponse>,
      {level?: CefrLevel; page?: number; size?: number}
    >({
      query: ({level, page = 0, size = 20}) => ({
        url: '/tests',
        params: {level, page, size},
      }),
      providesTags: ['Tests'],
    }),

    getTest: builder.query<TestDetailResponse, string>({
      query: id => `/tests/${id}`,
      providesTags: (result, error, id) => [{type: 'Test', id}],
    }),

    getSection: builder.query<
      SectionDetailResponse,
      {testId: string; sectionId: string}
    >({
      query: ({testId, sectionId}) => `/tests/${testId}/sections/${sectionId}`,
    }),

    // Attempts
    startAttempt: builder.mutation<StartAttemptResponse, StartAttemptRequest>({
      query: data => ({
        url: '/attempts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attempts'],
    }),

    getAttemptHistory: builder.query<
      PagedAttemptListResponse,
      {page?: number; size?: number}
    >({
      query: ({page = 0, size = 20}) => ({
        url: '/attempts',
        params: {page, size},
      }),
      providesTags: ['Attempts'],
    }),

    getAttempt: builder.query<AttemptDetailResponse, string>({
      query: id => `/attempts/${id}`,
      providesTags: (result, error, id) => [{type: 'Attempt', id}],
    }),

    upsertResponse: builder.mutation<
      UpsertResponseResponse,
      {attemptId: string; data: UpsertResponseRequest}
    >({
      query: ({attemptId, data}) => ({
        url: `/attempts/${attemptId}/responses`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, {attemptId}) => [{type: 'Attempt', id: attemptId}],
    }),

    submitSection: builder.mutation<
      void,
      {attemptId: string; data: SubmitSectionRequest}
    >({
      query: ({attemptId, data}) => ({
        url: `/attempts/${attemptId}/sections/submit`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, {attemptId}) => [{type: 'Attempt', id: attemptId}],
    }),

    submitAttempt: builder.mutation<void, string>({
      query: attemptId => ({
        url: `/attempts/${attemptId}/submit`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, attemptId) => [
        {type: 'Attempt', id: attemptId},
        'Attempts',
      ],
    }),

    // Assets
    presignUpload: builder.mutation<PresignUploadResponse, PresignUploadRequest>({
      query: data => ({
        url: '/assets/presign-upload',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useGetSubscriptionQuery,
  useGetTestsQuery,
  useGetTestQuery,
  useGetSectionQuery,
  useStartAttemptMutation,
  useGetAttemptHistoryQuery,
  useGetAttemptQuery,
  useUpsertResponseMutation,
  useSubmitSectionMutation,
  useSubmitAttemptMutation,
  usePresignUploadMutation,
} = api
