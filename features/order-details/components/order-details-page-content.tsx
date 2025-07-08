"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { SwipeableTabs } from "@/features/shared/components/swipeable-tabs"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { TasksTable } from "./tasks-table"
import { AttachmentsTable } from "./attachments-table"
import { TransportationDetails } from "./transportation-details"
import { ShippingTracking } from "./shipping-tracking"
import { PickingPacking } from "./picking-packing"
import { PricingTable } from "./pricing-table"
import { TabLoadingSkeleton } from "./tab-loading-skeleton"
import { LogsContent } from "./log-timeline"
import { WarehouseAction } from "./warehouse-action"
import { OrderInformation } from "./tabs"
import { useTabManagement } from "../hooks/use-tab-management"
import { OrderDetailsHeader } from "./order-details-header"
import { tabs, getSkeletonTypeForTab, TabType } from "../utils/tab-helpers"
import { useGetInboundDetailsMutation } from "@/lib/redux/api/orderManagement"

interface OrderDetailsPageContentProps {
  orderId: string
}

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Orders", href: "/orders" },
]

// Mock API response to simulate the API call
const getMockInboundDetails = (orderId: string) => {
  return {
    statusCode: 200,
    response: {
      createdBy: "Min Cho",
      transactionId: "I-0008448",
      orderStatusId: 2,
      taskId: null,
      orderStatusText: "Initialized",
      isSameAddressAsWarehouse: true,
      hasSplitInfo: false,
      moveType: "Inbound",
      serviceType: "B2B",
      arrivalDate: null,
      arrivalReason: null,
      previousStatusId: 1,
      previousStatusText: "Draft",
      isPackingCompleted: false,
      isShipmentLabelGenerated: false,
      isShipmentCancelled: false,
      shipmentLabelGeneratedDate: null,
      shipmentCancelledDate: null,
      isShipmentRateEstimateCalculated: false,
      isCustomerActionMailSent: false,
      createAssociateOutbound: false,
      associatedInboundOrderId: "",
      isAWIActionMailSent: false,
      isForceComplete: false,
      isInternational: false,
      returnItemAction: null,
      orderCreationTypeId: 2,
      shipmentCancellationStatus: "",
      customer: {
        customerId: "mF3LXgiq9qF_O_R_W_A_R_DF7sJLUaeSwQ==",
        warehouseId: "DMIwUCPeP_L_U_SQ8gyCznKnba6g==",
        firstName: "3R Logistics",
        lastName: ""
      },
      address: {
        fromAddress: {
          id: "5hv0b6y1IAmASHyP_L_U_SlVuOqw==",
          businessName: "3R Logistics",
          address1: "901 Castle Rd",
          address2: "",
          city: "Secacus",
          zipCode: "07094",
          shipFromName: "3R Logistics",
          stateName: "New Jersey",
          stateId: "A2wu1aVxXElLJljXBRTU6g==",
          stateCode: "NJ",
          countryName: "United States",
          countryId: "drns4F_O_R_W_A_R_DAgNIRJVteGPHuYsw=="
        },
        toAddress: {
          id: "2O5nq3G7JJGkglJvKqZgFQ==",
          businessName: "AWI-NY",
          address1: "700 Penhorn Ave.",
          address2: "Suite 1",
          city: "Secaucus",
          zipCode: "07094",
          shipToName: "AWI-NY",
          stateName: "New Jersey",
          stateId: "A2wu1aVxXElLJljXBRTU6g==",
          stateCode: "NJ",
          countryName: "United States",
          countryId: "drns4F_O_R_W_A_R_DAgNIRJVteGPHuYsw=="
        }
      },
      inboundDetails: {
        id: "SHot2P_L_U_SoFeHb3ThF_O_R_W_A_R_DHuHIl7w==",
        poNumber: "",
        receiptAdviceNumber: "",
        referenceId: "Test563827878923r",
        orderType: "B2B",
        orderTypeId: "iKrF_O_R_W_A_R_D12F6XfBpxJlPFSDVFA==",
        notes: "",
        qcNotes: "",
        reasonForReturn: "",
        associatedOutboundTransactionId: ""
      },
      notes: "",
      completionDate: null,
      lineItems: [
        {
          id: "qwJVOF_O_R_W_A_R_DkBnYZ4YyQw87a5JA==",
          customerSkuId: "a7x66WzRkqjdSDumDLhJ7g==",
          sku: "test",
          isNonSku: false,
          isBundle: false,
          itemName: "testitem",
          universalProductCode: "123",
          description: "test",
          harmonizedTrafficCode: null,
          countryOfOrigin: null,
          countryOfOriginId: null,
          qty: "1",
          lotNumber: null,
          expirationDate: null,
          orderQuantity: 1,
          hasUpdatedActualQuantity: false
        }
      ],
      transloadLineItems: null,
      deliveryAppointments: {
        id: "lPbAvBtUFpZ8gX4WFt088g==",
        estimatedArrivalToWarehouseDate: "2025-06-25T18:30:00Z",
        estimatedArrivalToWarehouseFromTime: "2025-06-24T09:30:00.604Z",
        estimatedArrivalToWarehouseToTime: "2025-06-24T11:30:00.805Z"
      },
      handlingDetails: {
        id: "aBZfOvtMW6Im4vEoG8MMHQ==",
        transportationArrangementName: "AWI",
        transportationArrangementId: "XglTKWYP_L_U_SJFzb514pZlA6yw==",
        transportationMethodName: "Truck",
        transportationMethodId: "hJ9ekMFB2oSjfI7zRzdZRA==",
        loadTypeName: "",
        loadTypeId: "",
        cargoTypeName: "",
        cargoTypeId: "",
        trailerTypeName: "20 Container",
        trailerTypeId: "sNxBGsTOZP_L_U_SDYigi4GDLUdg==",
        transportationTypeId: "",
        transportationTypeName: ""
      },
      transportationSchedule: {
        id: "s6wTpCitj1AHxP_L_U_S1Wy91leg==",
        departureOrigin: "2025-06-25T18:30:00Z",
        containerETA: "2025-06-26T18:30:00Z",
        containerATA: "2025-06-27T18:30:00Z",
        containerPickupLFD: null,
        containerReturnLFD: null
      },
      carrierDetails: {
        id: "MDeJxZEafbqZWf5d3G4bWw==",
        carrier: "Advanced International Freight",
        carrierId: "KlO39nKSHMhlC0gmmPLG2w==",
        serviceType: "3-Day Select",
        serviceTypeId: "HTzr5BlFCF_O_R_W_A_R_DDdyeTZQaSdtQ==",
        scac: "",
        accountNumber: "",
        accountZipOrPostalCode: "",
        billingType: "",
        billingTypeId: "",
        customCarrierName: "",
        isCustomCarrier: false,
        customServiceName: "",
        isCustomCarrierService: false,
        isIntegrated: false,
        isComparedRateChoosed: false,
        useShippingMethod: false,
        orderShippingRateEstimateId: "",
        isShippingMethod: null,
        shippingMethod: null,
        isInternational: null
      },
      orderTrackingDetails: {
        shippingAndTracking: {
          carrier: "Advanced International Freight",
          carrierService: "3-Day Select",
          trackingNumber: "76429018736542saas7",
          transitTime: null,
          trackingUrl: ""
        },
        shippingAndTrackingDetails: null
      },
      deliveryDetails: {
        id: "ETgmrzsF_O_R_W_A_R_DhcjGY5VJA3Ta8A==",
        billOfLadingNumber: "BOL29836483892",
        trackingNumber: "76429018736542saas7",
        trailerOrContainerNumber: "",
        loadNumber: "",
        sealNumber: "",
        doorNumber: ""
      },
      orderSmallParcelShippingDetails: {
        id: null,
        requireReturnReceipt: null,
        residentialDelivery: null,
        requireInsurance: null,
        insuranceAmount: null,
        saturdayDelivery: null,
        deliveryConfirmationId: null,
        deliveryConfirmationName: null,
        internationalContentsTypeId: null,
        internationalContentsTypeName: null,
        internationalNonDeliveryTypeId: null,
        internationalNonDeliveryTypeName: null,
        insuranceTypeId: null,
        insuranceTypeName: null,
        customsValue: null
      },
      instructions: {
        id: "oGF_O_R_W_A_R_DAASyIQ0vPumOSK0u4ug==",
        warehouseInstructions: "",
        carrierInstructions: ""
      },
      attachments: [
        {
          id: "YpBzGRha4q3BBJBWOnzk2g==",
          fileTempName: "a280b9c2-235c-49ba-aefb-520bb14b6be2_638863603295465887.pdf",
          fileActualName: "Receipt Ticket - Advanced Warehouse (1).pdf",
          categoryName: "Bill of Lading",
          categoryId: "MP_L_U_Sq3ceBaFvJuJ60RUQRG6Q=="
        }
      ],
      orderLogs: [
        {
          id: "GCP_L_U_Su2jIMXQF_O_R_W_A_R_DO51P_L_U_SXp2cgmw==",
          orderDetails: "Order Initialized.",
          notes: null,
          user: "Min Cho",
          createdDate: "2025-06-24T11:13:18.5240673Z"
        },
        {
          id: "b2Y9bVvYsg7HEuLXP_L_U_SteTWA==",
          orderDetails: "Order Draft.",
          notes: null,
          user: "Min Cho",
          createdDate: "2025-06-24T11:12:43.0849162Z"
        },
        {
          id: "krmOIGvTg66S6bLaKFZMGA==",
          orderDetails: "Order Pending AWI Action.",
          notes: null,
          user: "Min Cho",
          createdDate: "2025-06-24T11:11:50.8024986Z"
        },
        {
          id: "ysRDjBRIexYoTqmAaYmkXg==",
          orderDetails: "Order draft creation initiated.",
          notes: null,
          user: "Min Cho",
          createdDate: "2025-06-24T11:10:30.1531254Z"
        }
      ],
      taskLogs: [
        {
          id: "task-1",
          taskDetails: "Picking - Started",
          notes: null,
          user: "John Doe",
          createdDate: "2025-06-23T12:10:00Z",
          taskStatus: "Started"
        },
        {
          id: "task-2",
          taskDetails: "Picking - Paused",
          notes: "Awaiting additional inventory",
          user: "John Doe",
          createdDate: "2025-06-22T12:10:00Z",
          taskStatus: "Paused"
        },
        {
          id: "task-3",
          taskDetails: "Picking - Started",
          notes: null,
          user: "John Doe",
          createdDate: "2025-06-21T12:10:00Z",
          taskStatus: "Started"
        },
        {
          id: "task-4",
          taskDetails: "Move inventory to B2C Shelf - Completed",
          notes: null,
          user: "John Doe",
          createdDate: "2025-06-20T12:10:00Z",
          taskStatus: "Completed"
        },
        {
          id: "task-5",
          taskDetails: "Move inventory to B2C Shelf - Started",
          notes: null,
          user: "John Doe",
          createdDate: "2025-06-19T12:10:00Z",
          taskStatus: "Started"
        }
      ]
    },
    traceId: "0HNDCLERCMB7N:0000000B",
    message: "OK"
  };
};

