export type TabType = 'order-details' | 'tasks' | 'attachments' | 'transportation' | 
  'shipping' | 'picking' | 'pricing' | 'log' | 'warehouse';

export type SkeletonType = 'table' | 'form' | 'details';

export const tabs = [
  { id: "order-details", label: "Order Details" },
  { id: "tasks", label: "Tasks" },
  { id: "attachments", label: "Attachments" },
  { id: "transportation", label: "Transportation Details" },
  { id: "shipping", label: "Shipping & Tracking" },
  { id: "picking", label: "Picking & Packing" },
  { id: "pricing", label: "Pricing" },
  { id: "log", label: "Log" },
  { id: "warehouse", label: "Warehouse Action" },
];

export function getSkeletonTypeForTab(tabId: TabType): SkeletonType {
  switch (tabId) {
    case "tasks":
    case "attachments":
    case "pricing":
      return "table"
    case "transportation":
    case "shipping":
    case "picking":
      return "form"
    default:
      return "details"
  }
}
