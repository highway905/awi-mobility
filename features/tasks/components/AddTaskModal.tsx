import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Upload, Image as ImageIcon, FileText } from 'lucide-react'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (taskData: any) => void
}

interface AttachmentFile {
  id: string
  name: string
  size: string
  type: string
  file?: File
  preview?: string
}

export function AddTaskModal({ isOpen, onClose, onSubmit }: AddTaskModalProps) {
  const [taskType, setTaskType] = useState('Lunch')
  const [comments, setComments] = useState('')
  const [attachments, setAttachments] = useState<AttachmentFile[]>([
    {
      id: '1',
      name: 'SKU-GHIJ5678.jpg',
      size: '256 KB',
      type: 'GR Image'
    }
  ])
  const [attachmentType, setAttachmentType] = useState('GR Image')
  const [showUploadModal, setShowUploadModal] = useState(false)

  const handleSubmit = () => {
    const taskData = {
      taskType,
      comments,
      attachments,
    }
    onSubmit(taskData)
    onClose()
  }

  const handleCreateAndStart = () => {
    handleSubmit()
    // Additional logic for create and start
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }

  // Step 1: Show upload modal (Image 1 or Image 2 based on attachments)
  const handleAddAttachment = () => {
    setShowUploadModal(true)
  }

  // Step 2: Open file system when clicking "Add Attachment" in upload modal
  const handleFileSystemOpen = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.jpg,.png,.jpeg,.pdf,.csv,.xls,.xlsx,.doc,.docx'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        handleFileSelect(file)
      }
    }
    input.click()
  }

  // Step 3: Handle file selection and add to attachments
  const handleFileSelect = (file: File) => {
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must not exceed 10MB')
      return
    }
    
    const newAttachment: AttachmentFile = {
      id: Date.now().toString(),
      name: file.name,
      size: `${Math.round(file.size / 1024)} KB`,
      type: attachmentType,
      file: file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }
    
    setAttachments(prev => [...prev, newAttachment])
  }

  const handleUploadModalClose = () => {
    setShowUploadModal(false)
  }

  const handleUploadSubmit = () => {
    setShowUploadModal(false)
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <ImageIcon className="h-6 w-6 text-blue-500" />
    }
    return <FileText className="h-6 w-6 text-gray-500" />
  }

  // Upload Modal - Shows Image 1 (empty) or Image 2 (with attachments)
  if (showUploadModal) {
    const hasAttachments = attachments.length > 0

    return (
      <div className="fixed inset-4 z-[60] bg-white rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Upload Attachment</h2>
          <button
            onClick={handleUploadModalClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          <p className="text-sm text-gray-600 mb-8">
            Upload .jpg, .png, .jpeg, .pdf, .csv, .xls, .xlsx, .doc, or .docx file not more than 10MB.
          </p>

          {hasAttachments ? (
            // Image 2: Show existing attachments
            <>
              {attachments.map((attachment) => (
                <div key={attachment.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-4">
                    {/* File Thumbnail */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {attachment.preview ? (
                        <img 
                          src={attachment.preview} 
                          alt="Preview" 
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                      ) : (
                        getFileIcon(attachment.name)
                      )}
                    </div>
                    
                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{attachment.name}</div>
                      <div className="text-sm text-gray-500">{attachment.size}</div>
                    </div>
                    
                    {/* Attachment Type Selector */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-sm font-medium text-gray-900">
                        Attachment Type <span className="text-red-500">*</span>
                      </div>
                      <Select value={attachment.type} onValueChange={(value) => {
                        setAttachments(prev => prev.map(att => 
                          att.id === attachment.id ? { ...att, type: value } : att
                        ))
                      }}>
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GR Image">GR Image</SelectItem>
                          <SelectItem value="Document">Document</SelectItem>
                          <SelectItem value="Photo">Photo</SelectItem>
                          <SelectItem value="Invoice">Invoice</SelectItem>
                          <SelectItem value="Receipt">Receipt</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeAttachment(attachment.id)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Another Attachment */}
              <div 
                onClick={handleFileSystemOpen}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <Button
                  type="button"
                  variant="outline"
                  className="border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 pointer-events-none"
                >
                  Add Attachment
                </Button>
              </div>
            </>
          ) : (
            // Image 1: Empty state
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload</h3>
              <p className="text-gray-500 mb-4">
                You don't have any attachments.<br />
                Start by adding an attachment
              </p>
              <Button
                onClick={handleFileSystemOpen}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Add Attachment
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
          <Button
            onClick={handleUploadModalClose}
            variant="outline"
            className="text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUploadSubmit}
            className="bg-yellow-400 text-black hover:bg-yellow-500"
          >
            Submit
          </Button>
        </div>
      </div>
    )
  }

  // Main Add Task Modal
  return (
    <Modal 
      isOpen={isOpen && !showUploadModal} 
      onClose={onClose}
      width="600px"
      height="auto"
    >
      <ModalHeader title="Add Task" onClose={onClose} />
      
      <ModalBody className="flex-1 overflow-y-auto">
        {/* Task Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Task Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="taskType"
                value="Cycle Count"
                checked={taskType === 'Cycle Count'}
                onChange={(e) => setTaskType(e.target.value)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Cycle Count</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="taskType"
                value="Lunch"
                checked={taskType === 'Lunch'}
                onChange={(e) => setTaskType(e.target.value)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Lunch</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="taskType"
                value="Maintenance"
                checked={taskType === 'Maintenance'}
                onChange={(e) => setTaskType(e.target.value)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Maintenance</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="taskType"
                value="Downtime"
                checked={taskType === 'Downtime'}
                onChange={(e) => setTaskType(e.target.value)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Downtime</span>
            </label>
          </div>
        </div>

        {/* Comments */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Comments
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add your comment..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* Existing Attachments */}
        {attachments.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Attachments
            </label>
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md mb-3">
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                  {attachment.preview ? (
                    <img 
                      src={attachment.preview} 
                      alt="Attachment" 
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    getFileIcon(attachment.name)
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">{attachment.name}</div>
                  <div className="text-xs text-gray-500">{attachment.size}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-900">
                    Attachment Type <span className="text-red-500">*</span>
                  </div>
                  <Select value={attachment.type} onValueChange={(value) => {
                    setAttachments(prev => prev.map(att => 
                      att.id === attachment.id ? { ...att, type: value } : att
                    ))
                  }}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GR Image">GR Image</SelectItem>
                      <SelectItem value="Document">Document</SelectItem>
                      <SelectItem value="Photo">Photo</SelectItem>
                    </SelectContent>
                  </Select>
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ModalBody>

      <ModalFooter className='justify-between'>
        {/* Add Attachment Button - Full Width in Footer */}
        <Button
          variant="outline"
          onClick={handleAddAttachment}
          className=" border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 mb-4"
        >
          Add Attachment
        </Button>
        
        {/* Action Buttons */}
        <div className="flex gap-3 ">
          <Button
            variant="outline"
            onClick={handleCreateAndStart}
            className="flex-1 bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
          >
            Create & Start
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500"
          >
            Create Task
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}