"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from 'next/navigation';

import { Sidebar } from "@/components/layout/sidebar"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PageHeader } from "@/components/shared/page-header"
import { PalletAssignmentTab } from "./pallet-assignment-tab"
import { SwipeableTabs } from "@/components/shared/swipeable-tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { X, Upload } from "lucide-react"
import { ChevronDown, ChevronRight, ArrowLeft, ArrowRight, Plus, Printer, Search } from "lucide-react"
import { getTaskById } from "../mocks/tasks-data"
import { orderLogs, taskLogs } from "../mocks/log-data"
import type { Task, TaskExecutionTab } from "../types"
import type { LogEntry } from "../types"

interface LogTimelineProps {
  logs: LogEntry[]
  title: string
}

interface TaskExecutionPageContentProps {
  taskId: string
  taskType?: string
}

const tabs: TaskExecutionTab[] = [
  { id: "perform", label: "Perform" },
  { id: "order-details", label: "Order Details" },
  { id: "task-details", label: "Task Details" },
  { id: "comments", label: "Comments" },
  { id: "logs", label: "Logs" },
]

const lineItems = [
  {
    sku: "SKU-GHIJ5678",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 100,
    packUnit: "Master Carton",
    pkgQty: 7,
    expectedQty: 700,
  },
  {
    sku: "SKU-EFGH5678",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 100,
    packUnit: "Master Carton",
    pkgQty: 3,
    expectedQty: 300,
  },
  {
    sku: "SKU-MNOP2345",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 50,
    packUnit: "Master Carton",
    pkgQty: 1,
    expectedQty: 50,
  },
  {
    sku: "SKU-QRST6789",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 100,
    packUnit: "Master Carton",
    pkgQty: 5,
    expectedQty: 500,
  },
  {
    sku: "SKU-UVWX3456",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 50,
    packUnit: "Master Carton",
    pkgQty: 9,
    expectedQty: 450,
  },
  {
    sku: "SKU-YZAB7890",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 100,
    packUnit: "Master Carton",
    pkgQty: 2,
    expectedQty: 200,
  },
  {
    sku: "SKU-CDEF1234",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 50,
    packUnit: "Master Carton",
    pkgQty: 4,
    expectedQty: 200,
  },
  {
    sku: "SKU-ABCD1234",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 100,
    packUnit: "Master Carton",
    pkgQty: 6,
    expectedQty: 600,
  },
  {
    sku: "SKU-IJKL9101",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 50,
    packUnit: "Master Carton",
    pkgQty: 2,
    expectedQty: 100,
  },
]

const ibqaLineItems = [
  {
    sku: "ref24680",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 100,
    packUnit: "Each",
    pkgQty: 7,
    unit: "Each",
    expectedQty: 700,
  },
  {
    sku: "demo-5d-e6f-007",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 100,
    packUnit: "Each",
    pkgQty: 3,
    unit: "Each",
    expectedQty: 300,
  },
  {
    sku: "ref98765",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 50,
    packUnit: "Each",
    pkgQty: 1,
    unit: "Each",
    expectedQty: 50,
  },
  {
    sku: "o-ref6789",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 100,
    packUnit: "Each",
    pkgQty: 5,
    unit: "Each",
    expectedQty: 500,
  },
  {
    sku: "o-ref1234",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 50,
    packUnit: "Each",
    pkgQty: 9,
    unit: "Each",
    expectedQty: 450,
  },
  {
    sku: "demo-3j-k4l-012",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 100,
    packUnit: "Each",
    pkgQty: 2,
    unit: "Each",
    expectedQty: 200,
  },
  {
    sku: "ref54321",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 50,
    packUnit: "Each",
    pkgQty: 4,
    unit: "Each",
    expectedQty: 200,
  },
  {
    sku: "o-ref1357",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 100,
    packUnit: "Each",
    pkgQty: 6,
    unit: "Each",
    expectedQty: 600,
  },
  {
    sku: "demo-8g-h9i-010",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 50,
    packUnit: "Each",
    pkgQty: 2,
    unit: "Each",
    expectedQty: 100,
  },
]


const attachments = [
  { id: "1", filename: "SKU-GHIJ5678.jpg", type: "QR Image" },
  { id: "2", filename: "SKU-GHIJ5678.jpg", type: "QR Image" },
]

const comments = [
  {
    id: "1",
    text: "BOL says 5 pallets, I got only 4 pallets. Verify on QA.",
    author: "John Doe",
    timestamp: "5/12/2025 09:00 AM",
    category: "Unloading",
  },
  {
    id: "2",
    text: "Order created and assigned.",
    author: "John Doe",
    timestamp: "5/12/2025 09:00 AM",
    category: "System",
  },
]