export function OrderDetailsPageContent({ orderId }: OrderDetailsPageContentProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeTab, loading: tabLoading, handleTabChange } = useTabManagement("order-details");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize the API hook from RTK Query
  const [getInboundDetails, { isLoading: isApiLoading }] = useGetInboundDetailsMutation();

  // Fetch order details on component mount
  useEffect(() => {
    setLoading(true);
    
    // Decode the orderId to remove any URL-encoded characters (e.g., %3D becomes =)
    const decodedOrderId = decodeURIComponent(orderId);
    
    // Use the API hook to fetch data with decoded orderId
    getInboundDetails({ orderId: decodedOrderId })
      .unwrap()
      .then((response: any) => {
        console.log("API Response:", response); // Debug log to see the response structure
        
        // Check for successful response with data
        if (response) {
          if (response.response) {
            // Standard response structure
            console.log("Setting order details from response.response:", response.response);
            setOrderDetails(response.response);
          } else if (response.data) {
            // Alternative response structure
            console.log("Setting order details from response.data:", response.data);
            setOrderDetails(response.data);
          } else if (typeof response === 'object' && Object.keys(response).length > 0) {
            // Handle case where response might be the data directly
            console.log("Setting order details from direct response:", response);
            setOrderDetails(response);
          } else {
            console.warn("Response exists but doesn't contain expected data structure:", response);
          }
        } else {
          console.warn("Empty response received from API");
        }
      })
      .catch((error: unknown) => {
        console.error('Error fetching order details:', error);
        // Fallback to mock data if API fails
        const mockResponse = getMockInboundDetails(decodedOrderId);
        console.log("Mock Response:", mockResponse); // Debug log for mock data
        if (mockResponse && mockResponse.response) {
          setOrderDetails(mockResponse.response);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId, getInboundDetails]);

  // Determine loading state
  const isLoading = loading || tabLoading || isApiLoading;

  const renderTabContent = (tabId: string) => {
    if (isLoading) {
      return <TabLoadingSkeleton type={getSkeletonTypeForTab(tabId as TabType)} />;
    }

    if (!orderDetails) {
      return (
        <Card className="h-full flex flex-col">
          <div className="p-6">
            <p className="text-gray-500">Failed to load order details</p>
          </div>
        </Card>
      );
    }

    switch (tabId) {
      case "order-details":
        return <OrderInformation orderDetails={orderDetails} />;
      case "tasks":
        return <TasksTable orderDetails={orderDetails} />;
      case "attachments":
        return <AttachmentsTable attachments={orderDetails.attachments || []} />;
      case "transportation":
        return <TransportationDetails 
          handlingDetails={orderDetails.handlingDetails || {}}
          transportationSchedule={orderDetails.transportationSchedule || {}}
          carrierDetails={orderDetails.carrierDetails || {}}
        />;
      case "shipping":
        return <ShippingTracking 
          trackingDetails={orderDetails.orderTrackingDetails || {}}
          deliveryDetails={orderDetails.deliveryDetails || {}}
        />;
      case "picking":
        return <PickingPacking lineItems={orderDetails.lineItems || []} />;
      case "pricing":
        return (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="font-bold text-lg p-2">Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <PricingTable orderDetails={orderDetails || {}} />
            </CardContent>
          </Card>
        );
      case "log":
        return (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="font-bold text-lg p-2">Log Timeline</CardTitle>
            </CardHeader>
            <CardContent className="border-none">
              <LogsContent logs={orderDetails.orderLogs || []} taskLogs={orderDetails.taskLogs || []} />
            </CardContent>
          </Card>
        );
      case "warehouse":
        return (
          <Card className="h-full flex flex-col p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-xl font-semibold">Warehouse Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-0 border-none">
              <WarehouseAction 
                instructions={orderDetails.instructions || {}} 
                lineItems={orderDetails.lineItems || []} 
              />
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card className="h-full flex flex-col">
            <div className="p-6">
              <p className="text-gray-500">Content not found</p>
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="bg-dashboard-background h-screen flex flex-col overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 flex-shrink-0">
          <div className="max-w-dashboard mx-auto w-full">
            {/* Page Header */}
            <div className="mb-dashboard-gap">
              <OrderDetailsHeader
                orderId={orderDetails?.transactionId || orderId}
                orderType={orderDetails?.serviceType || "Loading..."}
                status={orderDetails?.orderStatusText || "Loading..."}
                shippingStatus={orderDetails?.isShipmentLabelGenerated 
                  ? (orderDetails?.isShipmentCancelled ? "Shipping Label Cancelled" : "Shipping Label Generated") 
                  : "No Shipping Label"}
                breadcrumbItems={[...breadcrumbItems, { label: orderDetails?.transactionId || orderId }]}
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
              />
            </div>
          </div>
        </div>

        {/* Swipeable Tabs - Full width and height */}
        <div className="flex-1 overflow-hidden">
          <SwipeableTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            renderContent={renderTabContent}
          />
        </div>
      </div>
    </div>
  );
}
