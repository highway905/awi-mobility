import { api } from '@/lib/redux/api';
import { getUserCred, resetUserCred } from '@/utils/helper';

// Passing Tag arguments to builder api to use automatic re-fetching 😀
const tagInjection: any = api.enhanceEndpoints({ addTagTypes: ['UserProfile'] });
const getUserData = getUserCred('userCred');

export const profileApi = tagInjection.injectEndpoints({
  endpoints: (builder: any) => ({
    getUserProfile: builder.query({
      query() {
        return {
          url: `core/api/Profile/Get`,
          method: 'get',
        };
      },
      providesTags: ['UserProfile'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    updateUserProfile: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/Profile/Update`,
          body,
          method: 'post',
          needError: true,
          successCode: 302,
        };
      },
      invalidatesTags: ['UserProfile'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    changePassword: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/ApplicationUser/ChangePassword`,
          body: { ...body, userId: getUserData?.id },
          method: 'post',
          needError: true,
          successCode: 301,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    logout: builder.mutation({
      query() {
        return {
          url: `core/api/ApplicationUser/Logout`,
          method: 'get',
          successCode: 4,
        };
      },
      transformResponse: (res: any) => {
        resetUserCred();
        return res;
      },
    }),
  }),
  overrideExisting: true,
});

// Export endpoints as hooks 😄
// auto-generated based on the defined endpoints.
export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} = profileApi;
