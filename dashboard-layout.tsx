export default function DashboardLayout() {
  return (
    <div className="bg-dashboard-background px-4">
      {/* Header Section - 72px total height */}
      <div className="h-header mb-dashboard-gap">
        {/* Breadcrumb - 32px height */}
        <div className="h-breadcrumb mb-dashboard-gap flex gap-2 items-center px-3">
           {/* sidebar trigger */}
          <div>
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0.999995C0 0.631805 0.298477 0.333328 0.666667 0.333328H11.3333C11.7015 0.333328 12 0.631805 12 0.999995C12 1.36818 11.7015 1.66666 11.3333 1.66666H0.666667C0.298477 1.66666 0 1.36818 0 0.999995ZM0 5C0 4.63181 0.298477 4.33333 0.666667 4.33333H11.3333C11.7015 4.33333 12 4.63181 12 5C12 5.36819 11.7015 5.66666 11.3333 5.66666H0.666667C0.298477 5.66666 0 5.36819 0 5ZM0.666667 8.33333C0.298477 8.33333 0 8.63181 0 9C0 9.36819 0.298477 9.66666 0.666667 9.66666H11.3333C11.7015 9.66666 12 9.36819 12 9C12 8.63181 11.7015 8.33333 11.3333 8.33333H0.666667Z" fill="#0C0A09"/>
            </svg>
          </div>
          <span className="text-sm text-gray-600">Breadcrumb Area (32px)</span>
        </div>

        {/* Title and Filter - 36px height */}
        <div className="h-title-filte flex items-center justify-between px-3">
          <span className="text-sm font-medium">Dashboard Title</span>
          <span className="text-sm text-gray-600">Filter Dropdown (36px)</span>
        </div>
      </div>

      {/* Order Status Section - 160px height */}
      <div className="h-order-status mb-dashboard-gap border border-dashboard-border bg-white rounded-dashboard p-4">
        <div className="text-sm font-medium mb-2">Order Status (160px height)</div>
        <div className="flex gap-dashboard-gap h-[88px]">
          {/* 5 status cards */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-[166px] flex-1 border border-dashboard-border rounded-dashboard p-4 bg-gray-50">
              <div className="text-xs text-gray-500">Card {i + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Containers - 357px height, 456px width each with 16px gap */}
      <div className="h-chart-container mb-dashboard-gap flex gap-chart-gap">
        <div className="w-chart-container border border-dashboard-border bg-white rounded-dashboard flex items-center px-3">
          <span className="text-sm">Task Status Chart (456px × 357px)</span>
        </div>
        <div className="w-chart-container border border-dashboard-border bg-white rounded-dashboard flex items-center px-3">
          <span className="text-sm">Task Status Summary (456px × 357px)</span>
        </div>
      </div>

      {/* Current Tasks by Employee - 352px height */}
      <div className="h-table-section mb-dashboard-gap border border-dashboard-border bg-white rounded-dashboard p-3">
        <div className="text-sm font-medium mb-2">Current Tasks by Employee</div>
        <div className="text-xs text-gray-500">Table content area (352px height)</div>
      </div>

      {/* Needs Attention - 352px height */}
      <div className="h-table-section border border-dashboard-border bg-white rounded-dashboard p-3">
        <div className="text-sm font-medium mb-2">Needs Attention</div>
        <div className="text-xs text-gray-500">Table content area (352px height)</div>
      </div>
    </div>
  )
}
