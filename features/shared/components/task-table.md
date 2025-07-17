# TaskTable Component

A reusable task table component that can be used across the application to display tasks with consistent styling and functionality.

## Features

- **Consistent Design**: Matches the application's design system
- **Empty State**: Beautiful empty state with "Create Task" button
- **Customizable**: Flexible props for different use cases
- **Status Badges**: Color-coded status indicators
- **Actions**: Optional action buttons for task management
- **Responsive**: Works well on different screen sizes

## Usage

### Basic Usage

```tsx
import { TaskTable, type TaskItem } from "@/features/shared/components/task-table"

const tasks: TaskItem[] = [
  {
    id: "1",
    task: "Review order details",
    assignedTo: "John Doe",
    priority: "High",
    status: "In Progress"
  },
  // ... more tasks
]

function MyComponent() {
  return (
    <TaskTable 
      tasks={tasks}
      onCreateTask={() => console.log("Create task")}
      onTaskAction={(taskId) => console.log("Task action:", taskId)}
    />
  )
}
```

### With Custom Empty State

```tsx
<TaskTable 
  tasks={[]}
  emptyStateTitle="No Project Tasks"
  emptyStateDescription="Create your first task to get started with this project."
  onCreateTask={handleCreateTask}
/>
```

### Without Actions

```tsx
<TaskTable 
  tasks={tasks}
  showActions={false}
  emptyStateTitle="Task History"
  emptyStateDescription="No completed tasks to display."
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tasks` | `TaskItem[]` | `[]` | Array of tasks to display |
| `showActions` | `boolean` | `true` | Whether to show action buttons |
| `onCreateTask` | `() => void` | `undefined` | Callback for create task button |
| `onTaskAction` | `(taskId: string) => void` | `undefined` | Callback for task action buttons |
| `emptyStateTitle` | `string` | `"No Tasks"` | Title for empty state |
| `emptyStateDescription` | `string` | `"No tasks have been added to this order."` | Description for empty state |
| `className` | `string` | `undefined` | Additional CSS classes |

## TaskItem Type

```tsx
interface TaskItem {
  id: string
  task: string
  assignedTo: string | null
  priority: "Low" | "Medium" | "High"
  status: "In Progress" | "Paused" | "On Hold" | "Yet to Start" | "Waiting" | "Started" | "Completed"
}
```

## Status Colors

- **In Progress**: Orange
- **Paused**: Purple  
- **On Hold**: Pink
- **Yet to Start**: Cyan
- **Waiting**: Yellow
- **Started**: Green
- **Completed**: Blue

## Examples Across the App

### Order Details Page
Used to display tasks related to a specific order.

### Project Management Page
Used to display project tasks with creation capabilities.

### User Dashboard
Used to display assigned tasks without creation buttons.

### Task History Page
Used to display completed tasks without actions.