const orderLogs = [
  {
    id: "1",
    action: "Shipment Created",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
  {
    id: "2",
    action: "Picking Completed",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
  {
    id: "3",
    action: "Order Packing",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
  {
    id: "4",
    action: "Order Picking",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
  {
    id: "5",
    action: "Order status has been updated to Ready to Process",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
]

const taskLogs = [
  {
    id: "1",
    action: "Picking - Started",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
  {
    id: "2",
    action: "Picking - Paused",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
  {
    id: "3",
    action: "Picking - Started",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
  {
    id: "4",
    action: "Move inventory to B2C Shelf - Completed",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
  {
    id: "5",
    action: "Move inventory to B2C Shelf - Started",
    author: "John Doe",
    timestamp: "2/13/2025 12:10 PM",
  },
]

const reviewOverageChecklist = [
  { label: "Number of Pallets", value: "2" },
  { label: "Number of Cartons", value: "5" },
  { label: "Discrepancy / Damage Details", value: "-" },
  { label: "Warehouse Notes", value: "-" },
  { label: "Proper Doc / Ref provided", value: "No" },
  { label: "Labelling Correct?", value: "Yes" },
  { label: "Carrier Correct?", value: "Yes" },
  { label: "Trailer Type Correct?", value: "-" },
  { label: "Load Type", value: "Yes" },
  { label: "Trailer #", value: "Yes" },
  { label: "Seal # Correct?", value: "Yes" },
  { label: "Tracking/Pro #", value: "No" },
  { label: "Unexpected Delivery", value: "-" },
  { label: "Trailer Damage", value: "NA" },
  { label: "Issues during Unloading", value: "NA" },
]

const reviewOverageLineItems = [
  {
    sku: "ref24680",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 100,
    packUnit: "Each",
    pkgQty: 7,
    unit: "Each",
    expectedQty: 700,
  },
  {
    sku: "demo-5d-e6f-007",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 100,
    packUnit: "Each",
    pkgQty: 3,
    unit: "Each",
    expectedQty: 300,
  },
  {
    sku: "ref98765",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 50,
    packUnit: "Each",
    pkgQty: 1,
    unit: "Each",
    expectedQty: 50,
  },
  {
    sku: "o-ref6789",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 100,
    packUnit: "Each",
    pkgQty: 5,
    unit: "Each",
    expectedQty: 500,
  },
  {
    sku: "o-ref1234",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 50,
    packUnit: "Each",
    pkgQty: 9,
    unit: "Each",
    expectedQty: 450,
  },
  {
    sku: "demo-3j-k4l-012",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 100,
    packUnit: "Each",
    pkgQty: 2,
    unit: "Each",
    expectedQty: 200,
  },
  {
    sku: "ref54321",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 50,
    packUnit: "Each",
    pkgQty: 4,
    unit: "Each",
    expectedQty: 200,
  },
  {
    sku: "o-ref1357",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 100,
    packUnit: "Each",
    pkgQty: 6,
    unit: "Each",
    expectedQty: 600,
  },
  {
    sku: "demo-8g-h9i-010",
    primaryUnit: "Each",
    primaryUnitsPerPkg: 50,
    packUnit: "Each",
    pkgQty: 2,
    unit: "Each",
    expectedQty: 100,
  },
]

function LogTimeline({ logs, title }: LogTimelineProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-4">
        {logs.map((log, index) => (
          <div key={log.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0 mt-1" />
              {index < logs.length - 1 && <div className="w-px h-12 bg-gray-200 mt-2" />}
            </div>
            <div className="flex-1 pb-4">
              <div className="font-medium text-gray-900">{log.action}</div>
              <div className="text-sm text-gray-500 mt-1">By {log.user}</div>
              <div className="text-sm text-gray-500">{log.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TaskExecutionPageContent({ taskId, taskType = "unloading" }: TaskExecutionPageContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  console.log(type)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("perform")
  const [newComment, setNewComment] = useState("")

  console.log(router)
  
  useEffect(() => {
    const loadTask = async () => {
      setLoading(true)
     
      const taskData = getTaskById(taskId)
      setTask(taskData)
      setLoading(false)
    }
    loadTask()
  }, [taskId])

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }
 
  const handleAddComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      console.log("Adding comment:", newComment)
      setNewComment("")
    }
  }
  
  const unLoadingPerformTab = () => (
    <div className="space-y-2">
      {/* Line Items Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Line Items</CardTitle>
        </CardHeader>
        <CardContent className="p-4 ">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="text-gray-500 font-medium">SKU</TableHead>
                  <TableHead className="text-gray-500 font-medium">Primary Unit</TableHead>
                  <TableHead className="text-gray-500 font-medium">Primary Units / Pkg</TableHead>
                  <TableHead className="text-gray-500 font-medium">Pack Unit</TableHead>
                  <TableHead className="text-gray-500 font-medium">Pkg Qty</TableHead>
                  <TableHead className="text-gray-500 font-medium">Expected Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item, index) => (
                  <TableRow key={index} className="border-b border-gray-100">
                    <TableCell className="font-medium">{item.sku}</TableCell>
                    <TableCell>{item.primaryUnit}</TableCell>
                    <TableCell>{item.primaryUnitsPerPkg}</TableCell>
                    <TableCell>{item.packUnit}</TableCell>
                    <TableCell>{item.pkgQty}</TableCell>
                    <TableCell>{item.expectedQty}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 border-gray-200 bg-gray-50">
                  <TableCell className="font-semibold">Total</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="font-semibold">39</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Attachments Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Attachments</CardTitle>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="relative border border-gray-200 rounded-lg p-3 bg-white">
                <button className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-600">
                  <X className="h-3 w-3" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                    QR
                  </div>
                  <div>
                    <div className="font-medium text-sm">{attachment.filename}</div>
                    <div className="text-xs text-gray-500">{attachment.type}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
  
  const renderRadioGroup = (name: string, options: string[] = ["Yes", "No"]) => (
    <div className="flex gap-4">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2">
          <input
            type="radio"
            name={name}
            value={option}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-sm">{option}</span>
        </label>
      ))}
    </div>
  )

  const IBQAPerformTab = () => (
    <div className="space-y-6">
      {/* Checklist Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Number inputs */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Pallets <span className="text-red-500">*</span>
              </label>
              <Input placeholder="Enter numeric value" type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Cartons <span className="text-red-500">*</span>
              </label>
              <Input placeholder="Enter numeric value" type="number" />
            </div>
          </div>

          {/* Text areas */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discrepancy / Damage Details</label>
              <textarea
                placeholder="Add your comment..."
                className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse Notes</label>
              <textarea
                placeholder="Add your comment..."
                className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Radio button groups */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proper Doc / Ref provided</label>
              {renderRadioGroup("properDoc")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Labelling Correct?</label>
              {renderRadioGroup("labelling")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Carrier Correct?</label>
              {renderRadioGroup("carrier")}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trailer Type Correct?</label>
              {renderRadioGroup("trailerType")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Load Type</label>
              {renderRadioGroup("loadType")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trailer #</label>
              {renderRadioGroup("trailerNumber")}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seal # Correct?</label>
              {renderRadioGroup("sealNumber", ["Yes", "No", "NA"])}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tracking/Pro #</label>
              {renderRadioGroup("trackingPro", ["Yes", "No", "NA"])}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unexpected Delivery</label>
              {renderRadioGroup("unexpectedDelivery", ["Yes", "No", "NA"])}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trailer Damage</label>
              {renderRadioGroup("trailerDamage", ["Yes", "No", "NA"])}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Issues during Unloading</label>
              {renderRadioGroup("unloadingIssues", ["Yes", "No", "NA"])}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Line Items</CardTitle>
          <Button variant="outline" size="sm">
            Add Line Item
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-gray-500 font-medium">SKU</TableHead>
                <TableHead className="text-gray-500 font-medium">Primary Unit</TableHead>
                <TableHead className="text-gray-500 font-medium">Primary Units / Pkg</TableHead>
                <TableHead className="text-gray-500 font-medium">Pack Unit</TableHead>
                <TableHead className="text-gray-500 font-medium">Pkg Qty</TableHead>
                <TableHead className="text-gray-500 font-medium">Unit</TableHead>
                <TableHead className="text-gray-500 font-medium">Expected Qty</TableHead>
                <TableHead className="text-gray-500 font-medium">Confirmed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ibqaLineItems.map((item, index) => (
                <TableRow key={index} className="border-b border-gray-100">
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>{item.primaryUnit}</TableCell>
                  <TableCell>{item.primaryUnitsPerPkg}</TableCell>
                  <TableCell>{item.packUnit}</TableCell>
                  <TableCell>{item.pkgQty}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.expectedQty}</TableCell>
                  <TableCell>
                    <Input className="w-20" />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t-2 border-gray-200 bg-gray-50">
                <TableCell className="font-semibold">Total</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="font-semibold">3100</TableCell>
                <TableCell className="font-semibold">0</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Attachments Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Attachments</CardTitle>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="relative border border-gray-200 rounded-lg p-3 bg-white">
                <button className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-600">
                  <X className="h-3 w-3" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                    QR
                  </div>
                  <div>
                    <div className="font-medium text-sm">{attachment.filename}</div>
                    <div className="text-xs text-gray-500">{attachment.type}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
  
  const sortingPerformTab = () => (
     <div className="">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Comment Section */}
          <div className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-end">
              <Button onClick={handleAddComment} variant="outline">
                Add Comment
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {comment.category}
                      </span>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div className="font-medium text-gray-900">{comment.author}</div>
                      <div>{comment.timestamp}</div>
                    </div>
                  </div>
                  <p className="text-gray-900">{comment.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Attachments</CardTitle>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="relative border border-gray-200 rounded-lg p-3 bg-white">
                <button className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-600">
                  <X className="h-3 w-3" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                    QR
                  </div>
                  <div>
                    <div className="font-medium text-sm">{attachment.filename}</div>
                    <div className="text-xs text-gray-500">{attachment.type}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
  
  const renderReviewOveragePerformTab = () => (
    <div className="space-y-6">
      {/* Checklist Section */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 rounded-md border border-gray-100 p-4">
            {reviewOverageChecklist.map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100 last:border-b-0">
                <div className="text-sm font-medium text-gray-700">{item.label}</div>
                <div className="text-sm text-gray-900">{item.value}</div>
              </div>
            ))}
          </div>
        </CardContent>

      {/* Line Items Section */}
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Line Items</CardTitle>
          <Button variant="outline" size="sm">
            Add Line Item
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          <div className="rounded border">
            <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-gray-500 font-medium">SKU</TableHead>
                <TableHead className="text-gray-500 font-medium">Primary Unit</TableHead>
                <TableHead className="text-gray-500 font-medium">Primary Units / Pkg</TableHead>
                <TableHead className="text-gray-500 font-medium">Pack Unit</TableHead>
                <TableHead className="text-gray-500 font-medium">Pkg Qty</TableHead>
                <TableHead className="text-gray-500 font-medium">Unit</TableHead>
                <TableHead className="text-gray-500 font-medium">Expected Qty</TableHead>
                <TableHead className="text-gray-500 font-medium">Confirmed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviewOverageLineItems.map((item, index) => (
                <TableRow key={index} className="border-b border-gray-100">
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>{item.primaryUnit}</TableCell>
                  <TableCell>{item.primaryUnitsPerPkg}</TableCell>
                  <TableCell>{item.packUnit}</TableCell>
                  <TableCell>{item.pkgQty}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.expectedQty}</TableCell>
                  <TableCell>
                    <Input className="w-20" />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t-2 border-gray-200 bg-gray-50">
                <TableCell className="font-semibold">Total</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="font-semibold">3100</TableCell>
                <TableCell className="font-semibold">0</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          </div>
        </CardContent>

      {/* Attachments Section */}
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Attachments</CardTitle>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="relative border border-gray-200 rounded-lg p-3 bg-white">
                <button className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-600">
                  <X className="h-3 w-3" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                    QR
                  </div>
                  <div>
                    <div className="font-medium text-sm">{attachment.filename}</div>
                    <div className="text-xs text-gray-500">{attachment.type}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
  
  const renderPerformTab = (performTab:string) => {
    switch(performTab){
        case "unloading":
          return unLoadingPerformTab()
        case "ibqa":
          return IBQAPerformTab()
        case "sorting":
          return sortingPerformTab()
        case "reviewoverage":
          return renderReviewOveragePerformTab()
        case "receiving-putaway":
          return receivingPutawayPerfromTab()
        default:
          return unLoadingPerformTab();
    }
  }

  const renderOrderDetailsTab = () => (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Other Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-8">
            {/* Column 1 */}
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Appointment Date</label>
                <div className="font-medium">06/12/2025</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Trailer Type</label>
                <div className="font-medium">Reefer</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Trailer #</label>
                <div className="font-medium">TX-9087</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Bill of Landing</label>
                <div className="font-medium">BL465351</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Total Package Qty & Units</label>
                <div className="font-medium">120 Boxes</div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Delivery Date</label>
                <div className="flex items-center gap-2">
                  <span className="font-medium">06/15/2025</span>
                  <button className="text-orange-600 text-sm hover:underline">Change</button>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Cargo Type</label>
                <div className="font-medium">Perishable</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Tracking / Pro #</label>
                <div className="font-medium">PRO65546</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Carrier Instructions</label>
                <div className="font-medium">Handle with Care</div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Transportation Method</label>
                <div className="font-medium">Truck</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Load Type</label>
                <div className="font-medium">Full Load</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Seal #</label>
                <div className="font-medium">SA78914</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Warehouse Instructions</label>
                <div className="font-medium">Unload at Dock 4</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
  
  const renderTaskDetailsTab = () => (
    <div className="">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Task Details</CardTitle>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-8">
            {/* Column 1 */}
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Planned Start</label>
                <div className="font-medium">06/12/2025, 11:00 AM</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Assigned To</label>
                <div className="font-medium">Mark Bell</div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Planned End</label>
                <div className="font-medium">06/15/2025, 11:00 AM</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Actual Start</label>
                <div className="font-medium">06/13/2025, 08:32 AM</div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Estimated Time</label>
                <div className="font-medium">120 min</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Actual End</label>
                <div className="font-medium">06/13/2025, 11:18 AM</div>
              </div>
            </div>

            {/* Column 4 */}
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Priority</label>
                <div className="font-medium">High</div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Actual Time</label>
                <div className="font-medium">131 min</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
 
  const renderCommentsTab = () => (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Comment Section */}
          <div className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-end">
              <Button onClick={handleAddComment} variant="outline">
                Add Comment
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {comment.category}
                      </span>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div className="font-medium text-gray-900">{comment.author}</div>
                      <div>{comment.timestamp}</div>
                    </div>
                  </div>
                  <p className="text-gray-900">{comment.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
   
  const renderLogsTab = () => (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-8 h-full">
          <div className="border-r border-gray-200 pr-8">
            <LogTimeline logs={orderLogs} title="Order Logs" />
          </div>
          <div className="pl-8">
            <LogTimeline logs={taskLogs} title="Task Logs" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
  
  const receivingPutawayPerfromTab = () => {
      return <PalletAssignmentTab />
  }
  
  const renderTabContent = (tabId: string) => {
    console.log("TabId, type :", tabId, type)
    switch (tabId) {
      case "perform":
        return renderPerformTab(type)
      case "order-details":
        return renderOrderDetailsTab()
      case "task-details":
        return renderTaskDetailsTab()
      case "comments":
        return renderCommentsTab()
      case "logs":
        return renderLogsTab()
      
      default:
        return renderPerformTab(type)
    }
  }
 
  const handleGoBack = (task: Task) => {
    router.push(`/tasks`)
  }
  if (loading || !task) {
    return <div></div>
  }

  return (
    <div className="bg-dashboard-background flex flex-col">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col">
        <div className="px-4">
          <div className="max-w-dashboard mx-auto w-full">
            {/* Page Header */}
            <div className="mb-dashboard-gap">
              <PageHeader
                title={
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xl font-semibold">I-0007263 - Unloading</span>
                  </div>
                }
                breadcrumbItems={[
                  { label: "Home", href: "/" },
                  { label: "Tasks", href: "/tasks" },
                  { label: "Task Management", href: "/tasks" },
                ]}
                onMenuClick={handleMenuClick}
                actions={
                   <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleGoBack}>
                        ← Go Back
                      </Button>
                      <Button variant="outline" size="sm">
                        Task Progress
                      </Button>
                    </div>
                }
              />
            </div>

            {/* Task Information Card */}
            <div className="mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 grid-rows-3 gap-1 mb-4">
                    <div>
                      <label className="text-sm text-gray-500">Transaction ID</label>
                      <div className="font-semibold text-orange-600">TRN123456789</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Reference #</label>
                      <div className="font-medium">REF987654321</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Order Type</label>
                      <div className="font-medium">Inbound</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Movement Type</label>
                      <div className="font-medium">Container Unloading</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Customer Name</label>
                      <div className="font-medium">Blue Moon</div>
                    </div>
                  </div>


                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <label className="text-sm text-gray-500">Assigned to</label>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Mike Hussey</span>
                          <button className="text-orange-600 text-sm hover:underline">Reassign</button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-gray-100">
                        ☐ Hold
                      </Button>
                      <Button variant="outline" size="sm" className="bg-gray-100">
                        ⏸ Pause
                      </Button>
                      <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                        ✓ Complete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Swipeable Tabs */}
        <div className="">
          <SwipeableTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            renderContent={renderTabContent}
          />
        </div>
      </div>
    </div>
  )
}
