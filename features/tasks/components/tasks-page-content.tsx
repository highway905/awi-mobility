"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Info, Search, Filter, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Sidebar } from "@/components/layout/sidebar"
import { PageHeader } from "@/features/shared/components/page-header"
import { AdvancedTable, type AdvancedTableColumn } from "@/features/shared/components/advanced-table"
import { TasksColumnCustomizationSheet } from "./tasks-column-customization-sheet"
import { TasksFilterSheet } from "./tasks-filter-sheet"
import { AddTaskModal } from "./AddTaskModal"
import { AssignUserModal } from "./AssignUserModal"
import { getFilteredTasks } from "../mocks/tasks-data"
import type { Task, TaskFilters } from "../types"

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Task", href: "/tasks" },
]

export function TasksPageContent() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filters, setFilters] = useState<TaskFilters>({
    search: "",
    assignmentFilter: "all",
    includeClosed: false,
    status: "all",
    priority: "all",
    orderType: "all",
  })
  const [columnSheetOpen, setColumnSheetOpen] = useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false)
  const [assignUserModalOpen, setAssignUserModalOpen] = useState(false)
  const [selectedTaskForAssign, setSelectedTaskForAssign] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate loading state for demonstration
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [filters])

  const filteredTasks = getFilteredTasks(filters)

  // Handle bulk actions
  const handleBulkAction = async (action: string, selectedRows: Task[]) => {
    const taskIds = selectedRows.map(task => task.id)
    
    try {
      switch (action) {
        case 'assign':
          console.log('Assigning tasks:', taskIds)
          setAssignUserModalOpen(true)
          break
        case 'update-status':
          console.log('Updating status for tasks:', taskIds)
          // Call your update API
          break
        case 'export':
          console.log('Exporting tasks:', taskIds)
          // Call your export API
          break
        default:
          console.log('Bulk action:', action, selectedRows)
      }
    } catch (error) {
      console.error('Bulk action failed:', error)
    }
  }

  const handleAssignTask = (taskId: string) => {
    setSelectedTaskForAssign(taskId)
    setAssignUserModalOpen(true)
  }

  const handleAddTask = (taskData: any) => {
    console.log('Adding new task:', taskData)
    // Handle task creation logic here
  }

  const handleAssignUsers = (selectedUsers: any[]) => {
    console.log('Assigning users:', selectedUsers, 'to task:', selectedTaskForAssign)
    // Handle user assignment logic here
    setSelectedTaskForAssign(null)
  }

  const columns: AdvancedTableColumn<Task>[] = [
    {
      key: "transactionId",
      header: "Transaction ID",
      render: (value: string) => <span className="font-medium text-blue-600">{value}</span>,
      sortable: true,
      minWidth: 140,
    },
    {
      key: "orderType",
      header: "Order Type",
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value.includes("B2B") || value.includes("B2C") ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
        }`}>
          {value}
        </span>
      ),
      sortable: true,
      minWidth: 110,
    },
    {
      key: "task",
      header: "Task",
      render: (value: string) => <span className="text-gray-900">{value}</span>,
      sortable: true,
      minWidth: 200,
    },
    {
      key: "assignedTo",
      header: "Assigned To",
      render: (value: string | null, row: Task) =>
        value ? (
          <span className="text-gray-900">{value}</span>
        ) : (
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-3 text-xs bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 rounded-md font-medium"
              onClick={(e) => {
                e.stopPropagation()
                handleAssignTask(row.id)
              }}
            >
              Assign
            </Button>
          </div>
        ),
      sortable: true,
      minWidth: 150,
    },
    {
      key: "priority",
      header: "Priority",
      render: (value: string) => {
        const getPriorityStyle = (priority: string) => {
          switch (priority) {
            case "High":
              return "bg-red-100 text-red-800 border-red-200"
            case "Medium":
              return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "Low":
              return "bg-green-100 text-green-800 border-green-200"
            default:
              return "bg-gray-100 text-gray-800 border-gray-200"
          }
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityStyle(value)}`}>
            {value}
          </span>
        )
      },
      sortable: true,
      minWidth: 100,
    },
    {
      key: "status",
      header: "Status",
      render: (value: string) => {
        const getStatusStyle = (status: string) => {
          switch (status) {
            case "In Progress":
              return "bg-orange-100 text-orange-800 border-orange-200"
            case "Waiting":
              return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "Paused":
              return "bg-purple-100 text-purple-800 border-purple-200"
            case "Yet to Start":
              return "bg-cyan-100 text-cyan-800 border-cyan-200"
            case "Completed":
              return "bg-green-100 text-green-800 border-green-200"
            case "On Hold":
              return "bg-gray-100 text-gray-800 border-gray-200"
            default:
              return "bg-gray-100 text-gray-800 border-gray-200"
          }
        }
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(value)}`}>
            {value}
          </span>
        )
      },
      sortable: true,
      minWidth: 140,
    },
  ]

  const handleRowClick = (task: Task) => {
    router.push(`/tasks/${task.id}/execute?type=${task.taskType}`)
  }

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  // Calculate footer data
  const footerData = {
    transactionId: `Total: ${filteredTasks.length} tasks`,
    orderType: '',
    task: '',
    assignedTo: `${filteredTasks.filter(t => t.assignedTo).length} assigned`,
    priority: `${filteredTasks.filter(t => t.priority === 'High').length} high priority`,
    status: `${filteredTasks.filter(t => t.status === 'Completed').length} completed`,
  }

  return (
    <div className="h-screen flex flex-col bg-dashboard-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Fixed Page Header Section */}
      <div className="flex-shrink-0 px-4">
        <PageHeader
          title="Task Management"
          breadcrumbItems={breadcrumbItems}
          onMenuClick={handleMenuClick}
          actions={
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="text-black bg-[#D6D3D1] border-gray-300 px-4 py-2"
                onClick={() => setAddTaskModalOpen(true)}
              >
                Misc. Task
              </Button>
              {/* <Button className="bg-[#FBBF24] text-black px-4 py-2 rounded-md">
                + Perform B2C Task
              </Button> */}
            </div>
          }
        />
      </div>

      {/* Fixed Controls Section */}
      <div className="flex-shrink-0 px-4 mb-2">
        <div className="flex items-center justify-between">
          {/* Left side - Tab filters */}
          <div className="flex items-center gap-6">
            {/* Tab Filters */}
            <div className="flex items-center h-8 bg-[#F5F5F4] rounded rounded-md border border-[#D6D3D1]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, assignmentFilter: "all" }))}
                className={`h-7 px-4 rounded-md text-sm font-medium ${
                  filters.assignmentFilter === "all"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, assignmentFilter: "assigned-to-me" }))}
                className={`h-7 px-4 rounded-md text-sm font-medium ${
                  filters.assignmentFilter === "assigned-to-me"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Assigned to me
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, assignmentFilter: "unassigned" }))}
                className={`h-7 px-4 rounded-md text-sm font-medium ${
                  filters.assignmentFilter === "unassigned"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Unassigned
              </Button>
            </div>
          </div>

          {/* Right side - Search and Filter buttons */}
          <div className="flex items-center gap-3">
            {/* Include Closed Tasks Checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="include-closed"
                checked={filters.includeClosed}
                onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, includeClosed: checked as boolean }))}
              />
              <label htmlFor="include-closed" className="text-sm text-gray-700 flex items-center gap-1">
                Include Closed Tasks
                <Info className="h-4 w-4 text-gray-400" />
              </label>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="pl-10 w-64 h-8"
              />
            </div>

            {/* Column Customization Button */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-9 border-gray-300 hover:bg-gray-50"
              onClick={() => setColumnSheetOpen(true)}
            >
              <Settings2 className="h-4 w-4 text-gray-600" />
            </Button>

            {/* Filter Button */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-9 border-gray-300 hover:bg-gray-50"
              onClick={() => setFilterSheetOpen(true)}
            >
              <Filter className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>

      {/* Flexible Table Section - Takes remaining space */}
      <div className="flex-1 px-4 pb-4 min-h-0">
        <AdvancedTable.Root
          data={filteredTasks}
          columns={columns}
          onRowClick={handleRowClick}
          enableBulkSelection={true}
          onBulkAction={handleBulkAction}
          stickyColumns={{
            // left: ['transactionId'], // Make Transaction ID sticky on the left
          }}
          isLoading={isLoading}
          emptyMessage="No tasks found matching your criteria"
        >
          <AdvancedTable.Loading />
          <AdvancedTable.Container>
            <AdvancedTable.Table>
              <AdvancedTable.Header />
              <AdvancedTable.Body />
              {/* <AdvancedTable.Footer footerData={footerData} /> */}
            </AdvancedTable.Table>
          </AdvancedTable.Container>
          <AdvancedTable.BulkActions />
        </AdvancedTable.Root>
      </div>

      {/* Modals */}
      <AddTaskModal
        isOpen={addTaskModalOpen}
        onClose={() => setAddTaskModalOpen(false)}
        onSubmit={handleAddTask}
      />

      <AssignUserModal
        isOpen={assignUserModalOpen}
        onClose={() => {
          setAssignUserModalOpen(false)
          setSelectedTaskForAssign(null)
        }}
        onAssign={handleAssignUsers}
        taskId={selectedTaskForAssign || undefined}
      />

      {/* Sheets */}
      <TasksColumnCustomizationSheet
        open={columnSheetOpen}
        onOpenChange={setColumnSheetOpen}
        columns={columns}
        onColumnsChange={() => {}}
      />

      <TasksFilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  )
}