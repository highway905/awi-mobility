"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable, type DataTableColumn } from "@/features/shared/components/data-table"
import { Upload, Download, Trash2, Camera } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { GlobalErrorFallback } from "@/components/shared"
import { SearchWithCamera } from "@/components/ui/search-with-camera"

interface APIAttachment {
  id: string;
  fileTempName: string;
  fileActualName: string;
  categoryName: string;
  categoryId: string;
}

// Create a type for the display in the table
interface AttachmentRow {
  id: string;
  documentName: string;
  category: string;
}

interface AttachmentsTableProps {
  attachments: APIAttachment[];
}

export function AttachmentsTable({ attachments }: AttachmentsTableProps) {
  // Transform API data for display
  const attachmentRows: AttachmentRow[] = attachments.map(attachment => ({
    id: attachment.id,
    documentName: attachment.fileActualName,
    category: attachment.categoryName,
  }));

  // Create empty state component
  const emptyState = (
    <GlobalErrorFallback 
      variant="card"
      title="No attachments found"
      description="No documents have been attached to this order yet."
      showRetry={false}
    />
  );

  const columns: DataTableColumn<AttachmentRow>[] = [
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
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="Download">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Delete" className="text-red-500 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "w-24 text-right",
    },
  ]

  return (
    <DataTable 
      columns={columns} 
      data={attachmentRows} 
      emptyState={emptyState}
    />
  )
}

// Create the actions component for the TabContentWrapper
export function AttachmentsActions() {
  return (
    <div className="flex items-center gap-2">
      {/* <SearchWithCamera 
        placeholder="Search attachments..." 
        width="240px" 
        onCamera={() => {
          // Handle camera/barcode scanning for documents
          alert("Camera functionality would open here");
        }}
      /> */}
      <Button size="sm">
        <Upload className="h-4 w-4 mr-2" /> Upload
      </Button>
    </div>
  )
}
