import { api } from '@/lib/redux/api';

// Passing Tag arguments to builder api to use automatic re-fetching 😀
const tagInjection: any = api.enhanceEndpoints({
  addTagTypes: ['CommonAPI', 'getCustomColumns', 'orderListRefresh'],
});

export const commonApi = tagInjection.injectEndpoints({
  endpoints: (builder: any) => ({
    getAllCountries: builder.query({
      query(body: any) {
        return {
          url: `core/api/Common/GetAllCountries`,
          method: 'post',
          body,
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getAllCountriesShippingLabel: builder.query({
      query(body: any) {
        return {
          url: `lmdordershipment/api/Region/GetAllCountries`,
          method: 'post',
          body,
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getAllStates: builder.query({
      query(body: any) {
        return {
          url: `core/api/Common/GetAllStates`,
          method: 'post',
          body,
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getAllStatesList: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/Common/GetAllStates`,
          method: 'post',
          body,
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getAllStatesListShippingLabel: builder.mutation({
      query(body: any) {
        return {
          url: `lmdordershipment/api/Region/GetAllStates`,
          method: 'post',
          body,
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getUnitOfMeasurement: builder.query({
      query(body: any) {
        return {
          url: `core/api/UnitOfMeasurement/GetAllDropdownList`,
          method: 'get',
          body,
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getAllocationMethod: builder.query({
      query(body: any) {
        return {
          url: `core/api/AllocationMethod/GetAllDropdownList`,
          method: 'get',
          body,
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getPackingGroup: builder.query({
      query(body: any) {
        return {
          url: `core/api/PackingGroup/GetAllDropdownList`,
          method: 'get',
          body,
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    checkIfEmailExists: builder.query({
      query(body: any) {
        return {
          url: `core/api/ApplicationUser/IsEmailExists`,
          method: 'post',
          body,
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getPackingBoxDropdown: builder.query({
      query() {
        return {
          url: `core/api/Box/GetBoxDropdowns`,
          method: 'get',
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    fedexTestPrint: builder.query({
      query() {
        return {
          url: `order/api/FulfillmentInboundOrder/TempCreateShipmentOrLabel`,
          method: 'get',
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    customColumnsSettings: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/CustomColumn/UpsertCustomColumnSettings`,
          method: 'post',
          body,
          needError: true,
        };
      },
      invalidatesTags: ['getCustomColumns'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    cancelShippingBulk: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/Order/BatchCancelShipment`,
          method: 'post',
          body,
          needError: true,
        };
      },
      invalidatesTags: ['orderListRefresh'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getCustomColumnsSettings: builder.query({
      query(body: any) {
        return {
          url: `core/api/CustomColumn/GetAllCustomColumnSettings`,
          method: 'post',
          body,
          needError: true,
        };
      },
      providesTags: ['getCustomColumns'],
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
  useGetAllCountriesQuery,
  useGetAllCountriesShippingLabelQuery,
  useGetAllStatesQuery,
  useGetAllStatesListMutation,
  useGetAllStatesListShippingLabelMutation,
  useGetUnitOfMeasurementQuery,
  useGetAllocationMethodQuery,
  useGetPackingGroupQuery,
  useCheckIfEmailExistsQuery,
  useGetPackingBoxDropdownQuery,
  useFedexTestPrintQuery,
  useCustomColumnsSettingsMutation,
  useGetCustomColumnsSettingsQuery,
  useCancelShippingBulkMutation,
} = commonApi;
