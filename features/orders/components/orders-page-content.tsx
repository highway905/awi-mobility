"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { PageHeader } from "@/features/shared/components/page-header"
import { OrdersFilter } from "./orders-filter"
import { AdvancedTable, type AdvancedTableColumn } from "@/features/shared/components/advanced-table"
import { useGetOrderListQuery } from "@/lib/redux/api/orderManagement"
import { isEmpty } from 'lodash';

export const filterToPayload = (filter: any, tabId: string) => {
  const payload = { ...filter };
  Object.entries(payload)?.forEach(([key, value]: [string, any]) => {
    if (Array.isArray(value)) payload[key] = value.map((v) => v?.id);
    else if (value?.id !== undefined) payload[key] = value?.id;
  });
  payload.orderListingFilterType = payload.fromDate && payload.orderListingFilterType;
  payload.orderListingFilterTypeOption = payload.fromDate && payload.orderListingFilterTypeOption;
  
  // Convert tab to moveType
  if (tabId === 'inbound') {
    payload.moveType = 'Inbound';
  } else if (tabId === 'outbound') {
    payload.moveType = 'Outbound';
  } else {
    payload.moveType = '';
  }
  
  return payload;
};

export const inPast = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + 1 - n);
  return d;
};

export const dateFrom = inPast(240);
dateFrom.setHours(0, 0, 0, 0);

export const dateCurrent = new Date();
dateCurrent.setHours(23, 59, 59, 999);

export const defaultOrderFilter = {
  pageIndex: 1,
  pageSize: 20,
  searchKey: '',
  sortColumn: '',
  sortDirection: '',
  orderListingFilterType: 'RequestCreated',
  orderListingFilterTypeOption: 'Custom',
  fromDate: dateFrom.toISOString(),
  toDate: dateCurrent.toISOString(),
  transactionId: '',
  serviceTypeId: '',
  moveType: '',
  orderTypes: [],
  customerId: '',
  locationId: '',
  referenceId: '',
  statuses: [],
  sku: '',
  taskId: '',
  trackingNumber: '',
  transportationArrangementId: '',
  recipientName: '',
  recipientCompany: '',
  recipientAddress1: '',
  recipientAddress2: '',
  recipientCity: '',
  recipientState: '',
  recipientCountry: '',
  recipientZipCode: '',
  shipperName: '',
  shipperCompany: '',
  shipperAddress1: '',
  shipperAddress2: '',
  shipperCity: '',
  shipperState: '',
  shipperCountry: '',
  shipperZipCode: '',
  appointmentDate: '',
  createdOn: '',
  transportationMethodId: '',
  loadTypeId: '',
  cargoTypeId: '',
  trailerTypeId: '',
  trailerNumber: '',
  createdByName: '',
  channel: '',
  tags: '',
};

export interface Order {
  orderId: string
  transactionId: string
  customer: string
  orderType: string
  referenceId: string
  channel?: string
  appointmentDate: string
  status: string
  moveType: string
  serviceType: string
  location: string
  trackingNo?: string
  createdOn: string
}

const breadcrumbItems = [{ label: "Home", href: "/dashboard" }, { label: "Order Management" }]

