import { api } from '@/lib/redux/api';
import { loginCredentials, resetUserCred } from '@/utils/helper';
import { handleApiError } from '@/utils/errorHandler';

// Passing Tag arguments to builder api to use automatic re-fetching 😀
const tagInjection: any = api.enhanceEndpoints({ addTagTypes: ['UserProfile'] });

export const authApi = tagInjection.injectEndpoints({
  endpoints: (builder: any) => ({
    login: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/auth/login/`,
          method: 'post',
          body,
          needError: true,
          successCode: 1,
        };
      },
      invalidatesTags: ['UserProfile'],
      transformResponse: (res: any) => {
        // console.log("Login response:", res);
        
        // Check if this is actually an error response disguised as success
        if (res?.statusCode && res.statusCode >= 400) {
          return res?.response || res;
        }
        
        if (res?.response && (res?.statusCode === 0 || res?.statusCode === 200)) {
          // Only store credentials if login was successful
          loginCredentials('userCred', res?.response);
          loginCredentials('warehouseIds', res?.response);
          
          // Also store in cookies for middleware access
          if (typeof document !== 'undefined') {
            document.cookie = `userCred=${JSON.stringify(res?.response)}; path=/; max-age=86400`;
          }
        }
        return res;
      },
      transformErrorResponse: (errorResponse: any) => {
        // Clear any existing credentials on login error
        resetUserCred();
        console.log(errorResponse);
        

      },
    }),
    tokenValidate: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/auth/ValidateToken`,
          body,
          method: 'post',
        };
      },
      transformErrorResponse: (errorResponse: any) => {
        return
      },
    }),
    logout: builder.mutation({
      query() {
        return {
          url: `core/api/auth/logout`,
          method: 'post',
        };
      },
      transformResponse: (res: any) => {
        // Clear all stored credentials on logout
        resetUserCred();
        return res;
      },
      transformErrorResponse: (errorResponse: any) => {
        resetUserCred();
      },
    }),
  }),
  overrideExisting: true,
});

// Export endpoints as hooks 😄
// auto-generated based on the defined endpoints.
export const {
  useLoginMutation,
  useTokenValidateMutation,
  useLogoutMutation,
} = authApi;