"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  orderDetails: InboundOrderDetails | null;
}

export function OrderInformation({ orderDetails }: OrderInformationProps) {
  const [isEditingBasic, setIsEditingBasic] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [editedBasicData, setEditedBasicData] = useState<any>(null)
  const [editedAddressData, setEditedAddressData] = useState<any>(null)

  // Handle null orderDetails case
  if (!orderDetails) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No order information available</p>
      </div>
    )
  }

  const { 
    transactionId,
    createdBy, 
    moveType,
    inboundDetails,
    taskId,
    address,
    customer
  } = orderDetails;

  // Initialize basic info edit data when entering edit mode
  const handleBasicEditClick = () => {
    setEditedBasicData({
      transactionId,
      createdBy,
      moveType,
      orderType: inboundDetails?.orderType || '',
      referenceId: inboundDetails?.referenceId || '',
      receiptAdviceNumber: inboundDetails?.receiptAdviceNumber || '',
      poNumber: inboundDetails?.poNumber || '',
      taskId: taskId || '',
      customerFirstName: customer?.firstName || '',
      customerLastName: customer?.lastName || ''
    })
    setIsEditingBasic(true)
  }

  // Initialize address edit data when entering edit mode
  const handleAddressEditClick = () => {
    setEditedAddressData({
      fromAddress: {
        businessName: address?.fromAddress?.businessName || '',
        address1: address?.fromAddress?.address1 || '',
        address2: address?.fromAddress?.address2 || '',
        city: address?.fromAddress?.city || '',
        stateName: address?.fromAddress?.stateName || '',
        zipCode: address?.fromAddress?.zipCode || '',
        countryName: address?.fromAddress?.countryName || ''
      },
      toAddress: {
        businessName: address?.toAddress?.businessName || '',
        address1: address?.toAddress?.address1 || '',
        address2: address?.toAddress?.address2 || '',
        city: address?.toAddress?.city || '',
        stateName: address?.toAddress?.stateName || '',
        zipCode: address?.toAddress?.zipCode || '',
        countryName: address?.toAddress?.countryName || ''
      }
    })
    setIsEditingAddress(true)
  }

  const handleBasicCancelEdit = () => {
    setIsEditingBasic(false)
    setEditedBasicData(null)
  }

  const handleAddressCancelEdit = () => {
    setIsEditingAddress(false)
    setEditedAddressData(null)
  }

  const handleBasicSave = () => {
    // Here you would typically call an API to save the basic info changes
    console.log('Saving basic info changes:', editedBasicData)
    alert('Basic information saved! (This is a demo - implement actual save logic)')
    setIsEditingBasic(false)
    setEditedBasicData(null)
  }

  const handleAddressSave = () => {
    // Here you would typically call an API to save the address changes
    console.log('Saving address changes:', editedAddressData)
    alert('Address details saved! (This is a demo - implement actual save logic)')
    setIsEditingAddress(false)
    setEditedAddressData(null)
  }

  const handleBasicInputChange = (field: string, value: string) => {
    setEditedBasicData((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddressInputChange = (field: string, value: string, section: string) => {
    setEditedAddressData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const renderBasicField = (label: string, value: string, field: string) => {
    const currentValue = editedBasicData ? editedBasicData[field] : value
    
    return (
      <div>
        <label className="text-sm text-gray-500 block mb-1">{label}</label>
        {isEditingBasic ? (
          <Input
            value={currentValue || ''}
            onChange={(e) => handleBasicInputChange(field, e.target.value)}
            className="font-medium"
          />
        ) : (
          <div className="font-medium">{value || '-'}</div>
        )}
      </div>
    )
  }

  const renderAddressField = (label: string, value: string, field: string, section: string) => {
    const currentValue = editedAddressData ? editedAddressData[section][field] : value
    
    return (
      <div>
        <label className="text-sm text-gray-500 block mb-1">{label}</label>
        {isEditingAddress ? (
          <Input
            value={currentValue || ''}
            onChange={(e) => handleAddressInputChange(field, e.target.value, section)}
            className="font-medium"
          />
        ) : (
          <div className="font-medium">{value || '-'}</div>
        )}
      </div>
    )
  }

  return (
    <Card className="h-full flex flex-col border-none">
      <CardContent className="space-y-6 overflow-auto py-4">
        {/* Basic Information Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            {!isEditingBasic ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBasicEditClick}
              >
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleBasicCancelEdit}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleBasicSave}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {/* Column 1 */}
            <div className="space-y-4">
              {renderBasicField("Transaction ID", transactionId, "transactionId")}
              {renderBasicField("Transaction Type", moveType, "moveType")}
              {renderBasicField("Reference ID", inboundDetails?.referenceId || '', "referenceId")}
              {renderBasicField("Task ID", taskId || '', "taskId")}
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              {renderBasicField("Customer First Name", customer?.firstName || '', "customerFirstName")}
              {renderBasicField("Customer Last Name", customer?.lastName || '', "customerLastName")}
              {renderBasicField("Order Type", inboundDetails?.orderType || '', "orderType")}
              {renderBasicField("Receipt Advice Number", inboundDetails?.receiptAdviceNumber || '', "receiptAdviceNumber")}
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              {renderBasicField("Created By", createdBy, "createdBy")}
              {renderBasicField("PO Number", inboundDetails?.poNumber || '', "poNumber")}
            </div>
          </div>
        </div>

        {/* Address Details Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Address Details</h3>
            {!isEditingAddress ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddressEditClick}
              >
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddressCancelEdit}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleAddressSave}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* From Address */}
            <div>
              <h4 className="text-sm text-gray-500 mb-3">From</h4>
              <div className="space-y-3">
                {renderAddressField("Business Name", address?.fromAddress?.businessName || '', "businessName", "fromAddress")}
                {renderAddressField("Address 1", address?.fromAddress?.address1 || '', "address1", "fromAddress")}
                {renderAddressField("Address 2", address?.fromAddress?.address2 || '', "address2", "fromAddress")}
                {renderAddressField("City", address?.fromAddress?.city || '', "city", "fromAddress")}
                {renderAddressField("State", address?.fromAddress?.stateName || '', "stateName", "fromAddress")}
                {renderAddressField("Zip Code", address?.fromAddress?.zipCode || '', "zipCode", "fromAddress")}
                {renderAddressField("Country", address?.fromAddress?.countryName || '', "countryName", "fromAddress")}
              </div>
            </div>

            {/* To Address */}
            <div>
              <h4 className="text-sm text-gray-500 mb-3">To</h4>
              <div className="space-y-3">
                {renderAddressField("Business Name", address?.toAddress?.businessName || '', "businessName", "toAddress")}
                {renderAddressField("Address 1", address?.toAddress?.address1 || '', "address1", "toAddress")}
                {renderAddressField("Address 2", address?.toAddress?.address2 || '', "address2", "toAddress")}
                {renderAddressField("City", address?.toAddress?.city || '', "city", "toAddress")}
                {renderAddressField("State", address?.toAddress?.stateName || '', "stateName", "toAddress")}
                {renderAddressField("Zip Code", address?.toAddress?.zipCode || '', "zipCode", "toAddress")}
                {renderAddressField("Country", address?.toAddress?.countryName || '', "countryName", "toAddress")}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
