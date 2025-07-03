"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable, type DataTableColumn } from "@/components/shared/data-table"
import { Upload, Download, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { attachmentsData } from "../mocks/attachments-data"
import type { Attachment } from "../types"

const columns: DataTableColumn<Attachment>[] = [
  {
    key: "id",
    header: "",
    render: () => <Checkbox />,
    className: "w-12",
  },
  {
    key: "documentName",
    header: "Document Name",
    className: "font-medium",
  },
  {
    key: "category",
    header: "Category",
    render: (value: string) => <Input value={value} readOnly className="border-0 bg-transparent p-0 h-auto" />,
  },
  {
    key: "id",
    header: "Actions",
    render: () => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
    className: "w-24",
  },
]

export function AttachmentsTable() {
  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Attachments</h2>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>
      <div className="flex-1 min-h-0">
        <DataTable data={attachmentsData} columns={columns} />
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Supported file types are: [.jpg, .png, .jpeg, .pdf, .csv, .xls, .xlsx, .doc, .docx, .zpl (Shipping Label Only)]
        and the maximum size is 10MB
      </div>
    </div>
  )
}
