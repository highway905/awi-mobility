import { api } from '@/lib/redux/api';

// Passing Tag arguments to builder api to use automatic re-fetching 😀
const tagInjection: any = api.enhanceEndpoints({
  addTagTypes: [
    'OrderInboundApi',
    'getInboundOrder',
    'getSkuSplitInfo',
    'orderListRefresh',
    'orderAttachment',
    'validateOrder',
    'getOrderDetails',
    'stepperStatus',
    'boxLabelDetails',
    'boxLabels',
    'palletLabels',
    'getShippingList',
    'loadOrderAttachment',
    'getCustomDetailsOrder',
    'getOutboundOrderDetails',
    'balanceGet'
  ],
});

export const orderManagement: any = tagInjection.injectEndpoints({
  endpoints: (builder: any) => ({
    createInboundAndAddress: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/CreateInboundAndAddressInfo`,
          method: 'post',
          body,
          needError: true,
        };
      },
      invalidatesTags: ['getCustomersList', 'getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    updateInboundAndAddress: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/UpdateInboundAndAddressInfo/UpdateInboundAndAddressInfo`,
          method: 'post',
          body,
          needError: true,
        };
      },
      invalidatesTags: ['getCustomersList', 'getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    createOutboundAndAddress: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/OutboundOrder/CreateOutboundAndAddressInfo`,
          method: 'post',
          body,
          needError: true,
        };
      },
      invalidatesTags: ['getCustomersList', 'getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    updateOutboundAndAddress: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/OutboundOrder/UpdateOutboundAndAddressInfo`,
          method: 'post',
          body,
          needError: true,
        };
      },
      invalidatesTags: [
        'getCustomersList',
        'getInboundOrder',
        'getOutboundOrderDetails',
        'getOutboundOrder',
      ],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getOrders: builder.query({
      query(body: any) {
        return {
          url: `core/api/Customer/GetAll`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getAllOrderAttachments: builder.query({
      query(body: any) {
        return {
          url: body?.orderId
            ? `order/api/FulfillmentInboundOrder/GetAllOrderAttachmentCategories?orderId=${body?.orderId}`
            : `order/api/FulfillmentInboundOrder/GetAllOrderAttachmentCategories`,
          body,
          method: 'get',
          needError: true,
        };
      },
      providesTags: ['orderAttachment'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getTransportationDropdownList: builder.query({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/GetAllTransportationInfoDropdownList`,
          body,
          method: 'get',
          needError: false,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getCarrierDropdownList: builder.query({
      query(body: any) {
        return {
          url: `core/api/Carrier/GetAllDropdownList`,
          body,
          method: 'post',
          needError: false,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getCarrierDropdownListShippingLabel: builder.query({
      query(body: any) {
        return {
          url: `lmdordershipment/api/Carrier/GetAllDropdownList`,
          body,
          method: 'post',
          needError: false,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getCustomerDropdownList: builder.query({
      query(body: any) {
        return {
          url: `core/api/Customer/GetAllDropdownList`,
          body,
          method: 'get',
          needError: false,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getWarehouseLocationDropdownList: builder.query({
      query(body: any) {
        return {
          url: `core/api/Warehouse/GetAll`,
          body,
          method: 'get',
          needError: false,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getCustomerOrder: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/Customer/Get`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    orderBatchUpload: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/BulkUploadInboundOrderFullfillment`,
          method: 'post',
          body,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          needError: true,
        };
      },
      invalidatesTags: ['OrderInboundApi', 'orderListRefresh'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    uploadLineItems: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/AddLineItems`,
          method: 'post',
          body,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          needError: true,
        };
      },
      invalidatesTags: ['getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    uploadTransportation: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/TransportationInfo/upsert`,
          method: 'post',
          body,
          needError: true,
        };
      },
      invalidatesTags: ['getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getBulkUploadTemplate: builder.mutation({
      query() {
        return {
          url: `order/api/FulfillmentInboundOrder/BulkUploadInboundOrderTemplate`,
          method: 'get',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getStepperStatus: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/ValidateOrder`,
          method: 'post',
          body,
          needError: true,
        };
      },
      providesTags: ['stepperStatus'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getPrintPalletLabels: builder.query({
      query(body: any) {
        return {
          url: `order/api/PalletsAndBoxes/GetPrintPalletLabels`,
          method: 'post',
          body,
          needError: false,
        };
      },
      providesTags: ['palletLabels'],
      transformResponse: (res: any) => {
        console.log('res', res);
        return res?.response;
      },
    }),
    getPrintBoxLabels: builder.query({
      query(body: any) {
        return {
          url: `order/api/PalletsAndBoxes/GetPrintBoxLabels`,
          method: 'post',
          body,
          needError: true,
        };
      },
      providesTags: ['boxLabels'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getPrintBoxLabelDetails: builder.query({
      query(body: any) {
        return {
          url: `order/api/PalletsAndBoxes/GetPrintBoxLabelDetails`,
          method: 'post',
          body,
          needError: true,
        };
      },
      providesTags: ['boxLabelDetails'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getCarrierServiceList: builder.mutation({
      query(body: any) {
        return {
          url: `core/api/CarrierServices/GetAllCarrierServicesByCarriersDropdownList`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getCarrierServiceListShippingLabel: builder.mutation({
      query(body: any) {
        return {
          url: `lmdordershipment/api/Carrier/GetAllCarrierServicesByCarriersDropdownList`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    uploadAttachment: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/Attachment/Upload`,
          body,
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    downloadAttachment: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/Attachment/Download`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    syncPlatform: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/OutboundOrder/ManualShopifySync`,
          body,
          method: 'post',
          needError: true,
        };
      },
      invalidatesTags: ['getOutboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    DuplicateOrder: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/Order/DuplicateOrders`,
          body,
          method: 'post',
          needError: true,
        };
      },
      invalidatesTags: ['orderListRefresh'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    updateAttachment: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/Attachment/Update`,
          body,
          method: 'post',
          needError: true,
          successCode: 801,
        };
      },
      invalidatesTags: ['getInboundOrder', 'stepperStatus', 'orderAttachment', 'validateOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getInboundDetails: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/Get`,
          body,
          method: 'post',
          needError: true,
        };
      },
      providesTags: ['getOrderDetails'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    GetEmailOfOrder: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/GetEmailsForOrder`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getInboundOrder: builder.query({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/Get`,
          body,
          method: 'post',
          needError: true,
        };
      },
      providesTags: ['getInboundOrder'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getCustomsDetailsOfOrder: builder.query({
      query(body: any) {
        return {
          url: `order/api/OutboundOrder/GetCustomsDetailsOfOrder`,
          body,
          method: 'post',
          needError: true,
        };
      },
      providesTags: ['getCustomDetailsOrder'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getOrderList: builder.query({
      query(body: any) {
        return {
          url: `order/api/Order/GetAll`,
          method: 'post',
          body,
        };
      },
      providesTags: ['orderListRefresh'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getOrderListSearch: builder.query({
      query(body: any) {
        return {
          url: `core/api/GlobalSearch/SearchOrders`,
          method: 'post',
          body,
        };
      },
      providesTags: ['orderListRefreshSearch'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    deleteAttachment: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/Attachment/Delete`,
          body,
          method: 'delete',
          needError: true,
        };
      },
      invalidatesTags: ['getInboundOrder', 'validateOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    updateCustomsDetailsOfOrder: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/OutboundOrder/UpdateCustomsDetailsOfOrder`,
          body,
          method: 'post',
          needError: true,
        };
      },
      invalidatesTags: ['getCustomDetailsOrder', 'getOutboundOrderDetails'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    confirmOrder: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/ConfirmOrder`,
          body,
          method: 'post',
          needError: true,
        };
      },
      invalidatesTags: ['orderListRefresh', 'getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getOrderFilter: builder.query({
      query() {
        return {
          url: `order/api/Order/GetFilterDropdowns`,
          method: 'get',
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    orderExport: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/Order/Export`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    UpdateInboundAddress: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/UpdateAddress`,
          body,
          method: 'post',
          needError: true,
        };
      },
      invalidatesTags: ['getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getSkuSplit: builder.query({
      query(body: any) {
        return {
          url: `order/api/PalletsAndBoxes/GetSkuSplitInfo`,
          body,
          method: 'post',
        };
      },
      providesTags: ['getSkuSplitInfo'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getPalletSplit: builder.query({
      query(body: any) {
        return {
          url: `order/api/PalletsAndBoxes/GetPalletSplitInfo`,
          body,
          method: 'post',
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    updateOrderInboundDetails: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/UpdateInboundDetails`,
          method: 'post',
          body,
          needError: true,
          successCode: 901,
        };
      },
      invalidatesTags: ['getInboundOrder', 'orderAttachment'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    updateOrderHandlingDetails: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/UpdateHandlingDetails`,
          method: 'post',
          body,
          needError: true,
          successCode: 901,
        };
      },
      invalidatesTags: ['getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    updateOrderCarrierDetails: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/UpdateCarrierDetails`,
          method: 'post',
          body,
          needError: true,
          successCode: 901,
        };
      },
      invalidatesTags: ['getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    updateOrderDeliveryDetails: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/UpdateDeliveryDetails`,
          method: 'post',
          body,
          needError: true,
          successCode: 901,
        };
      },
      invalidatesTags: ['getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    updateOrderDeliveryAppointmentDetails: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/UpdateDeliveryAppointments`,
          method: 'post',
          body,
          needError: true,
          successCode: 901,
        };
      },
      invalidatesTags: ['getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    updateInstructions: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/UpdateInstructions`,
          method: 'post',
          body,
          needError: true,
          successCode: 901,
        };
      },
      invalidatesTags: ['getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    updateTransportationSchedule: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/UpdateTransportationSchedule`,
          method: 'post',
          body,
          needError: true,
          successCode: 901,
        };
      },
      invalidatesTags: ['getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    orderCancel: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/CancelOrder`,
          method: 'post',
          body,
        };
      },
      invalidatesTags: ['orderListRefresh', 'getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    saveSkuSplit: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/PalletsAndBoxes/SaveSkuSplit`,
          method: 'post',
          body,
          needError: true,
          successCode: 902,
        };
      },
      invalidatesTags: ['getSkuSplitInfo', 'boxLabels', 'boxLabelDetails', 'palletLabels'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    orderHold: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/HoldOrder`,
          method: 'post',
          body,
          needError: true,
        };
      },
      invalidatesTags: [
        'orderListRefresh',
        'getInboundOrder',
        'getTransloadOrderDetails',
        'getTransloadInboundOrder',
      ],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    orderResume: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/ResumeOrder`,
          method: 'post',
          body,
          needError: true,
        };
      },
      invalidatesTags: ['orderListRefresh', 'getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    OrderPendingCustomer: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/PendingCustomerAction`,
          method: 'post',
          body,
          needError: true,
        };
      },
      invalidatesTags: ['orderListRefresh', 'getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    OrderReadyToProcess: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/ReadyToProcess`,
          method: 'post',
          body,
          needError: true,
        };
      },
      invalidatesTags: ['orderListRefresh', 'getInboundOrder', 'orderAttachment'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    OrderForceCancel: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/ForceCancelOrder`,
          method: 'post',
          body,
          needError: true,
        };
      },
      invalidatesTags: ['orderListRefresh', 'getInboundOrder', 'orderAttachment', 'orderListRefreshSearch'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    OrderForceCancelOutbound: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/OutboundOrder/ForceCancelOrders`,
          method: 'post',
          body,
          needError: true,
        };
      },
      invalidatesTags: ['orderListRefresh', 'getInboundOrder', 'orderAttachment', 'getOutboundOrder', 'orderListRefreshSearch'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    OrderUnloading: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/Unloading`,
          method: 'post',
          body,
          needError: false,
        };
      },
      invalidatesTags: ['getInboundOrder', 'orderAttachment'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    OrderCompleted: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/CompleteOrder`,
          method: 'post',
          body,
          needError: false,
        };
      },
      invalidatesTags: ['getInboundOrder', 'orderAttachment'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    OrderClosed: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/Closed`,
          method: 'post',
          body,
          needError: false,
        };
      },
      invalidatesTags: ['getInboundOrder', 'orderAttachment'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    OrderPutAway: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/PutAwayOrder`,
          method: 'post',
          body,
          needError: false,
        };
      },
      invalidatesTags: ['getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    OrderReceiving: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/PalletsAndBoxes/PrintPallets`,
          method: 'post',
          body,
          needError: false,
          successCode: 1003,
        };
      },
      invalidatesTags: ['getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getPalletDetails: builder.query({
      query(body: any) {
        return {
          url: `order/api/PalletsAndBoxes/GetPalletDetails`,
          body,
          method: 'post',
        };
      },
      providesTags: ['getPalletDetails'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getSkuDetails: builder.query({
      query(body: any) {
        return {
          url: `order/api/PalletsAndBoxes/GetSkuSplitDetails`,
          body,
          method: 'post',
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    updateActualArrivalDateTime: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/Delivered`,
          method: 'post',
          body,
          needError: true,
        };
      },
      invalidatesTags: ['getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    UpdateCompleteDateTime: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/Order/UpdateCompletionDate`,
          method: 'post',
          body,
          needError: true,
        };
      },
      invalidatesTags: ['getInboundOrder', 'getOutboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    OrderSendEmail: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/SendEmailForOrderNotification`,
          method: 'post',
          body,
          needError: true,
        };
      },
      invalidatesTags: ['getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getShippingRates: builder.query({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/GetShippingRates`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    fetchRatesShippingLabel: builder.mutation({
      query(body: any) {
        return {
          url: `lmdordershipment/api/LmdOrderShipment/GetRate`,
          method: 'post',
          body,
          needError: false,
        };
      },
      invalidatesTags: ['getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    GenerateShippingLabel: builder.mutation({
      query(body: any) {
        return {
          url: `lmdordershipment/api/LmdOrderShipment/Create`,
          method: 'post',
          body,
          needError: true,
        };
      },
      invalidatesTags: ['balanceGet'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    ReadyToShipShippingLabel: builder.mutation({
      query(body: any) {
        return {
          url: `lmdordershipment/api/LmdOrderShipment/ChangeStatus`,
          method: 'post',
          body,
          needError: false,
        };
      },
      invalidatesTags: ['getShippingList', 'balanceGet'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getShippingRatesShippingLabel: builder.query({
      query(body: any) {
        return {
          url: `lmdordershipment/api/LmdOrderShipment/GetRate`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    orderLineItemExport: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/LineItemsToExcel`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    updateCarrierDetails: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/UpdateCarrierDetails`,
          body,
          method: 'post',
          needError: true,
          successCode: 850,
        };
      },
      invalidatesTags: ['getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getPrintReceiptTicket: builder.query({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/PrintReceiptTicket`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    getOrderValidator: builder.query({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/ValidateOrder`,
          body,
          method: 'post',
          needError: true,
        };
      },
      providesTags: ['validateOrder'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    createShipmentOrLabel: builder.query({
      query(payload: { orderId: string }) {
        return {
          url: `order/api/FulfillmentInboundOrder/CreateShipmentOrLabel`,
          method: 'post',
          body: payload,
          needError: true,
        };
      },
      invalidatesTags: ['getOrderDetails', 'getInboundOrder', 'getTransloadInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    cancelShipment: builder.mutation({
      query(payload: { orderId: string }) {
        return {
          url: `order/api/FulfillmentInboundOrder/CancelShipment`,
          method: 'post',
          body: payload,
          needError: true,
        };
      },
      // invalidatesTags: ['customerBalanceUpdate'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    deleteSkuSplit: builder.mutation({
      query(payload: { orderId: string }) {
        return {
          url: `order/api/PalletsAndBoxes/DeleteSkuSplit`,
          method: 'delete',
          body: payload,
          needError: true,
          successCode: 1002,
        };
      },
      invalidatesTags: ['getOrderDetails', 'getInboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    outboundBulkUploadTemplate: builder.mutation({
      query() {
        return {
          url: `order/api/OutboundOrder/GetBulkUploadOutboundFulfillmentTemplate`,
          method: 'get',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    AddOutboundLineItems: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/OutboundOrder/AddOutboundItems`,
          method: 'post',
          body,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          needError: false,
        };
      },
      invalidatesTags: ['getOutboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    AddOutboundB2cLineItems: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/OutboundOrder/AddOutboundB2CItems`,
          method: 'post',
          body,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          needError: false,
        };
      },
      invalidatesTags: ['getOutboundOrder'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    outboundBulkUpload: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/OutboundOrder/BulkUploadOutboundFulfillments`,
          method: 'post',
          body,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          needError: true,
        };
      },
      invalidatesTags: ['OrderInboundApi', 'orderListRefresh'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    outboundBulkUploadB2CTemplate: builder.mutation({
      query() {
        return {
          url: `order/api/OutboundOrder/GetBulkUploadOutboundB2CTemplate`,
          method: 'get',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    outboundBulkUploadB2C: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/OutboundOrder/BulkUploadOutboundB2C`,
          method: 'post',
          body,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          needError: true,
        };
      },
      invalidatesTags: ['OrderInboundApi', 'orderListRefresh'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    b2BPackingDraft: builder.mutation({
      query(payload: any) {
        return {
          url: `order/api/Packing/SaveB2BPackingDraft`,
          method: 'post',
          body: payload,
          needError: true,
          successCode: 1202,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    printBoxes: builder.mutation({
      query(payload: { orderId: string }) {
        return {
          url: `order/api/PalletsAndBoxes/PrintBoxes`,
          method: 'post',
          body: payload,
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getTimeStampsList: builder.query({
      query(body: any) {
        return {
          url: `order/api/Order/GetAllOrderTimestamps`,
          method: 'post',
          body,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    orderTimestampsExport: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/Order/ExportOrderTimestamps`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getMultipleOrderAttachmentList: builder.query({
      query(body: any) {
        return {
          url: `order/api/BulkAction/LoadOrderAttachments`,
          body,
          method: 'post',
          needError: true,
        };
      },
      providesTags: ['loadOrderAttachment'],
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    multipleOrderUpdateAttachment: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/Attachment/Update`,
          body,
          method: 'post',
          needError: true,
          successCode: 801,
        };
      },
      invalidatesTags: ['loadOrderAttachment'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    multipleOrderInboundDeleteAttachment: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/FulfillmentInboundOrder/Attachment/Delete`,
          body,
          method: 'delete',
          needError: true,
        };
      },
      invalidatesTags: ['loadOrderAttachment'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
    getOrderDetailsForCombineB2C: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/Order/GetOrderDetailsForCombine`,
          body,
          method: 'post',
          needError: true,
        };
      },
      transformResponse: (res: any) => {
        return res?.response;
      },
    }),
    combineB2COrders: builder.mutation({
      query(body: any) {
        return {
          url: `order/api/OutboundOrder/CombineB2COrders`,
          body,
          method: 'post',
          needError: true,
        };
      },
      invalidatesTags: ['orderListRefresh'],
      transformResponse: (res: any) => {
        return res;
      },
    }),
  }),
  overrideExisting: true,
});

// auto-generated based on the defined endpoints.
export const {
  useGetStepperStatusMutation,
  useOrderSendEmailMutation,
  useGetOrdersQuery,
  useGetCustomerDropdownListQuery,
  useGetCarrierDropdownListQuery,
  useGetCarrierDropdownListShippingLabelQuery,
  useGetWarehouseLocationDropdownListQuery,
  useCreateInboundAndAddressMutation,
  useUpdateInboundAndAddressMutation,
  useCreateOutboundAndAddressMutation,
  useUpdateOutboundAndAddressMutation,
  useGetAllOrderAttachmentsQuery,
  useGetTransportationDropdownListQuery,
  useOrderPendingCustomerMutation,
  useOrderUnloadingMutation,
  useOrderCompletedMutation,
  useOrderClosedMutation,
  useOrderReceivingMutation,
  useOrderPutAwayMutation,
  useOrderReadyToProcessMutation,
  useGetCustomerOrderMutation,
  useOrderBatchUploadMutation,
  useUploadLineItemsMutation,
  useAddOutboundLineItemsMutation,
  useAddOutboundB2cLineItemsMutation,
  useUploadTransportationMutation,
  useGetBulkUploadTemplateMutation,
  useGetCarrierServiceListMutation,
  useGetCarrierServiceListShippingLabelMutation,
  useUploadAttachmentMutation,
  useDownloadAttachmentMutation,
  useUpdateAttachmentMutation,
  useGetInboundDetailsMutation,
  useGetInboundOrderQuery,
  useGetEmailOfOrderMutation,
  useGetOrderListQuery,
  useGetOrderListSearchQuery,
  useDeleteAttachmentMutation,
  useConfirmOrderMutation,
  useGetOrderFilterQuery,
  useOrderExportMutation,
  useUpdateInboundAddressMutation,
  useGetSkuSplitQuery,
  useGetPalletSplitQuery,
  useUpdateOrderInboundDetailsMutation,
  useUpdateOrderHandlingDetailsMutation,
  useUpdateOrderCarrierDetailsMutation,
  useUpdateOrderDeliveryDetailsMutation,
  useUpdateOrderDeliveryAppointmentDetailsMutation,
  useOrderCancelMutation,
  useOrderHoldMutation,
  useOrderResumeMutation,
  useSaveSkuSplitMutation,
  useGetPalletDetailsQuery,
  useGetSkuDetailsQuery,
  useUpdateActualArrivalDateTimeMutation,
  useUpdateCompleteDateTimeMutation,
  useGetPrintPalletLabelsQuery,
  useGetPrintBoxLabelsQuery,
  useGetPrintBoxLabelDetailsQuery,
  useGetShippingRatesQuery,
  useGetShippingRatesShippingLabelQuery,
  useFetchRatesShippingLabelMutation,
  useGenerateShippingLabelMutation,
  useReadyToShipShippingLabelMutation,
  useGetCustomsDetailsOfOrderQuery,
  useUpdateCustomsDetailsOfOrderMutation,
  useOrderLineItemExportMutation,
  useUpdateCarrierDetailsMutation,
  useGetPrintReceiptTicketQuery,
  useUpdateInstructionsMutation,
  useUpdateTransportationScheduleMutation,
  useGetOrderValidatorQuery,
  useCreateShipmentOrLabelQuery,
  useCancelShipmentMutation,
  useDeleteSkuSplitMutation,
  useOutboundBulkUploadMutation,
  useOutboundBulkUploadTemplateMutation,
  useOutboundBulkUploadB2CMutation,
  useOutboundBulkUploadB2CTemplateMutation,
  useB2BPackingDraftMutation,
  usePrintBoxesMutation,
  useGetTimeStampsListQuery,
  useOrderTimestampsExportMutation,
  useSyncPlatformMutation,
  useDuplicateOrderMutation,
  useGetMultipleOrderAttachmentListQuery,
  useMultipleOrderUpdateAttachmentMutation,
  useMultipleOrderInboundDeleteAttachmentMutation,
  useGetOrderDetailsForCombineB2CMutation,
  useCombineB2COrdersMutation,
  useOrderForceCancelMutation,
  useOrderForceCancelOutboundMutation,
} = orderManagement;
