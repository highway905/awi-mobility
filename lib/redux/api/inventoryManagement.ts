import { api } from '@/lib/redux/api';

// Passing Tag arguments to builder api to use automatic re-fetching 😀
const tagInjection = api.enhanceEndpoints({
  addTagTypes: ['getPalletsList', 'getPalletsBoxList', 'getInventoryList', 'getSkuSplitInfo'],
});

export const inventoryManagement = tagInjection.injectEndpoints({
  endpoints: (builder) => ({
    getPalletDropdown: builder.query({
      query(body: any) {
        return {
          url: `inventory/api/Pallet/GetPalletsDropDownList`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getLocationDropdown: builder.query({
      query(body: any) {
        return {
          url: `inventory/api/InventoryLocation/GetInventoryLocationsDropDownList`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getBoxDropdown: builder.query({
      query(body: any) {
        return {
          url: `inventory/api/PalletBox/GetPalletBoxsDropDownList`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    //
    createPallet: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/Pallet/CreatePalletMaster`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    createPalletBox: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/Pallet/CreatePalletBox`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    adjustInventory: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/InventoryAllocation/AdjustInventory`,
          body,
          method: 'put',
          needError: true,
        };
      },
      invalidatesTags: ['getInventoryList'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getSkuTransactionHistory: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/SkuTransaction/GetSkuTransactionHistory`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getConsolidatedDailyStockList: builder.query({
      query(body: any) {
        return {
          url: `inventory/api/DailyStockReport/GetConsolidated`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        if (res?.response?.items) {
          const updatedItems = res?.response?.items?.map((item: any) => ({
            ...item,
            id: item.customerSkuId,
          }));
          const updatedRes = {
            ...res,
            response: {
              ...res.response,
              items: updatedItems,
            },
          };
          return updatedRes;
        }
        return res;
      },
    }),
    getConsolidatedDailyStockDetail: builder.query({
      query(body: any) {
        return {
          url: `inventory/api/DailyStockReport/GetDetailed`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    exportSkuHistory: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/SkuTransaction/ExportSkuTransactionHistory`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getSkuDropdown: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/SkuTransaction/GetDropdownsForSkuTransactionHistory`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getInventoryItemsList: builder.query({
      query(body: any) {
        console.log(body);
        return {
          url: `inventory/api/InventoryAllocation/GetAllInventoryItems`,
          method: 'post',
          body,
        };
      },
      providesTags: ['getInventoryList'],
      transformResponse: (res: any) => {
        console.log(res);
        return res?.response;
      },
    }),
    getInventoryItemsListSearch: builder.query({
      query(body: any) {
        return {
          url: `core/api/GlobalSearch/SearchInventory`,
          method: 'post',
          body,
        };
      },
      providesTags: ['getInventoryList'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getInventoryItemsListOutbound: builder.query({
      query(body: any) {
        return {
          url: `inventory/api/InventoryAllocation/GetAllOrderInventoryItems`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getB2cInventoryItemsListOutbound: builder.query({
      query(body: any) {
        return {
          url: `inventory/api/InventoryAllocation/GetAllB2COrderInventoryItems`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        if (res?.response?.items) {
          const updatedItems = res?.response?.items?.map((item: any) => ({
            ...item,
            id: item.customerSkuId,
          }));
          const updatedRes = {
            ...res,
            response: {
              ...res.response,
              items: updatedItems,
            },
          };
          return updatedRes?.response;
        }
        return res?.response;
      },
    }),
    getInventoryLocationsByWarehouseId: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/InventoryLocation/GetInventoryLocationsByWarehouseIdDropdownList`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getWarehouseInventoryLocationsDropDownList: builder.query({
      query(body: any) {
        return {
          url: `inventory/api/InventoryLocation/GetInventoryLocationsByWarehouseIdDropdownList`,
          method: 'post',
          body,
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    movePallet: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/Pallet/MovePallet`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
      invalidatesTags: ['getPalletsList', 'getInventoryList'],
    }),
    movePalletBox: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/PalletBox/MovePalletBox`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
      invalidatesTags: ['getPalletsBoxList', 'getInventoryList'],
    }),
    GetSkusByPallet: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/Pallet/GetSkusByPallet`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
      invalidatesTags: ['getPalletsBoxList', 'getInventoryList'],
    }),
    GetSkusByLocation: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/Pallet/GetSkusByInventoryLocation`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
      invalidatesTags: ['getPalletsBoxList', 'getInventoryList'],
    }),
    GetSkusByBox: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/PalletBox/GetSkusByBox`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
      invalidatesTags: ['getPalletsBoxList', 'getInventoryList'],
    }),
    getInventoryLocationType: builder.query({
      query() {
        return {
          url: `inventory/api/InventoryLocation/GetInventoryLocationTypesDropDownList`,
          method: 'get',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    inventoryItemsExport: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/InventoryAllocation/ExportInventoryItems`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    exportInventoryBulk: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/InventoryAllocation/ExportInventoryForSkuSplit`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    bulkDownloadInventory: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/InventoryAllocation/ExportInventoryForBulkUpdate`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    InventoryItemsBulk: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/InventoryAllocation/BulkMoveInventoryItems`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
      invalidatesTags: ['getPalletsBoxList', 'getInventoryList'],
    }),
    unHoldItems: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/InventoryAllocation/unHoldQuantity`,
          body,
          method: 'put',
          needError: true,
        };
      },
      invalidatesTags: ['getInventoryList'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getAllPalletsWithDetailsDropDownList: builder.query({
      query() {
        return {
          url: `inventory/api/Pallet/GetAllPalletsWithDetailsDropDownList`,
          method: 'get',
          needError: true,
        };
      },
      providesTags: ['getPalletsList'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getAllPalletBoxesWithDetailsDropDownList: builder.query({
      query() {
        return {
          url: `inventory/api/PalletBox/GetAllPalletBoxesWithDetailsDropDownList`,
          method: 'get',
          needError: true,
        };
      },
      providesTags: ['getPalletsBoxList'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getPalletsForLocationDropDownList: builder.query({
      query(body: any) {
        return {
          url: `inventory/api/Pallet/GetPalletsForLocationDropDownList`,
          method: 'post',
          body,
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getReasonForHold: builder.query({
      query(body: any) {
        return {
          url: `inventory/api/InventoryAllocation/AllocationReasonsDropdownList`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    updateInventoryEditItems: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/InventoryAllocation/Update`,
          method: 'put',
          body,
          needError: true,
        };
      },
      invalidatesTags: ['getInventoryList'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getAllInventoryLocationsDropDownList: builder.query({
      query(body: any) {
        return {
          url: `inventory/api/InventoryLocation/GetAllInventoryLocationsDropDownList`,
          method: 'get',
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    holdQuantity: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/InventoryAllocation/HoldQuantity`,
          body,
          method: 'put',
          needError: true,
        };
      },
      invalidatesTags: ['getInventoryList'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    moveSplit: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/InventoryAllocation/MoveSplitAllocation`,
          method: 'post',
          body,
          needError: true,
          successCode: 1101,
        };
      },
      invalidatesTags: ['getInventoryList'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getInventoryAuditLog: builder.query({
      query(body: any) {
        return {
          url: `inventory/api/InventoryAuditLog/Get`,
          method: 'post',
          body,
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getPrintPalletteLabels: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/Pallet/GetPrintPalletLabels`,
          method: 'post',
          body,
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getInventoryPrintBoxLabels: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/PalletBox/GetPrintPalletBoxLabels`,
          method: 'post',
          body,
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    detailedExport: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/DailyStockReport/ExportDetailed`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    consolidatedExport: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/DailyStockReport/ExportConsolidated`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    auditLogExport: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/InventoryAuditLog/ExportExcel`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getInventoryItem: builder.query({
      query(body: any) {
        return {
          url: `inventory/api/InventoryAllocation/GetInventoryItem`,
          method: 'post',
          body,
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getPalletBulk: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/Pallet/GetPalletsForLocationDropDownList`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    saveBulkUpload: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/PalletsAndBoxes/BulkSaveSkuSplit`,
          method: 'post',
          body,
          needError: true,
        };
      },
      invalidatesTags: ['getSkuSplitInfo'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    inventoryBulkUpdate: builder.mutation({
      query(body: any) {
        return {
          url: `inventory/api/InventoryAllocation/BulkUpdateInventoryItems`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
      invalidatesTags: ['getInventoryList'],
    }),
  }),
  overrideExisting: true,
});

// Export endpoints as hooks 😄
export const {
  useGetPalletDropdownQuery,
  useGetLocationDropdownQuery,
  useGetBoxDropdownQuery,
  useGetSkuTransactionHistoryMutation,
  useGetSkuDropdownMutation,
  useCreatePalletMutation,
  useCreatePalletBoxMutation,
  useExportSkuHistoryMutation,
  useGetConsolidatedDailyStockListQuery,
  useGetConsolidatedDailyStockDetailQuery,
  useGetInventoryItemsListQuery,
  useGetInventoryItemsListSearchQuery,
  useGetInventoryItemsListOutboundQuery,
  useGetB2cInventoryItemsListOutboundQuery,
  useGetInventoryLocationsByWarehouseIdMutation,
  useGetReasonForHoldQuery,
  useAdjustInventoryMutation,
  useGetInventoryLocationTypeQuery,
  useInventoryItemsExportMutation,
  useExportInventoryBulkMutation,
  useInventoryItemsBulkMutation,
  useGetWarehouseInventoryLocationsDropDownListQuery,
  useGetAllInventoryLocationsDropDownListQuery,
  useMovePalletBoxMutation,
  useMovePalletMutation,
  useGetSkusByPalletMutation,
  useGetSkusByLocationMutation,
  useGetSkusByBoxMutation,
  useGetAllPalletsWithDetailsDropDownListQuery,
  useGetAllPalletBoxesWithDetailsDropDownListQuery,
  useGetPalletsForLocationDropDownListQuery,
  useUnHoldItemsMutation,
  useUpdateInventoryEditItemsMutation,
  useHoldQuantityMutation,
  useConsolidatedExportMutation,
  useDetailedExportMutation,
  useMoveSplitMutation,
  useGetInventoryAuditLogQuery,
  useGetPrintPalletteLabelsMutation,
  useAuditLogExportMutation,
  useGetInventoryItemQuery,
  useGetInventoryPrintBoxLabelsMutation,
  useGetPalletBulkMutation,
  useSaveBulkUploadMutation,
  useInventoryBulkUpdateMutation,
  useBulkDownloadInventoryMutation
} = inventoryManagement;
