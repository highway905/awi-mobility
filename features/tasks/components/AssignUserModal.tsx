import React, { useState, useRef } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SimpleTable, type SimpleTableColumn, type SimpleTableRef } from '@/features/shared/components/SimpleTable'
import { Search } from 'lucide-react'

interface User {
  id: string
  name: string
  currentTasks: number
  isSelected?: boolean
}

interface AssignUserModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (selectedUsers: User[]) => void
  taskId?: string
}

const mockUsers: User[] = [
  { id: '1', name: 'Alexandra Smith', currentTasks: 3 },
  { id: '2', name: 'Christopher Brown', currentTasks: 9 },
  { id: '3', name: 'Emily Davis', currentTasks: 1 },
  { id: '4', name: 'Michael Johnson', currentTasks: 4, isSelected: true },
  { id: '5', name: 'Jessica Wilson', currentTasks: 6 },
  { id: '6', name: 'Daniel Garcia', currentTasks: 8 },
  { id: '7', name: 'Sophia Martinez', currentTasks: 0 },
  { id: '8', name: 'Robert Taylor', currentTasks: 2 },
  { id: '9', name: 'Lisa Anderson', currentTasks: 5 },
  { id: '10', name: 'James Wilson', currentTasks: 7 },
  { id: '11', name: 'Maria Rodriguez', currentTasks: 1 },
  { id: '12', name: 'David Thompson', currentTasks: 3 },
  { id: '13', name: 'Sarah Johnson', currentTasks: 4 },
  { id: '14', name: 'Kevin Brown', currentTasks: 2 },
  { id: '15', name: 'Amanda Davis', currentTasks: 6 },
  { id: '16', name: 'Mark Wilson', currentTasks: 3 },
  { id: '17', name: 'Jennifer Lee', currentTasks: 5 },
  { id: '18', name: 'Thomas Anderson', currentTasks: 2 },
  { id: '19', name: 'Michelle Garcia', currentTasks: 7 },
  { id: '20', name: 'Christopher Davis', currentTasks: 1 },
  { id: '21', name: 'Ashley Martinez', currentTasks: 4 },
  { id: '22', name: 'Matthew Brown', currentTasks: 6 },
  { id: '23', name: 'Nicole Johnson', currentTasks: 0 },
  { id: '24', name: 'Andrew Wilson', currentTasks: 8 },
  { id: '25', name: 'Stephanie Taylor', currentTasks: 3 },
]

export function AssignUserModal({ isOpen, onClose, onAssign, taskId }: AssignUserModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [displayedUsers, setDisplayedUsers] = useState<User[]>(mockUsers.slice(0, 10))
  const [hasNextPage, setHasNextPage] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  
  // Use useRef instead of useState to avoid re-renders
  const tableRef = useRef<SimpleTableRef<User>>(null)

  const filteredUsers = displayedUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Simulate infinite scroll loading
  const fetchNextPage = async () => {
    if (isLoadingMore || !hasNextPage) return
    
    setIsLoadingMore(true)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const currentLength = displayedUsers.length
    const nextBatch = mockUsers.slice(currentLength, currentLength + 5)
    
    if (nextBatch.length > 0) {
      setDisplayedUsers(prev => [...prev, ...nextBatch])
    }
    
    // Check if we have more data
    setHasNextPage(currentLength + nextBatch.length < mockUsers.length)
    setIsLoadingMore(false)
  }

  const columns: SimpleTableColumn<User>[] = [
    {
      key: "name",
      header: "User",
      render: (value: string) => <span className="text-gray-900 font-medium">{value}</span>,
      sortable: true,
      minWidth: 200,
    },
    {
      key: "currentTasks",
      header: "Current Tasks",
      render: (value: number) => (
        <div className="text-right">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === 0 ? 'bg-green-100 text-green-800' :
            value <= 3 ? 'bg-blue-100 text-blue-800' :
            value <= 6 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {value}
          </span>
        </div>
      ),
      sortable: true,
      minWidth: 120,
    },
  ]

  const handleAssign = () => {
    if (tableRef.current) {
      const selectedUsers = tableRef.current.getSelectedData()
      onAssign(selectedUsers)
    }
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      width="500px"
      height="550px"
      className="flex flex-col"
    >
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <ModalHeader title="Assign User" onClose={onClose} />
      </div>
      
      {/* Scrollable Body */}
      <div className="flex-1 flex flex-col min-h-0 p-6">
        {/* Search - Fixed within body */}
        <div className="relative mb-4 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table Container - Flexible height */}
        <div className="flex-1 min-h-0 border border-gray-200 rounded-lg overflow-hidden">
          <SimpleTable.Root
            ref={tableRef}
            data={filteredUsers}
            columns={columns}
            enableSelection={true}
            emptyMessage="No users found matching your search"
            hasNextPage={hasNextPage && searchQuery === ''} // Only show infinite scroll when not searching
            isFetchingNextPage={isLoadingMore}
            fetchNextPage={fetchNextPage}
            className="h-full"
          >
            <SimpleTable.Loading />
            <SimpleTable.Container className="h-full">
              <SimpleTable.Table>
                <SimpleTable.Header />
                <SimpleTable.Body />
              </SimpleTable.Table>
            </SimpleTable.Container>
          </SimpleTable.Root>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0">
        <ModalFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            className="bg-yellow-400 text-black hover:bg-yellow-500"
          >
            Assign
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  )
}