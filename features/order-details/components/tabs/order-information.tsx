"use client"

import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/utils/helper" // Assuming you have a date formatter utility

// Define interface for the OrderInformation component
interface InboundOrderDetails {
  transactionId: string;
  createdBy: string;
  moveType: string;
  orderStatusText: string;
  inboundDetails: {
    poNumber: string;
    receiptAdviceNumber: string;
    referenceId: string;
    orderType: string;
  };
  taskId: string | null;
  address: {
    fromAddress: AddressDetails;
    toAddress: AddressDetails;
  };
  customer: {
    firstName: string;
    lastName: string;
  };
}

interface AddressDetails {
  businessName: string;
  address1: string;
  address2: string;
  city: string;
  stateName: string;
  zipCode: string;
  countryName: string;
}

interface OrderInformationProps {
  orderDetails: InboundOrderDetails;
}

export function OrderInformation({ orderDetails }: OrderInformationProps) {
  const { 
    transactionId,
    createdBy, 
    moveType,
    inboundDetails,
    taskId,
    address,
    customer
  } = orderDetails;

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="space-y-6 overflow-auto py-4">
        {/* Basic Information Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Transaction ID</label>
                <div className="font-medium">{transactionId}</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Transaction Type</label>
                <div className="font-medium">{moveType}</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Reference ID</label>
                <div className="font-medium">{inboundDetails.referenceId || '-'}</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Task ID</label>
                <div className="font-medium">{taskId || '-'}</div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Customer</label>
                <div className="font-medium">
                  {customer.firstName} {customer.lastName}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Order Type</label>
                <div className="font-medium">{inboundDetails.orderType}</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Receipt Advice Number</label>
                <div className="font-medium">{inboundDetails.receiptAdviceNumber || '-'}</div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Created By</label>
                <div className="font-medium">{createdBy}</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Type</label>
                <div className="font-medium">{moveType}</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">PO Number</label>
                <div className="font-medium">{inboundDetails.poNumber || '-'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Details Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Address Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* From Address */}
            <div>
              <h4 className="text-sm text-gray-500 mb-3">From</h4>
              <div className="space-y-1">
                <div className="font-semibold">{address.fromAddress.businessName}</div>
                <div>{address.fromAddress.address1}</div>
                {address.fromAddress.address2 && <div>{address.fromAddress.address2}</div>}
                <div>
                  {address.fromAddress.city}, {address.fromAddress.stateName}, {address.fromAddress.zipCode}
                </div>
                <div>{address.fromAddress.countryName}</div>
              </div>
            </div>

            {/* To Address */}
            <div>
              <h4 className="text-sm text-gray-500 mb-3">To</h4>
              <div className="space-y-1">
                <div className="font-semibold">{address.toAddress.businessName}</div>
                <div>{address.toAddress.address1}</div>
                {address.toAddress.address2 && <div>{address.toAddress.address2}</div>}
                <div>
                  {address.toAddress.city}, {address.toAddress.stateName}, {address.toAddress.zipCode}
                </div>
                <div>{address.toAddress.countryName}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
