import { api } from '@/lib/redux/api';

// Passing Tag arguments to builder api to use automatic re-fetching 😀
const tagInjection: any = api.enhanceEndpoints({
  addTagTypes: [
    'getCustomersList',
    'customerBalanceUpdate',
    'updateId',
    'getCustomerSettings',
    'getApiSettings',
    'getCustomerWalletInfo',
    'balanceGet',
  ],
});

export const customerManagementApi = tagInjection.injectEndpoints({
  endpoints: (builder: any) => ({
    getAllCustomers: builder.query({
      query(body: any) {
        return {
          url: `core/api/Customer/GetAll`,
          body,
          method: 'post',
          needError: true,
        };
      },
      providesTags: ['getCustomersList'],
      transformResponse: (res: any) => {
        console.log(res?.response)
        return res?.response;
      },
    }),
    getAllCustomersSearch: builder.query({
      query(body: any) {
        return {
          url: `core/api/GlobalSearch/SearchCustomers`,
          body,
          method: 'post',
          needError: true,
        };
      },
      providesTags: ['getCustomersList'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getCustomer: builder.query({
      query(body: any) {
        return {
          url: `core/api/Customer/Get`,
          body,
          method: 'post',
          needError: true,
        };
      },
      providesTags: ['updateId', 'getCustomersList'],
      transformResponse: (res: any) => {
        return { ...res?.response, statusCode: res?.statusCode };
      },
    }),
    getCustomerBalance: builder.query({
      query(body: any) {
        return {
          url: `core/api/Wallet/GetWalletBalance`,
          body,
          method: 'post',
          needError: true,
        };
      },
      providesTags: ['updateId', 'customerBalanceUpdate'],
      transformResponse: (res: any) => {
        return { ...res?.response, statusCode: res?.statusCode };
      },
    }),
    createCustomer: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/Customer/Create`,
          method: 'post',
          body,
          needError: true,
          successCode: 400,
        };
      },
      invalidatesTags: ['getCustomersList'],
      transformResponse: (res: any) => {
        return res;
      },
    }),

    deleteCustomer: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/Customer/Delete`,
          body,
          method: 'delete',
        };
      },
      invalidatesTags: ['getCustomersList'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getCustomerBalanceForCustomer: builder.query({
      query(body: any) {
        return {
          url: `core/api/Wallet/GetWalletBalance`,
          body,
          method: 'post',
        };
      },
      providesTags: ['balanceGet'],
      invalidatesTags: ['customerBalanceUpdate'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    disableCustomer: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/Customer/Disable`,
          body,
          method: 'put',
          needError: true,
          successCode: body?.customerStatus === 'Active' ? 602 : 601,
        };
      },
      invalidatesTags: ['getCustomersList'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    updateCustomer: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/Customer/Update`,
          body,
          method: 'put',
          needError: true,
          successCode: 405,
        };
      },
      invalidatesTags: ['getCustomersList', 'updateId'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getCustomersDropdown: builder.query({
      query() {
        return {
          url: `core/api/Customer/GetAllDropdownList`,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getCustomerApiSettings: builder.query({
      query(body: any) {
        return {
          url: `core/api/CustomerApiSettings/GetCustomerApiSettings`,
          method: 'post',
          body,
        };
      },
      providesTags: ['getApiSettings'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    generateApiSettings: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/CustomerApiSettings/GenerateApiSettings`,
          body,
          method: 'post',
          needError: true,
        };
      },
      invalidatesTags: ['getApiSettings'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getCustomerApiSetting: builder.query({
      query(body: any) {
        return {
          url: `core/api/CustomerApiSettings/GetCustomerApiSettings`,
          method: 'post',
          body,
        };
      },
      providesTags: ['getCustomerSettings'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    updateApiSettingsStatus: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/CustomerApiSettings/Update`,
          body,
          method: 'put',
          needError: true,
        };
      },
      invalidatesTags: ['getApiSettings', 'getCustomerSettings'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    updateApiKeyAndSecret: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/CustomerApiSettings/Regenerate`,
          body,
          method: 'put',
          needError: true,
        };
      },
      invalidatesTags: ['getApiSettings'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getEmailAPI: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/CustomerApiSettings/GetEmailTemplate`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    downloadApiSettingsDocument: builder.mutation({
      query() {
        return {
          url: `core/api/CustomerApiSettings/DownloadDocumentation`,
          method: 'get',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    updateApiSettingsLimit: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/CustomerApiSettings/Update`,
          body,
          method: 'put',
          needError: true,
        };
      },
      invalidatesTags: ['getApiSettings', 'getCustomerSettings'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    sentEmailApiSettings: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/CustomerApiSettings/SentEmailForCustomerApi`,
          body,
          method: 'post',
          needError: true,
        };
      },
      invalidatesTags: ['getCustomerSettings'],

      transformResponse: (res: any) => {
        return res;
      },
    }),
    updateWalletThreshold: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/Wallet/UpdateWalletThreshold`,
          body,
          method: 'put',
          needError: true,
        };
      },
      invalidatesTags: ['getCustomerWalletInfo', 'customerBalanceUpdate'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    customerWalletDetails: builder.query({
      query(body: any) {
        return {
          url: `core/api/Wallet/GetCustomerWalletDetails`,
          body,
          method: 'post',
          needError: true,
        };
      },
      providesTags: ['getCustomerWalletInfo'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    configureAggregator: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/Wallet/ConfigureAggregator`,
          body,
          method: 'post',
          needError: true,
        };
      },
      invalidatesTags: ['getCustomerWalletInfo'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    updateWalletBalance: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/Wallet/UpdateCustomerWalletBalance`,
          body,
          method: 'put',
          needError: true,
        };
      },
      invalidatesTags: ['getCustomerWalletInfo', 'customerBalanceUpdate'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getCustomerTransactions: builder.query({
      query(body: any) {
        return {
          url: `core/api/Wallet/GetCustomerTransactions`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    exportCustomerTransaction: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/Wallet/ExportCustomerTransactions`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getAllCarrierIntegrators: builder.query({
      query(body: any) {
        return {
          url: `core/api/Wallet/GetAllCarrierIntegrators`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
  }),
  overrideExisting: true,
});

// Export endpoints as hooks 😄
// auto-generated based on the defined endpoints.
export const {
  useGetAllCustomersQuery,
  useGetAllCustomersSearchQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useDisableCustomerMutation,
  useUpdateCustomerMutation,
  useGetCustomersDropdownQuery,
  useGenerateApiSettingsMutation,
  useGetCustomerApiSettingsQuery,
  useGetCustomerApiSettingQuery,
  useUpdateApiSettingsStatusMutation,
  useUpdateApiKeyAndSecretMutation,
  useGetEmailAPIMutation,
  useDownloadApiSettingsDocumentMutation,
  useUpdateApiSettingsLimitMutation,
  useSentEmailApiSettingsMutation,
  useUpdateWalletThresholdMutation,
  useConfigureAggregatorMutation,
  useGetCustomerBalanceQuery,
  useGetCustomerBalanceForCustomerQuery,
  useCustomerWalletDetailsQuery,
  useGetCustomerTransactionsQuery,
  useExportCustomerTransactionMutation,
  useGetAllCarrierIntegratorsQuery,
  useUpdateWalletBalanceMutation,
} = customerManagementApi;
