import type { Task, AttentionItem } from "../types"

export function formatTimeElapsed(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

export function getTaskPriority(task: Task): "high" | "medium" | "low" {
  const timeInMinutes = Number.parseInt(task.timeElapsed)
  if (timeInMinutes > 45) return "high"
  if (timeInMinutes > 20) return "medium"
  return "low"
}

export function filterAttentionItems(items: AttentionItem[], status?: string): AttentionItem[] {
  if (!status || status === "all") return items
  return items.filter((item) => item.status.toLowerCase() === status.toLowerCase())
}

export function calculateCompletionRate(completed: number, total: number): string {
  if (total === 0) return "0%"
  return `${Math.round((completed / total) * 100)}%`
}
