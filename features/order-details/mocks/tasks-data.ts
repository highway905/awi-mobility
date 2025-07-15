import type { Task } from "../types"

export const tasksData: Task[] = [
  {
    id: "1",
    task: "Move inventory to B2C Shelf",
    assignedTo: "Ethan Walker",
    priority: "High",
    status: "In Progress",
  },
  {
    id: "2",
    task: "Picking",
    assignedTo: "Emma Brown",
    priority: "Low",
    status: "Paused",
  },
  {
    id: "3",
    task: "Packing",
    assignedTo: "Ava Wilson",
    priority: "High",
    status: "On Hold",
  },
  {
    id: "4",
    task: "Assign Carrier Labeling",
    assignedTo: "Noah Davis",
    priority: "Low",
    status: "Yet to Start",
  },
  {
    id: "5",
    task: "Loading",
    assignedTo: null,
    priority: "Medium",
    status: "Waiting",
  },
]

export const statusStyles = {
  "In Progress": "bg-orange-100 text-orange-800",
  Paused: "bg-purple-100 text-purple-800",
  "On Hold": "bg-pink-100 text-pink-800",
  "Yet to Start": "bg-cyan-100 text-cyan-800",
  Waiting: "bg-yellow-100 text-yellow-800",
}