export function OrdersPageContent() {
  const { push } = useRouter();
  const { search }: any = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(2025, 0, 23), // January 23, 2025
    to: new Date(2025, 3, 22), // April 22, 2025
  })
  const [hasNextPage, setHasNextPage] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])

  // Initialize from localStorage if available
  const storedFilter = typeof window !== 'undefined' ? localStorage.getItem('orderListFilter') : null;
  const parsedFilter = storedFilter && JSON.parse(storedFilter);
  const storedCurrentTab: any = typeof window !== 'undefined' ? localStorage.getItem('orderCurrentTab') : null;
  
  const [currentTab, setCurrentTab] = useState<string>(
    !isEmpty(storedCurrentTab) ? storedCurrentTab : 'all'
  );
  
  const [filter, setFilter] = useState<any>(
    !isEmpty(parsedFilter)
      ? { ...parsedFilter, sortColumn: '', sortDirection: '', searchKey: search || '' }
      : { ...defaultOrderFilter, searchKey: search || '' }
  );
  
  const [searchTrigger, setSearchTrigger] = useState(0);
  
  // Update filter when tab changes
  useEffect(() => {
    if (activeTab !== currentTab) {
      setCurrentTab(activeTab);
      if (typeof window !== 'undefined') {
        localStorage.setItem('orderCurrentTab', activeTab);
      }
      
      setFilter(prev => ({
        ...prev,
        pageIndex: 1 // Reset to first page on tab change
      }));
      setSearchTrigger(prev => prev + 1);
    }
  }, [activeTab, currentTab]);

  // Update filter when search changes
  useEffect(() => {
    if (searchQuery !== filter.searchKey) {
      setFilter(prev => ({
        ...prev,
        searchKey: searchQuery,
        pageIndex: 1 // Reset to first page on search
      }));
      setSearchTrigger(prev => prev + 1);
    }
  }, [searchQuery, filter.searchKey]);

  // Update filter when date range changes
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      
      setFilter(prev => ({
        ...prev,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        pageIndex: 1 // Reset to first page on date change
      }));
      setSearchTrigger(prev => prev + 1);
    }
  }, [dateRange]);

  // Create the API payload
  const apiPayload = useCallback(() => {
    return filterToPayload(filter, currentTab);
  }, [filter, currentTab]);

  const {
    data: ordersData,
    isFetching,
    refetch,
    error
  } = useGetOrderListQuery(apiPayload(), {
    refetchOnMountOrArgChange: true,
    skip: false,
  });

  // Log any errors for debugging
  useEffect(() => {
    if (error) {
      console.error("API Error:", error);
    }
  }, [error]);

  // Process API response and update orders state
  useEffect(() => {
    if (ordersData?.items) {
      const { items, totalCount } = ordersData;
      
      // Map API response to our Order interface
      const mappedOrders = items.map((item: any) => ({
        orderId: item.orderId || item.transactionId,
        transactionId: item.transactionId,
        customer: item.customer,
        orderType: item.orderType,
        referenceId: item.referenceId,
        channel: item.orderCreationTypeId || 'Manual',
        appointmentDate: item.appointmentDate ? new Date(item.appointmentDate).toLocaleDateString() : '-',
        status: item.status,
        moveType: item.moveType || '',
        serviceType: item.serviceType || '',
        location: item.location || '',
        trackingNo: item.trackingNo || '',
        createdOn: item.createdOn ? new Date(item.createdOn).toLocaleDateString() : '-',
      }));
      
      // If it's the first page, replace orders; otherwise append
      if (filter.pageIndex === 1) {
        setOrders(mappedOrders);
      } else {
        setOrders(prev => [...prev, ...mappedOrders]);
      }
      
      // Check if there are more pages to load
      const hasMore = items.length > 0 && (filter.pageIndex * filter.pageSize) < totalCount;
      setHasNextPage(hasMore);
    } else if (ordersData && !ordersData.items && filter.pageIndex === 1) {
      // If we got a response but no items, clear the orders list
      setOrders([]);
      setHasNextPage(false);
    }
  }, [ordersData, filter.pageIndex, filter.pageSize]);

  // Function to load more data for infinite scroll
  const fetchNextPage = async () => {
    if (isLoadingMore || !hasNextPage) return;
    
    setIsLoadingMore(true);
    
    try {
      const nextPage = filter.pageIndex + 1;
      setFilter(prev => ({
        ...prev,
        pageIndex: nextPage
      }));
      
      // Trigger refetch with new page
      await refetch();
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Handle sorting
  const handleSort = useCallback((column: string, direction: 'asc' | 'desc') => {
    setFilter(prev => ({
      ...prev,
      sortColumn: column,
      sortDirection: direction,
      pageIndex: 1 // Reset to first page on sort
    }));
    setSearchTrigger(prev => prev + 1);
  }, []);

  // Handle bulk actions
  const handleBulkAction = async (action: string, selectedRows: Order[]) => {
    const orderIds = selectedRows.map(order => order.orderId);
    
    try {
      switch (action) {
        case 'export':
          // Export selected orders
          console.log('Exporting orders:', orderIds);
          // Call your export API
          break;
        case 'cancel':
          // Cancel selected orders
          console.log('Cancelling orders:', orderIds);
          // Call your cancel API
          break;
        case 'update-status':
          // Update status of selected orders
          console.log('Updating status for orders:', orderIds);
          // Call your update API
          break;
        default:
          console.log('Bulk action:', action, selectedRows);
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const columns: AdvancedTableColumn<Order>[] = [
    {
      key: "transactionId",
      header: "Transaction ID",
      render: (value: string) => <span className="font-medium text-blue-600">{value}</span>,
      sortable: true,
      minWidth: 140,
    },
    {
      key: "customer",
      header: "Customer",
      render: (value: string) => <span className="text-gray-900">{value}</span>,
      sortable: true,
      minWidth: 136,
    },
    {
      key: "orderType",
      header: "Order Type",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value.includes("B2B") || value.includes("B2C") ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
          }`}
        >
          {value}
        </span>
      ),
      sortable: true,
      minWidth: 110,
    },
    {
      key: "referenceId",
      header: "Reference ID",
      render: (value: string) => <span className="text-gray-700">{value}</span>,
      sortable: true,
      minWidth: 136,
    },
    {
      key: "channel",
      header: "Channel",
      render: (value: string) => {
        const getChannelStyle = (channel: string) => {
          switch (channel) {
            case "EDI":
              return "bg-purple-100 text-purple-800"
            case "Shopify":
              return "bg-green-100 text-green-800"
            case "Manual":
              return "bg-orange-100 text-orange-800"
            default:
              return "bg-gray-100 text-gray-800"
          }
        }
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChannelStyle(value)}`}>{value}</span>
      },
      sortable: true,
      minWidth: 110,
    },
    {
      key: "appointmentDate",
      header: "Appointment Date",
      render: (value: string) => <span className="text-gray-700">{value}</span>,
      sortable: true,
      minWidth: 160,
    },
    {
      key: "status",
      header: "Status",
      render: (value: string) => {
        const getStatusStyle = (status: string) => {
          switch (status) {
            case "Initialized":
              return "bg-blue-100 text-blue-800 border-blue-200"
            case "Ready to Process":
              return "bg-purple-100 text-purple-800 border-purple-200"
            case "Unloading":
              return "bg-orange-100 text-orange-800 border-orange-200"
            case "Delivered":
              return "bg-green-100 text-green-800 border-green-200"
            case "Receiving":
              return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "Putaway":
              return "bg-indigo-100 text-indigo-800 border-indigo-200"
            case "Completed":
              return "bg-green-100 text-green-800 border-green-200"
            case "Closed":
              return "bg-gray-100 text-gray-800 border-gray-200"
            case "Pending Carrier Details":
              return "bg-amber-100 text-amber-800 border-amber-200"
            case "Packing":
              return "bg-cyan-100 text-cyan-800 border-cyan-200"
            case "Picking":
              return "bg-teal-100 text-teal-800 border-teal-200"
            case "Ready to Ship":
              return "bg-emerald-100 text-emerald-800 border-emerald-200"
            case "Loading":
              return "bg-lime-100 text-lime-800 border-lime-200"
            case "Print Shipping Document":
              return "bg-sky-100 text-sky-800 border-sky-200"
            default:
              return "bg-gray-100 text-gray-800 border-gray-200"
          }
        }
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(value)}`}>{value}</span>
        )
      },
      sortable: true,
      minWidth: 140,
    },
    {
      key: "moveType",
      header: "Move Type",
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Inbound' ? 'bg-blue-100 text-blue-800' : 
          value === 'Outbound' ? 'bg-green-100 text-green-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {value || 'N/A'}
        </span>
      ),
      sortable: true,
      minWidth: 110,
    },
    {
      key: "createdOn",
      header: "Created On",
      render: (value: string) => <span className="text-gray-700">{value}</span>,
      sortable: true,
      minWidth: 120,
    },
  ]

  const handleRowClick = (order: Order) => {
    push(`/order-details/${order.orderId}`)
  }

  // Save filter to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('orderListFilter', JSON.stringify(filter));
    }
  }, [filter]);

  // Calculate footer data
  const footerData = {
    transactionId: `Total: ${ordersData?.totalCount || 0} orders`,
    customer: '',
    orderType: '',
    referenceId: '',
    channel: '',
    appointmentDate: '',
    status: `${orders.filter(o => o.status === 'Completed').length} completed`,
    moveType: `${orders.filter(o => o.moveType === 'Inbound').length} inbound`,
    createdOn: '',
  };

  return (
    <div className="h-screen flex flex-col bg-dashboard-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Fixed Page Header Section */}
      <div className="flex-shrink-0 px-4">
        <PageHeader
          title="Orders"
          breadcrumbItems={breadcrumbItems}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Fixed Filter Section */}
      <div className="flex-shrink-0 px-4 mb-4">
        <OrdersFilter
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      {/* Flexible Table Section - Takes remaining space */}
      <div className="flex-1 px-4 pb-4 min-h-0">
        <AdvancedTable.Root
          data={orders}
          columns={columns}
          onRowClick={handleRowClick}
          enableBulkSelection={true}
          onBulkAction={handleBulkAction}
          stickyColumns={{
            left: ['transactionId'], // Make Transaction ID sticky on the left
          }}
          isLoading={isFetching && filter.pageIndex === 1}
          emptyMessage={isFetching ? "Loading orders..." : "No orders found matching your criteria"}
        >
          {/* <AdvancedTable.Loading /> */}
          <AdvancedTable.Container
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isLoadingMore}
          >
            <AdvancedTable.Table>
              <AdvancedTable.Header />
              <AdvancedTable.Body />
              {/* <AdvancedTable.Footer footerData={footerData} /> */}
            </AdvancedTable.Table>
          </AdvancedTable.Container>
          {/* <AdvancedTable.BulkActions /> */}
        </AdvancedTable.Root>
      </div>
    </div>
  )
}